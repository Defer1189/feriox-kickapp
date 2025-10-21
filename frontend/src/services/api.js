import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service methods
export const api = {
  /**
   * Get API health status
   */
  getHealth: async () => {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  /**
   * Get API information
   */
  getInfo: async () => {
    const response = await apiClient.get('/api/info');
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getUser: async () => {
    const response = await apiClient.get('/api/auth/user');
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  /**
   * Get login URL
   */
  getLoginUrl: () => {
    return `${API_BASE_URL}/api/auth/login`;
  },
};

export default api;
