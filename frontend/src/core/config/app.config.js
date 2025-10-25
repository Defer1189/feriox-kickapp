/**
 * @fileoverview Configuración centralizada del frontend
 * @module config/app
 * @author FerIOX
 * @description Configuración de constantes y variables de entorno del frontend
 */

/**
 * Configuración de la API backend
 * @constant {Object} api
 */
export const api = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    endpoints: {
        health: '/api/health',
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        user: '/api/auth/user',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh',
        config: '/api/auth/config',
        debug: '/api/auth/debug',
    },
};

/**
 * Configuración de la aplicación
 * @constant {Object} app
 */
export const app = {
    name: 'FerIOX KICK App',
    version: '1.0.0',
    description: 'Aplicación Full-Stack para integración segura con KICK API',
    author: 'FerIOX',
};

/**
 * Configuración de rutas del frontend
 * @constant {Object} routes
 */
export const routes = {
    home: '/',
    dashboard: '/dashboard',
    login: '/login',
    profile: '/profile',
    notFound: '*',
};

/**
 * Configuración de ambiente
 * @constant {Object} env
 */
export const env = {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
};

export default {
    api,
    app,
    routes,
    env,
};
