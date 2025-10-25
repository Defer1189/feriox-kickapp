/**
 * @fileoverview Middleware de autenticación
 * @module middlewares/auth
 * @author FerIOX
 * @description Middleware para verificar autenticación de usuarios
 */

import * as logger from '../utils/logger.js';

/**
 * Middleware para verificar que el usuario esté autenticado
 * @function requireAuth
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 * @description Verifica que exista un access token en las cookies
 * @example
 * router.get('/protected', requireAuth, controller);
 */
export function requireAuth(req, res, next) {
    const { kick_access_token: accessToken } = req.cookies;

    if (!accessToken) {
        logger.warn('Acceso denegado - no hay token de acceso');
        return res.status(401).json({
            error: 'No autorizado',
            message: 'Token de acceso no encontrado. Por favor, inicia sesión nuevamente.',
        });
    }

    // Guardar el token en req para uso posterior
    req.accessToken = accessToken;
    next();
}

/**
 * Middleware para verificar refresh token
 * @function requireRefreshToken
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 * @description Verifica que exista un refresh token en las cookies
 */
export function requireRefreshToken(req, res, next) {
    const { kick_refresh_token: refreshToken } = req.cookies;

    if (!refreshToken) {
        logger.warn('Acceso denegado - no hay refresh token');
        return res.status(401).json({
            error: 'No autorizado',
            message: 'Refresh token no encontrado. Por favor, inicia sesión nuevamente.',
        });
    }

    req.refreshToken = refreshToken;
    next();
}

/**
 * Middleware opcional de autenticación
 * @function optionalAuth
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 * @description Permite continuar con o sin token, pero lo agrega a req si existe
 */
export function optionalAuth(req, res, next) {
    const { kick_access_token: accessToken } = req.cookies;

    if (accessToken) {
        req.accessToken = accessToken;
        req.isAuthenticated = true;
    } else {
        req.isAuthenticated = false;
    }

    next();
}

export default {
    requireAuth,
    requireRefreshToken,
    optionalAuth,
};
