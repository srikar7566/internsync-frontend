import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import Badge from '../../components/Badge';

export default function TaskBoard() {
  const { data, loading, error, addTask } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');
  const [internshipId, setInternshipId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const approvedApplications = data.applications.filter(a => a.status === 'approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await addTask({ title, description, studentId: Number(studentId), internshipId: Number(internshipId) });
      setTitle('');
      setDescription('');
      setStudentId('');
      setInternshipId('');
    } catch (err) {
      setFormError('Failed to assign task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Assign Task</CardTitle>
            </CardHeader>
            <CardContent>
              {formError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student (Approved)</label>
                  <select
                    required
                    value={`${studentId}|${internshipId}`}
                    onChange={(e) => {
                      const [sId, iId] = e.target.value.split('|');
                      setStudentId(sId);
                      setInternshipId(iId);
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="|">Select a student</option>
                    {approvedApplications.map(app => {
                      const internship = data.internships.find(i => i.id === app.internshipId);
                      return (
                        <option key={app.id} value={`${app.studentId}|${app.internshipId}`}>
                          Student #{app.studentId} — {internship?.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!studentId || submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? 'Assigning...' : 'Assign Task'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {data.tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.tasks.map(task => (
                    <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">{task.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">Student ID: {task.studentId}</p>
                        </div>
                        <Badge variant={
                          task.status === 'done' ? 'success' :
                          task.status === 'in-progress' ? 'primary' : 'default'
                        }>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                      {task.report && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700 border border-gray-200">
                          <span className="font-semibold block mb-1">Student Report:</span>
                          {task.report}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
