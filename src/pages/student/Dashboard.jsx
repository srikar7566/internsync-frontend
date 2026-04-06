import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import Badge from '../../components/Badge';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, applyForInternship } = useData();

  const myApplications = data.applications.filter(a => a.studentId === user.id);

  const hasApplied = (internshipId) => myApplications.some(a => a.internshipId === internshipId);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Internships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.internships.filter(i => i.status === 'open').map((internship) => (
                <div key={internship.id} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                  <p className="text-sm text-gray-500">{internship.company}</p>
                  <p className="mt-2 text-sm text-gray-600">{internship.description}</p>
                  <div className="mt-4">
                    {hasApplied(internship.id) ? (
                      <Badge variant="primary">Applied</Badge>
                    ) : (
                      <button
                        onClick={() => applyForInternship(internship.id, user.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {data.internships.filter(i => i.status === 'open').length === 0 && (
                <p className="text-gray-500 text-sm">No open internships available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {myApplications.length === 0 ? (
              <p className="text-gray-500 text-sm">You haven't applied to any internships yet.</p>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => {
                  const internship = data.internships.find(i => i.id === app.internshipId);
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{internship?.title || 'Unknown'}</h4>
                        <p className="text-xs text-gray-500">{internship?.company}</p>
                      </div>
                      <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
                        {app.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
