import crypto from 'crypto';

/**
 * Generate a cryptographically secure random state string
 * @returns {string} Random state string
 */
export function generateState() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a code verifier for PKCE
 * @returns {string} Random code verifier
 */
export function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Generate code challenge from verifier for PKCE
 * @param {string} verifier - Code verifier
 * @returns {string} Code challenge
 */
export function generateCodeChallenge(verifier) {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

/**
 * Build authorization URL with all required parameters
 * @param {object} params - Authorization parameters
 * @returns {string} Complete authorization URL
 */
export function buildAuthorizationUrl({ authorizeUrl, clientId, redirectUri, scopes, state }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: Array.isArray(scopes) ? scopes.join(' ') : scopes,
    state: state
  });
  
  return `${authorizeUrl}?${params.toString()}`;
}

/**
 * Validate OAuth state to prevent CSRF attacks
 * @param {string} receivedState - State from callback
 * @param {string} storedState - State from cookie
 * @returns {boolean} Whether states match
 */
export function validateState(receivedState, storedState) {
  if (!receivedState || !storedState) {
    return false;
  }
  return receivedState === storedState;
}

/**
 * Create a signed cookie value
 * @param {string} value - Value to sign
 * @param {string} secret - Secret key
 * @returns {string} Signed value
 */
export function signCookie(value, secret) {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('hex');
  return `${value}.${signature}`;
}

/**
 * Verify and extract value from signed cookie
 * @param {string} signedValue - Signed cookie value
 * @param {string} secret - Secret key
 * @returns {string|null} Original value or null if invalid
 */
export function unsignCookie(signedValue, secret) {
  if (!signedValue || !signedValue.includes('.')) {
    return null;
  }
  
  const [value, signature] = signedValue.split('.');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('hex');
  
  if (signature === expectedSignature) {
    return value;
  }
  
  return null;
}
