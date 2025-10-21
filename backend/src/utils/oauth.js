import crypto from 'crypto';

/**
 * Generate a cryptographically secure random state for OAuth2
 * @param {number} length - Length of the state string
 * @returns {string} Random state string
 */
export function generateState(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Build authorization URL for KICK OAuth2
 * @param {Object} params - OAuth parameters
 * @returns {string} Authorization URL
 */
export function buildAuthUrl({ authUrl, clientId, redirectUri, scopes, state }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    state: state
  });

  return `${authUrl}?${params.toString()}`;
}

/**
 * Validate state parameter from OAuth callback
 * @param {string} receivedState - State from query params
 * @param {string} storedState - State from cookie
 * @returns {boolean} Whether states match
 */
export function validateState(receivedState, storedState) {
  if (!receivedState || !storedState) {
    return false;
  }
  return receivedState === storedState;
}
