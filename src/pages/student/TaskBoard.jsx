import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/Card';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';

export default function TaskBoard() {
  const { user } = useAuth();
  const { data, loading, error, updateTaskStatus, submitTaskReport } = useData();
  const [reports, setReports] = useState({});

  const myTasks = data.tasks.filter(t => t.studentId === user.id);
  const totalTasks = myTasks.length;
  const completedTasks = myTasks.filter(t => t.status === 'done').length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const handleReportChange = (taskId, value) => {
    setReports(prev => ({ ...prev, [taskId]: value }));
  };

  const handleSubmitReport = async (taskId) => {
    if (reports[taskId]) {
      await submitTaskReport(taskId, reports[taskId]);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Progress</h3>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{completedTasks} of {totalTasks} tasks completed</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {myTasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <Badge variant={
                  task.status === 'done' ? 'success' :
                  task.status === 'in-progress' ? 'primary' : 'default'
                }>
                  {task.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">{task.description}</p>

              {task.status !== 'done' && (
                <div className="space-y-3">
                  {task.status === 'todo' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in-progress')}
                      className="w-full text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-md transition-colors"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <div className="space-y-2">
                      <textarea
                        placeholder="Enter your report/findings..."
                        rows={3}
                        value={reports[task.id] || ''}
                        onChange={(e) => handleReportChange(task.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        onClick={() => handleSubmitReport(task.id)}
                        disabled={!reports[task.id]}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        Submit Report & Complete
                      </button>
                    </div>
                  )}
                </div>
              )}
              {task.status === 'done' && task.report && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Your Report</span>
                  <p className="text-sm text-gray-700">{task.report}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {myTasks.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500">No tasks assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
