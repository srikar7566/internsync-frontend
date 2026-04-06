import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from sessionStorage on page reload
  useEffect(() => {
    const saved = sessionStorage.getItem('internsync_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedInUser = await authAPI.login(email, password);
      setUser(loggedInUser);
      sessionStorage.setItem('internsync_user', JSON.stringify(loggedInUser));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid email or password' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const newUser = await authAPI.register(name, email, password, role);
      setUser(newUser);
      sessionStorage.setItem('internsync_user', JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('internsync_user');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
