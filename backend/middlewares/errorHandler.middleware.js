/**
 * @fileoverview Middleware de manejo de errores
 * @module middlewares/errorHandler
 * @author FerIOX
 * @description Middleware centralizado para manejo de errores
 */

import { server } from '../config/env.js';
import * as logger from '../utils/logger.js';

/**
 * Middleware para rutas no encontradas (404)
 * @function notFoundHandler
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @description Maneja todas las rutas que no coinciden con ningún endpoint
 */
export function notFoundHandler(req, res) {
    logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: [
            '/api/health',
            '/api/auth/login',
            '/api/auth/callback',
            '/api/auth/user',
            '/api/auth/logout',
            '/api/auth/config',
            '/api/auth/debug',
            '/api/docs',
            '/dashboard',
        ],
    });
}

/**
 * Middleware global de manejo de errores
 * @function errorHandler
 * @param {Error} err - Error capturado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 * @description Maneja todos los errores no capturados en la aplicación
 */
export function errorHandler(err, req, res, _next) {
    logger.error('Error del servidor:', {
        message: err.message,
        stack: server.nodeEnv === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method,
    });

    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            error: 'Error de validación',
            message: err.message,
            details: server.nodeEnv === 'development' ? err.errors : undefined,
        });
    }

    // Error de autenticación
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            error: 'No autorizado',
            message: 'Token inválido o expirado',
        });
    }

    // Error de autorización
    if (err.name === 'ForbiddenError') {
        return res.status(403).json({
            status: 'error',
            error: 'Prohibido',
            message: 'No tienes permisos para realizar esta acción',
        });
    }

    // Error de Axios (peticiones HTTP)
    if (err.isAxiosError) {
        return res.status(err.response?.status || 500).json({
            status: 'error',
            error: 'Error en petición externa',
            message: 'Error al comunicarse con servicios externos',
            details: server.nodeEnv === 'development' ? err.response?.data : undefined,
        });
    }

    // Error genérico del servidor
    res.status(err.status || 500).json({
        status: 'error',
        message: 'Error interno del servidor',
        error: server.nodeEnv === 'development' ? err.message : 'Ocurrió un error inesperado',
        stack: server.nodeEnv === 'development' ? err.stack : undefined,
    });
}

export default {
    notFoundHandler,
    errorHandler,
};
