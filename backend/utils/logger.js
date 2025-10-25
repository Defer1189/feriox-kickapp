/**
 * @fileoverview Utilidades de logging para la aplicación
 * @module utils/logger
 * @author FerIOX
 * @description Sistema de logging centralizado con diferentes niveles
 */

import { logging } from '../config/env.js';

/**
 * Niveles de logging disponibles
 * @enum {number}
 */
const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

/**
 * Mapeo de nombres de nivel a valores numéricos
 */
const levelMap = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
};

/**
 * Nivel actual de logging basado en configuración
 */
const currentLevel = levelMap[logging.level] || LogLevel.DEBUG;

/**
 * Formatea un mensaje de log con timestamp
 * @private
 * @param {string} level - Nivel del log
 * @param {string} message - Mensaje a loggear
 * @returns {string} Mensaje formateado
 */
function formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

/**
 * Logger de nivel DEBUG
 * @param {string} message - Mensaje a loggear
 * @param {...any} args - Argumentos adicionales
 */
export function debug(message, ...args) {
    if (currentLevel <= LogLevel.DEBUG) {
        console.log(formatMessage('debug', message), ...args);
    }
}

/**
 * Logger de nivel INFO
 * @param {string} message - Mensaje a loggear
 * @param {...any} args - Argumentos adicionales
 */
export function info(message, ...args) {
    if (currentLevel <= LogLevel.INFO) {
        console.info(formatMessage('info', message), ...args);
    }
}

/**
 * Logger de nivel WARN
 * @param {string} message - Mensaje a loggear
 * @param {...any} args - Argumentos adicionales
 */
export function warn(message, ...args) {
    if (currentLevel <= LogLevel.WARN) {
        console.warn(formatMessage('warn', message), ...args);
    }
}

/**
 * Logger de nivel ERROR
 * @param {string} message - Mensaje a loggear
 * @param {...any} args - Argumentos adicionales
 */
export function error(message, ...args) {
    if (currentLevel <= LogLevel.ERROR) {
        console.error(formatMessage('error', message), ...args);
    }
}

/**
 * Middleware de logging para Express
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 */
export function requestLogger(req, res, next) {
    info(`${req.method} ${req.path}`);
    next();
}

export default {
    debug,
    info,
    warn,
    error,
    requestLogger,
};
