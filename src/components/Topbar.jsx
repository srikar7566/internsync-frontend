import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Welcome, {user?.name}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
          <User size={16} className="mr-2" />
          <span className="capitalize">{user?.role}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
        >
          <LogOut size={18} className="mr-1" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
