import Students from './pages/student/Students';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import PostInternship from './pages/admin/PostInternship';
import AdminTaskBoard from './pages/admin/TaskBoard';
import AdminFeedback from './pages/admin/Feedback';
import StudentDashboard from './pages/student/Dashboard';
import StudentTaskBoard from './pages/student/TaskBoard';
import StudentFeedback from './pages/student/Feedback';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin' : '/student'}
        replace
      />
    );
  }

  return <Layout>{children}</Layout>;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />
            : <Login />
        }
      />

      <Route
        path="/register"
        element={
          user
            ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />
            : <Register />
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRole="admin">
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/post-internship"
        element={
          <ProtectedRoute allowedRole="admin">
            <PostInternship />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tasks"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminTaskBoard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminFeedback />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/tasks"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentTaskBoard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/feedback"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentFeedback />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}