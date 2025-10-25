/**
 * @fileoverview Servicio de autenticación
 * @module services/auth
 * @author FerIOX
 * @description Servicios para gestionar la autenticación con el backend
 */

import apiClient from '../core/api/client.js';
import { api } from '../core/config/app.config.js';

/**
 * Inicia el flujo de login OAuth
 * @async
 * @function login
 * @returns {Promise<void>} Redirige a la página de autorización de KICK
 * @description Redirige al usuario al endpoint de login que iniciará el flujo OAuth
 * @example
 * await login();
 */
export async function login() {
    // Redirigir directamente al endpoint de login del backend
    window.location.href = `${api.baseURL}${api.endpoints.login}`;
}

/**
 * Obtiene la información del usuario autenticado
 * @async
 * @function getUser
 * @returns {Promise<Object>} Información del usuario
 * @throws {Error} Si el usuario no está autenticado
 * @description Obtiene los datos del usuario desde el backend
 * @example
 * const user = await getUser();
 * console.log(user.data);
 */
export async function getUser() {
    try {
        const response = await apiClient.get(api.endpoints.user);
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;
    }
}

/**
 * Cierra la sesión del usuario
 * @async
 * @function logout
 * @returns {Promise<void>}
 * @description Cierra la sesión y limpia las cookies
 * @example
 * await logout();
 */
export async function logout() {
    try {
        await apiClient.post(api.endpoints.logout);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
}

/**
 * Refresca el access token
 * @async
 * @function refreshToken
 * @returns {Promise<Object>} Respuesta del servidor
 * @description Refresca el access token usando el refresh token
 * @example
 * await refreshToken();
 */
export async function refreshToken() {
    try {
        const response = await apiClient.post(api.endpoints.refresh);
        return response.data;
    } catch (error) {
        console.error('Error al refrescar token:', error);
        throw error;
    }
}

/**
 * Verifica el estado de salud del servidor
 * @async
 * @function checkHealth
 * @returns {Promise<Object>} Estado del servidor
 * @description Verifica que el servidor backend esté funcionando
 * @example
 * const health = await checkHealth();
 */
export async function checkHealth() {
    try {
        const response = await apiClient.get(api.endpoints.health);
        return response.data;
    } catch (error) {
        console.error('Error al verificar salud del servidor:', error);
        throw error;
    }
}

/**
 * Obtiene la configuración de OAuth
 * @async
 * @function getConfig
 * @returns {Promise<Object>} Configuración de OAuth
 * @description Obtiene el estado de configuración del backend
 * @example
 * const config = await getConfig();
 */
export async function getConfig() {
    try {
        const response = await apiClient.get(api.endpoints.config);
        return response.data;
    } catch (error) {
        console.error('Error al obtener configuración:', error);
        throw error;
    }
}

export default {
    login,
    getUser,
    logout,
    refreshToken,
    checkHealth,
    getConfig,
};
