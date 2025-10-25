/**
 * @fileoverview Middleware de validación de parámetros
 * @module middlewares/validation
 * @author FerIOX
 * @description Middleware para validar parámetros de request
 */

import * as logger from '../utils/logger.js';

/**
 * Valida que los parámetros requeridos estén presentes en el query
 * @function validateQueryParams
 * @param {string[]} requiredParams - Array de nombres de parámetros requeridos
 * @returns {Function} Middleware de Express
 * @description Crea un middleware que valida parámetros de query
 * @example
 * router.get('/endpoint', validateQueryParams(['code', 'state']), controller);
 */
export function validateQueryParams(requiredParams) {
    return (req, res, next) => {
        const missingParams = requiredParams.filter((param) => !req.query[param]);

        if (missingParams.length > 0) {
            logger.warn('Parámetros de query faltantes:', missingParams);
            return res.status(400).json({
                error: 'Parámetros faltantes',
                message: `Los siguientes parámetros son requeridos: ${missingParams.join(', ')}`,
                missingParams,
            });
        }

        next();
    };
}

/**
 * Valida que los parámetros requeridos estén presentes en el body
 * @function validateBodyParams
 * @param {string[]} requiredParams - Array de nombres de parámetros requeridos
 * @returns {Function} Middleware de Express
 * @description Crea un middleware que valida parámetros de body
 * @example
 * router.post('/endpoint', validateBodyParams(['message']), controller);
 */
export function validateBodyParams(requiredParams) {
    return (req, res, next) => {
        const missingParams = requiredParams.filter((param) => !req.body[param]);

        if (missingParams.length > 0) {
            logger.warn('Parámetros de body faltantes:', missingParams);
            return res.status(400).json({
                error: 'Parámetros faltantes',
                message: `Los siguientes parámetros son requeridos en el body: ${missingParams.join(', ')}`,
                missingParams,
            });
        }

        next();
    };
}

/**
 * Valida estado de OAuth
 * @function validateOAuthState
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 * @description Valida que el state recibido coincida con el almacenado en cookies
 */
export function validateOAuthState(req, res, next) {
    const { state } = req.query;
    const { kick_oauth_state: originalState } = req.signedCookies;

    if (!state || !originalState) {
        logger.warn('State de OAuth faltante');
        return res.status(400).json({
            error: 'State faltante',
            message: 'El parámetro state es requerido y debe coincidir con el almacenado',
        });
    }

    if (state !== originalState) {
        logger.error('State de OAuth no coincide - posible ataque CSRF');
        return res.status(400).json({
            error: 'State inválido',
            message: 'El state recibido no coincide. Posible ataque CSRF.',
        });
    }

    next();
}

/**
 * Sanitiza los parámetros de entrada
 * @function sanitizeInput
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 * @description Sanitiza y limpia los parámetros de entrada
 */
export function sanitizeInput(req, res, next) {
    // Sanitizar query params
    if (req.query) {
        Object.keys(req.query).forEach((key) => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }

    // Sanitizar body params
    if (req.body) {
        Object.keys(req.body).forEach((key) => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }

    next();
}

export default {
    validateQueryParams,
    validateBodyParams,
    validateOAuthState,
    sanitizeInput,
};
