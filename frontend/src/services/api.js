import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Cliente API para comunicación con el backend
 */
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor para manejar errores
 */
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Servicios de la API
 */
export const kickApi = {
  /**
   * Obtener información de un canal
   */
  getChannel: async (username) => {
    const response = await api.get(`/channels/${username}`);
    return response.data;
  },

  /**
   * Obtener canales en vivo
   */
  getLiveChannels: async (page = 1, limit = 25) => {
    const response = await api.get('/channels/live', {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * Buscar canales
   */
  searchChannels: async (query) => {
    const response = await api.get('/search', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Obtener categorías
   */
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  /**
   * Obtener categoría por slug
   */
  getCategory: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;
