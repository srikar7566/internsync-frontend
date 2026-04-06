import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardContent } from '../../components/Card';
import { Star } from 'lucide-react';

export default function Feedback() {
  const { user } = useAuth();
  const { data, loading, error } = useData();

  const myFeedbacks = data.feedbacks.filter(f => f.studentId === user.id);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Feedback & Ratings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myFeedbacks.map(feedback => {
          const internship = data.internships.find(i => i.id === feedback.internshipId);
          return (
            <Card key={feedback.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{internship?.title || 'Unknown Internship'}</h3>
                    <p className="text-sm text-gray-500">{internship?.company}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                    <span className="text-yellow-700 font-bold mr-1">{feedback.rating}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin Remarks</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {feedback.remarks}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {myFeedbacks.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500">No feedback received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
