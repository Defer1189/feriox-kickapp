/**
 * @fileoverview Utilidades para PKCE (Proof Key for Code Exchange)
 * @module utils/pkce
 * @author FerIOX
 * @description Implementación de PKCE para OAuth 2.1 con SHA256
 */

import crypto from 'crypto';

/**
 * Genera un code_verifier aleatorio para PKCE
 * @function generateCodeVerifier
 * @returns {string} Code verifier de 128 caracteres hexadecimales
 * @description Genera un string aleatorio criptográficamente seguro usado como
 * verificador en el flujo PKCE de OAuth 2.1
 * @example
 * const verifier = generateCodeVerifier();
 * // Retorna: "a1b2c3d4e5f6..." (128 caracteres)
 */
export function generateCodeVerifier() {
    return crypto.randomBytes(64).toString('hex');
}

/**
 * Genera un code_challenge a partir de un code_verifier
 * @function generateCodeChallenge
 * @param {string} verifier - Code verifier previamente generado
 * @returns {string} Code challenge en formato base64url
 * @description Crea un hash SHA256 del verifier y lo codifica en base64url
 * según las especificaciones de PKCE
 * @example
 * const verifier = generateCodeVerifier();
 * const challenge = generateCodeChallenge(verifier);
 * // Retorna: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
 */
export function generateCodeChallenge(verifier) {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
}

/**
 * Genera un estado aleatorio para prevención de CSRF
 * @function generateState
 * @returns {string} Estado aleatorio de 32 caracteres hexadecimales
 * @description Genera un token aleatorio usado para validar que el callback
 * de OAuth proviene de la misma sesión que inició el flujo
 * @example
 * const state = generateState();
 * // Retorna: "a1b2c3d4e5f6789..." (32 caracteres)
 */
export function generateState() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Valida que un state recibido coincida con el estado original
 * @function validateState
 * @param {string} receivedState - Estado recibido en el callback
 * @param {string} originalState - Estado original guardado en cookie
 * @returns {boolean} true si los estados coinciden
 * @description Compara de forma segura dos estados para prevenir ataques CSRF
 * @example
 * const isValid = validateState(req.query.state, req.signedCookies.kick_oauth_state);
 */
export function validateState(receivedState, originalState) {
    if (!receivedState || !originalState) {
        return false;
    }
    return receivedState === originalState;
}

export default {
    generateCodeVerifier,
    generateCodeChallenge,
    generateState,
    validateState,
};
