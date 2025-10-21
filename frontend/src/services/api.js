import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// API service object
export const apiService = {
  // Health check
  health: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  // API info
  info: async () => {
    const response = await api.get('/api/info');
    return response.data;
  },

  // Auth endpoints
  auth: {
    status: async () => {
      const response = await api.get('/api/auth/status');
      return response.data;
    },

    login: () => {
      // Redirect to backend login endpoint
      window.location.href = `${API_URL}/api/auth/login`;
    },

    logout: async () => {
      const response = await api.post('/api/auth/logout');
      return response.data;
    }
  },

  // User endpoints
  user: {
    getProfile: async () => {
      const response = await api.get('/api/user');
      return response.data;
    },

    getChannel: async () => {
      const response = await api.get('/api/user/channel');
      return response.data;
    },

    getStreamKey: async () => {
      const response = await api.get('/api/user/streamkey');
      return response.data;
    }
  }
};

export default api;
