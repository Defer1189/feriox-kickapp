/**
 * @fileoverview Rutas de autenticación
 * @module routes/auth
 * @author FerIOX
 * @description Define todas las rutas relacionadas con autenticación OAuth
 */

import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as validationMiddleware from '../middlewares/validation.middleware.js';

const router = express.Router();

/**
 * @route GET /api/auth/login
 * @desc Iniciar flujo de autenticación OAuth
 * @access Público
 */
router.get('/login', authController.login);

/**
 * @route GET /api/auth/callback
 * @desc Callback de OAuth - intercambio de código por tokens
 * @access Público
 */
router.get(
    '/callback',
    validationMiddleware.validateQueryParams(['code', 'state']),
    validationMiddleware.validateOAuthState,
    authController.callback,
);

/**
 * @route GET /api/auth/user
 * @desc Obtener información del usuario autenticado
 * @access Privado (requiere autenticación)
 */
router.get('/user', authMiddleware.requireAuth, authController.getUser);

/**
 * @route POST /api/auth/logout
 * @desc Cerrar sesión del usuario
 * @access Público
 */
router.post('/logout', authController.logout);

/**
 * @route POST /api/auth/refresh
 * @desc Refrescar el access token usando el refresh token
 * @access Privado (requiere refresh token)
 */
router.post('/refresh', authMiddleware.requireRefreshToken, authController.refresh);

/**
 * @route GET /api/auth/config
 * @desc Verificar configuración OAuth
 * @access Público
 */
router.get('/config', authController.getConfig);

/**
 * @route GET /api/auth/debug
 * @desc Información de debug de la sesión
 * @access Público
 */
router.get('/debug', authController.getDebugInfo);

export default router;
