import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook to manage user authentication state
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await api.getUser();
      setUser(data.user);
      setError(null);
    } catch (err) {
      setUser(null);
      // Don't set error for 401 (just means not logged in)
      if (err.response?.status !== 401) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = api.getLoginUrl();
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };
}
