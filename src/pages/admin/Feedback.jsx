import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Star } from 'lucide-react';

export default function Feedback() {
  const { data, loading, error, addFeedback } = useData();
  const [studentId, setStudentId] = useState('');
  const [internshipId, setInternshipId] = useState('');
  const [rating, setRating] = useState(5);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const approvedApplications = data.applications.filter(a => a.status === 'approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await addFeedback({ studentId: Number(studentId), internshipId: Number(internshipId), rating, remarks });
      setStudentId('');
      setInternshipId('');
      setRating(5);
      setRemarks('');
    } catch (err) {
      setFormError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Feedback & Ratings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Provide Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {formError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
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
                  <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                  <div className="flex items-center mt-1 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <textarea
                    required
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!studentId || submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Given Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {data.feedbacks.length === 0 ? (
                <p className="text-gray-500 text-sm">No feedback given yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.feedbacks.map(feedback => {
                    const internship = data.internships.find(i => i.id === feedback.internshipId);
                    return (
                      <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Student ID: {feedback.studentId}</h4>
                            <p className="text-xs text-gray-500">{internship?.title}</p>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{feedback.remarks}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
