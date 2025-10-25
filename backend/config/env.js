/**
 * @fileoverview Configuración de variables de entorno y constantes de la aplicación
 * @module config/env
 * @author FerIOX
 * @description Este archivo centraliza todas las variables de entorno necesarias
 * para el funcionamiento de la aplicación, incluyendo configuración del servidor,
 * credenciales de KICK API, y configuraciones de seguridad.
 */

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración del servidor y entorno
 * @constant {Object} server
 * @property {string} nodeEnv - Entorno de ejecución (development, production, test)
 * @property {number} port - Puerto en el que escucha el servidor
 * @property {string} backendUrl - URL completa del backend
 * @property {string} frontendUrl - URL del frontend para configuración de CORS
 */
export const server = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

/**
 * Configuración de KICK OAuth API
 * @constant {Object} kick
 * @property {string} clientId - Client ID de la aplicación en KICK
 * @property {string} clientSecret - Client Secret de la aplicación (sensible)
 * @property {string} redirectUri - URI de redirección para callback OAuth
 * @property {string} authUrl - URL del endpoint de autorización de KICK
 * @property {string} tokenUrl - URL del endpoint de intercambio de tokens
 * @property {string} apiBaseUrl - URL base de la API pública de KICK
 * @property {string[]} scopes - Scopes solicitados por la aplicación
 */
export const kick = {
    clientId: process.env.KICK_CLIENT_ID,
    clientSecret: process.env.KICK_CLIENT_SECRET,
    redirectUri: process.env.KICK_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    authUrl: 'https://id.kick.com/oauth/authorize',
    tokenUrl: 'https://id.kick.com/oauth/token',
    apiBaseUrl: 'https://api.kick.com/public/v1',
    scopes: [
        'user:read', // Leer información básica del usuario
        'channel:read', // Leer información del canal
        'channel:write', // Modificar metadata del livestream
        'chat:write', // Enviar mensajes en chat
        'streamkey:read', // Leer stream key (muy sensible)
        'events:subscribe', // Suscribirse a webhooks
        'moderation:ban', // Ejecutar acciones de moderación
    ],
};

/**
 * Configuración de seguridad y cookies
 * @constant {Object} security
 * @property {string} sessionSecret - Secreto para firmar cookies
 * @property {boolean} helmetEnabled - Si está habilitado Helmet para seguridad HTTP
 * @property {string} corsOrigin - Origen permitido para CORS
 * @property {Object} cookieOptions - Opciones de configuración de cookies
 */
export const security = {
    sessionSecret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    helmetEnabled: process.env.HELMET_ENABLED !== 'false',
    corsOrigin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: {
            codeVerifier: 10 * 60 * 1000, // 10 minutos
            oauthState: 10 * 60 * 1000, // 10 minutos
            accessToken: 3600 * 1000, // 1 hora (será sobrescrito por expires_in)
            refreshToken: 30 * 24 * 60 * 60 * 1000, // 30 días
        },
    },
};

/**
 * Configuración de logging
 * @constant {Object} logging
 * @property {string} level - Nivel de logging (debug, info, warn, error)
 */
export const logging = {
    level: process.env.LOG_LEVEL || 'debug',
};

/**
 * Configuración de la aplicación
 * @constant {Object} app
 * @property {string} name - Nombre de la aplicación
 * @property {string} version - Versión actual de la aplicación
 * @property {string} description - Descripción breve de la aplicación
 * @property {string} author - Autor de la aplicación
 */
export const app = {
    name: 'FerIOX KICK API Integration',
    version: '1.0.0',
    description: 'Aplicación Full-Stack para integración segura con KICK API mediante OAuth 2.1',
    author: 'FerIOX',
};

/**
 * Validar que las variables de entorno requeridas estén presentes
 * @throws {Error} Si falta alguna variable de entorno crítica
 */
export function validateEnvVars() {
    const requiredVars = ['KICK_CLIENT_ID', 'KICK_CLIENT_SECRET', 'KICK_REDIRECT_URI', 'SESSION_SECRET'];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Faltan las siguientes variables de entorno requeridas: ${missingVars.join(', ')}`);
    }
}

/**
 * Exportación por defecto de toda la configuración
 */
export default {
    server,
    kick,
    security,
    logging,
    app,
    validateEnvVars,
};
