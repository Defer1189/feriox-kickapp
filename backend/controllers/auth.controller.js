/**
 * @fileoverview Controlador de autenticación OAuth
 * @module controllers/auth
 * @author FerIOX
 * @description Controladores para gestionar el flujo completo de autenticación OAuth 2.1
 */

import * as oauthService from '../services/oauth.service.js';
import * as kickService from '../services/kick.service.js';
import { security } from '../config/env.js';
import * as logger from '../utils/logger.js';

/**
 * Inicia el flujo de login OAuth
 * @swagger
 * /api/auth/login:
 *   get:
 *     summary: Iniciar flujo de autenticación OAuth
 *     tags: [Auth]
 *     description: Genera los parámetros PKCE y redirige al usuario a KICK para autorizar
 *     responses:
 *       302:
 *         description: Redirección a KICK OAuth
 *       500:
 *         description: Error interno del servidor
 */
export async function login(req, res) {
    try {
        const { codeVerifier, state, authUrl } = oauthService.prepareOAuthFlow();

        // Guardar code verifier en cookie
        res.cookie('kick_code_verifier', codeVerifier, {
            ...security.cookieOptions,
            httpOnly: true,
            signed: true,
            maxAge: security.cookieOptions.maxAge.codeVerifier,
        });

        // Guardar state en cookie
        res.cookie('kick_oauth_state', state, {
            ...security.cookieOptions,
            httpOnly: true,
            signed: true,
            maxAge: security.cookieOptions.maxAge.oauthState,
        });

        logger.info('🔐 Iniciando flujo OAuth - redirigiendo a KICK');
        res.redirect(authUrl);
    } catch (error) {
        logger.error('❌ Error en login:', error);
        res.status(500).json({
            error: 'Error interno al iniciar sesión',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}

/**
 * Callback de OAuth - intercambio de código por tokens
 * @swagger
 * /api/auth/callback:
 *   get:
 *     summary: Callback de autorización OAuth
 *     tags: [Auth]
 *     description: Recibe el código de autorización e intercambia por tokens
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de autorización de KICK
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: Estado para validación CSRF
 *     responses:
 *       302:
 *         description: Redirección al dashboard
 *       400:
 *         description: Error en parámetros
 *       500:
 *         description: Error interno
 */
export async function callback(req, res) {
    const { code, error: authError, error_description } = req.query;
    const { kick_code_verifier: codeVerifier } = req.signedCookies;

    // Validaciones de entrada ya hechas por middlewares

    // Verificar errores de autorización
    if (authError) {
        logger.error('❌ Error de OAuth:', authError, error_description);
        return res.status(400).send(`Error de autorización: ${authError} - ${error_description}`);
    }

    try {
        // Intercambiar código por tokens
        const { access_token, refresh_token, expires_in } = await oauthService.exchangeCodeForTokens(code, codeVerifier);

        // Guardar access token en cookie
        res.cookie('kick_access_token', access_token, {
            ...security.cookieOptions,
            httpOnly: true,
            maxAge: expires_in * 1000,
        });

        // Guardar refresh token en cookie si existe
        if (refresh_token) {
            res.cookie('kick_refresh_token', refresh_token, {
                ...security.cookieOptions,
                httpOnly: true,
                maxAge: security.cookieOptions.maxAge.refreshToken,
            });
        }

        // Limpiar cookies temporales
        res.clearCookie('kick_code_verifier');
        res.clearCookie('kick_oauth_state');

        logger.info('✅ Autenticación exitosa - redirigiendo al dashboard');
        res.redirect('/dashboard?auth=success');
    } catch (error) {
        logger.error('❌ Error en callback OAuth:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });

        res.status(500).send(`
            Error al obtener el token de acceso.
            Verifica que las credenciales y redirect_uri estén correctamente configuradas.
            ${process.env.NODE_ENV === 'development' ? `Detalles: ${error.message}` : ''}
        `);
    }
}

/**
 * Obtener datos del usuario autenticado
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       401:
 *         description: No autorizado
 */
export async function getUser(req, res) {
    try {
        const userData = await kickService.getUserInfo(req.accessToken);

        logger.info('✅ Datos del usuario obtenidos exitosamente');

        res.json({
            status: 'success',
            data: userData,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        logger.error('❌ Error al obtener datos del usuario:', {
            status: error.response?.status,
            data: error.response?.data,
        });

        if (error.response?.status === 401) {
            res.clearCookie('kick_access_token');
            return res.status(401).json({
                error: 'Token inválido o expirado',
                message: 'Por favor, inicia sesión nuevamente.',
            });
        }

        res.status(500).json({
            error: 'Error al obtener datos del usuario',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}

/**
 * Cerrar sesión
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
export async function logout(req, res) {
    // Limpiar todas las cookies
    res.clearCookie('kick_access_token');
    res.clearCookie('kick_refresh_token');
    res.clearCookie('kick_code_verifier');
    res.clearCookie('kick_oauth_state');

    logger.info('👋 Usuario cerró sesión');

    res.json({
        status: 'success',
        message: 'Sesión cerrada correctamente',
        redirect: '/dashboard?logout=success',
    });
}

/**
 * Refrescar el access token
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refrescar access token
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refrescado correctamente
 *       401:
 *         description: Refresh token inválido o expirado
 */
export async function refresh(req, res) {
    try {
        const { access_token, expires_in, refresh_token } = await oauthService.refreshAccessToken(req.refreshToken);

        // Guardar nuevo access token
        res.cookie('kick_access_token', access_token, {
            ...security.cookieOptions,
            httpOnly: true,
            maxAge: expires_in * 1000,
        });

        // Actualizar refresh token si viene uno nuevo
        if (refresh_token) {
            res.cookie('kick_refresh_token', refresh_token, {
                ...security.cookieOptions,
                httpOnly: true,
                maxAge: security.cookieOptions.maxAge.refreshToken,
            });
        }

        logger.info('✅ Token refrescado exitosamente');

        res.json({
            status: 'success',
            message: 'Token refrescado correctamente',
            expiresIn: expires_in,
        });
    } catch (error) {
        logger.error('❌ Error al refrescar token:', error);

        res.clearCookie('kick_access_token');
        res.clearCookie('kick_refresh_token');

        res.status(401).json({
            error: 'Error al refrescar token',
            message: 'Por favor, inicia sesión nuevamente.',
        });
    }
}

/**
 * Verificar configuración OAuth
 * @swagger
 * /api/auth/config:
 *   get:
 *     summary: Verificar configuración OAuth
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Estado de la configuración
 */
export async function getConfig(req, res) {
    res.json({
        client_id: process.env.KICK_CLIENT_ID ? '✅ Configurado' : '❌ Faltante',
        redirect_uri: process.env.KICK_REDIRECT_URI,
        has_client_secret: !!process.env.KICK_CLIENT_SECRET,
        environment: process.env.NODE_ENV,
    });
}

/**
 * Debug de sesión y token
 * @swagger
 * /api/auth/debug:
 *   get:
 *     summary: Información de debug de la sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Información de debug
 */
export async function getDebugInfo(req, res) {
    const {
        kick_access_token: accessToken,
        kick_refresh_token: refreshToken,
        kick_code_verifier: codeVerifier,
        kick_oauth_state: oauthState,
    } = req.cookies;

    const debugInfo = {
        session: {
            cookies_present: {
                access_token: !!accessToken,
                refresh_token: !!refreshToken,
                code_verifier: !!codeVerifier,
                oauth_state: !!oauthState,
            },
            access_token_preview: accessToken
                ? `${accessToken.substring(0, 20)}...${accessToken.substring(accessToken.length - 20)}`
                : 'No disponible',
            refresh_token_preview: refreshToken
                ? `${refreshToken.substring(0, 20)}...${refreshToken.substring(refreshToken.length - 20)}`
                : 'No disponible',
        },
        environment: process.env.NODE_ENV,
        server_time: new Date().toISOString(),
    };

    // Intentar decodificar el token si es JWT
    if (accessToken) {
        try {
            const tokenParts = accessToken.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                debugInfo.token_decoded = {
                    payload: payload,
                    issued_at: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'No disponible',
                    expires_at: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No disponible',
                    scopes: payload.scope || 'No especificado',
                };
            }
        } catch (error) {
            debugInfo.token_decode_error = error.message;
        }
    }

    res.json(debugInfo);
}

export default {
    login,
    callback,
    getUser,
    logout,
    refresh,
    getConfig,
    getDebugInfo,
};
