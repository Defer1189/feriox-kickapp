import axios from 'axios';
import { config } from '../config/config.js';

/**
 * Cliente para interactuar con la API de KICK
 */
class KickService {
  constructor() {
    this.baseURL = config.kickApiBaseUrl;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Obtener información de un canal por nombre de usuario
   * @param {string} username - Nombre de usuario del canal
   * @returns {Promise<Object>} - Información del canal
   */
  async getChannelByUsername(username) {
    try {
      const response = await this.client.get(`/channels/${username}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Error al obtener el canal ${username}`);
    }
  }

  /**
   * Obtener canales en vivo
   * @param {number} page - Número de página
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Object>} - Lista de canales en vivo
   */
  async getLiveChannels(page = 1, limit = 25) {
    try {
      const response = await this.client.get('/channels/live', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Error al obtener canales en vivo');
    }
  }

  /**
   * Buscar canales
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Object>} - Resultados de búsqueda
   */
  async searchChannels(query) {
    try {
      const response = await this.client.get('/search/channels', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Error al buscar canales');
    }
  }

  /**
   * Obtener información de categorías
   * @returns {Promise<Object>} - Lista de categorías
   */
  async getCategories() {
    try {
      const response = await this.client.get('/categories');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Error al obtener categorías');
    }
  }

  /**
   * Obtener información de una categoría específica
   * @param {string} slug - Slug de la categoría
   * @returns {Promise<Object>} - Información de la categoría
   */
  async getCategoryBySlug(slug) {
    try {
      const response = await this.client.get(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Error al obtener la categoría ${slug}`);
    }
  }

  /**
   * Manejo de errores de la API
   * @private
   */
  handleError(error, customMessage) {
    if (error.response) {
      // Error de respuesta del servidor
      return {
        message: customMessage,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // No se recibió respuesta
      return {
        message: 'No se pudo conectar con la API de KICK',
        status: 503
      };
    } else {
      // Error en la configuración de la petición
      return {
        message: customMessage || error.message,
        status: 500
      };
    }
  }
}

export default new KickService();
