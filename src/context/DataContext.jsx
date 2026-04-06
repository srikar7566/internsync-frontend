import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { internshipAPI, applicationAPI, taskAPI, feedbackAPI } from '../api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data from backend on mount
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [i, a, t, f] = await Promise.all([
        internshipAPI.getAll(),
        applicationAPI.getAll(),
        taskAPI.getAll(),
        feedbackAPI.getAll(),
      ]);
      setInternships(i);
      setApplications(a);
      setTasks(t);
      setFeedbacks(f);
    } catch (err) {
      setError('Failed to load data from server. Make sure Spring Boot is running on port 8080.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Internships ────────────────────────────────────────
  const addInternship = async (internship) => {
    const created = await internshipAPI.create(internship);
    setInternships((prev) => [...prev, created]);
  };

  const deleteInternship = async (id) => {
    await internshipAPI.delete(id);
    setInternships((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Applications ───────────────────────────────────────
  const applyForInternship = async (internshipId, studentId) => {
    const created = await applicationAPI.apply(internshipId, studentId);
    setApplications((prev) => [...prev, created]);
  };

  const updateApplicationStatus = async (id, status) => {
    const updated = await applicationAPI.updateStatus(id, status);
    setApplications((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  // ── Tasks ──────────────────────────────────────────────
  const addTask = async (task) => {
    const created = await taskAPI.create(task);
    setTasks((prev) => [...prev, created]);
  };

  const updateTaskStatus = async (id, status) => {
    const updated = await taskAPI.updateStatus(id, status);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const submitTaskReport = async (id, report) => {
    const updated = await taskAPI.submitReport(id, report);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // ── Feedbacks ──────────────────────────────────────────
  const addFeedback = async (feedback) => {
    const created = await feedbackAPI.create(feedback);
    setFeedbacks((prev) => [...prev, created]);
  };

  // Expose a flat "data" object so existing page components work unchanged
  const data = { internships, applications, tasks, feedbacks };

  return (
    <DataContext.Provider value={{
      data,
      loading,
      error,
      fetchAll,
      addInternship,
      deleteInternship,
      applyForInternship,
      updateApplicationStatus,
      addTask,
      updateTaskStatus,
      submitTaskReport,
      addFeedback,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
