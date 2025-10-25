/**
 * @fileoverview Cliente HTTP configurado con Axios
 * @module core/api/client
 * @author FerIOX
 * @description Cliente HTTP centralizado con interceptores para manejo de errores
 */

import axios from 'axios';
import { api as apiConfig } from '../config/app.config.js';

/**
 * Cliente HTTP configurado
 * @constant {AxiosInstance}
 */
const apiClient = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true, // Importante para enviar cookies
});

/**
 * Interceptor de requests
 * Agrega headers adicionales antes de cada request
 */
apiClient.interceptors.request.use(
    (config) => {
        // Aquí se pueden agregar headers adicionales como CSRF tokens si es necesario
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

/**
 * Interceptor de responses
 * Maneja errores globales y refresca tokens si es necesario
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no hemos intentado refrescar aún
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intentar refrescar el token
                await axios.post(`${apiConfig.baseURL}/api/auth/refresh`, {}, { withCredentials: true });

                // Reintentar la petición original
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, redirigir al login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
