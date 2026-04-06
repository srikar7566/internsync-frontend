import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, CheckSquare, MessageSquare, Users, X } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();

  const adminLinks = [
    { name: 'Dashboard',         path: '/admin',                 icon: LayoutDashboard },
    { name: 'Post Internship',   path: '/admin/post-internship', icon: Briefcase },
    { name: 'Task Board',        path: '/admin/tasks',           icon: CheckSquare },
    { name: 'Feedback',          path: '/admin/feedback',        icon: MessageSquare },
    { name: 'Students',          path: '/admin/students',        icon: Users },
  ];

  const studentLinks = [
    { name: 'Dashboard',          path: '/student',           icon: LayoutDashboard },
    { name: 'My Tasks',           path: '/student/tasks',     icon: CheckSquare },
    { name: 'Feedback & Ratings', path: '/student/feedback',  icon: MessageSquare },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-indigo-600">InternSync</span>
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin' || link.path === '/student'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}
