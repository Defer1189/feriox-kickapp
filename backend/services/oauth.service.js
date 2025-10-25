/**
 * @fileoverview Servicio para gestionar OAuth con KICK API
 * @module services/oauth
 * @author FerIOX
 * @description Servicios para manejar el flujo completo de OAuth 2.1 con PKCE
 * incluyendo autorización, intercambio de tokens y refresh
 */

import axios from 'axios';
import { kick } from '../config/env.js';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../utils/pkce.js';
import * as logger from '../utils/logger.js';

/**
 * Genera la URL de autorización para iniciar el flujo OAuth
 * @function generateAuthorizationUrl
 * @param {string} codeChallenge - Code challenge generado desde el verifier
 * @param {string} state - Estado para prevención de CSRF
 * @returns {string} URL completa de autorización
 * @description Construye la URL de autorización con todos los parámetros
 * necesarios para iniciar el flujo OAuth 2.1 con PKCE
 * @example
 * const authUrl = generateAuthorizationUrl(challenge, state);
 */
export function generateAuthorizationUrl(codeChallenge, state) {
    const params = new URLSearchParams({
        client_id: kick.clientId,
        redirect_uri: kick.redirectUri,
        response_type: 'code',
        scope: kick.scopes.join(' '),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state,
    });

    return `${kick.authUrl}?${params.toString()}`;
}

/**
 * Prepara el flujo de autorización OAuth
 * @function prepareOAuthFlow
 * @returns {Object} Objeto con verifier, challenge, state y authUrl
 * @description Genera todos los parámetros necesarios para iniciar OAuth
 * @example
 * const { codeVerifier, codeChallenge, state, authUrl } = prepareOAuthFlow();
 */
export function prepareOAuthFlow() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();
    const authUrl = generateAuthorizationUrl(codeChallenge, state);

    logger.debug('Flujo OAuth preparado', {
        hasVerifier: !!codeVerifier,
        hasChallenge: !!codeChallenge,
        hasState: !!state,
    });

    return {
        codeVerifier,
        codeChallenge,
        state,
        authUrl,
    };
}

/**
 * Intercambia el código de autorización por tokens de acceso
 * @async
 * @function exchangeCodeForTokens
 * @param {string} code - Código de autorización recibido del callback
 * @param {string} codeVerifier - Code verifier original usado en la autorización
 * @returns {Promise<Object>} Tokens de acceso y refresh
 * @throws {Error} Si falla el intercambio de tokens
 * @description Realiza la petición POST al endpoint de tokens de KICK
 * para obtener el access_token y refresh_token
 * @example
 * const tokens = await exchangeCodeForTokens(code, verifier);
 * console.log(tokens.access_token, tokens.refresh_token);
 */
export async function exchangeCodeForTokens(code, codeVerifier) {
    try {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: kick.clientId,
            client_secret: kick.clientSecret,
            redirect_uri: kick.redirectUri,
            code_verifier: codeVerifier,
        });

        logger.debug('Intercambiando código por tokens...');

        const response = await axios.post(kick.tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            timeout: 15000,
        });

        logger.info('✅ Tokens obtenidos exitosamente');

        return response.data;
    } catch (error) {
        logger.error('❌ Error al intercambiar código por tokens:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
}

/**
 * Refresca el access token usando el refresh token
 * @async
 * @function refreshAccessToken
 * @param {string} refreshToken - Refresh token almacenado
 * @returns {Promise<Object>} Nuevo access token y datos relacionados
 * @throws {Error} Si falla el refresh del token
 * @description Solicita un nuevo access_token usando el refresh_token
 * @example
 * const newTokens = await refreshAccessToken(oldRefreshToken);
 */
export async function refreshAccessToken(refreshToken) {
    try {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: kick.clientId,
            client_secret: kick.clientSecret,
        });

        logger.debug('Refrescando access token...');

        const response = await axios.post(kick.tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            timeout: 15000,
        });

        logger.info('✅ Token refrescado exitosamente');

        return response.data;
    } catch (error) {
        logger.error('❌ Error al refrescar token:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
}

/**
 * Revoca un token de acceso
 * @async
 * @function revokeToken
 * @param {string} token - Token a revocar
 * @returns {Promise<boolean>} true si se revocó exitosamente
 * @throws {Error} Si falla la revocación
 * @description Invalida un token en el servidor de autorización de KICK
 * @example
 * await revokeToken(accessToken);
 */
export async function revokeToken(token) {
    try {
        // Nota: KICK puede no tener endpoint de revocación implementado aún
        // Este es un placeholder para futura implementación
        logger.warn('Revocación de token solicitada - endpoint puede no estar disponible');
        return true;
    } catch (error) {
        logger.error('❌ Error al revocar token:', error.message);
        throw error;
    }
}

export default {
    generateAuthorizationUrl,
    prepareOAuthFlow,
    exchangeCodeForTokens,
    refreshAccessToken,
    revokeToken,
};
