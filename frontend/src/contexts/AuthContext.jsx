import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check if the user is authenticated by calling the /api/auth/user endpoint
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/auth/user', {
        withCredentials: true,
      });
      
      if (response.data && response.data.status === 'success') {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Error al verificar autenticación');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the user
   */
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
      });
      setUser(null);
      return true;
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err.response?.data?.message || 'Error al cerrar sesión');
      return false;
    }
  };

  /**
   * Login redirect to backend OAuth endpoint
   */
  const login = () => {
    window.location.href = '/api/auth/login';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
