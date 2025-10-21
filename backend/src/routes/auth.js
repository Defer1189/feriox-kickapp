import express from 'express';
import axios from 'axios';
import { config } from '../config/config.js';
import { 
  generateState, 
  buildAuthorizationUrl, 
  validateState,
  signCookie
} from '../utils/auth.js';

const router = express.Router();

/**
 * GET /api/auth/login
 * Initiate OAuth2 authorization flow
 */
router.get('/login', (req, res) => {
  try {
    // Generate random state for CSRF protection
    const state = generateState();
    
    // Sign and store state in cookie
    const signedState = signCookie(state, config.COOKIE_SECRET);
    res.cookie(config.STATE_COOKIE_NAME, signedState, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000 // 10 minutes
    });
    
    // Build authorization URL
    const authUrl = buildAuthorizationUrl({
      authorizeUrl: config.KICK_AUTHORIZE_URL,
      clientId: config.KICK_CLIENT_ID,
      redirectUri: config.KICK_REDIRECT_URI,
      scopes: config.KICK_SCOPES,
      state: state
    });
    
    // Redirect to KICK authorization page
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating login:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to initiate login process'
    });
  }
});

/**
 * GET /api/auth/callback
 * Handle OAuth2 callback from KICK
 */
router.get('/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;
  
  // Check for authorization errors
  if (error) {
    console.error('OAuth error:', error, error_description);
    return res.redirect(`${config.FRONTEND_URL}?error=${encodeURIComponent(error_description || error)}`);
  }
  
  // Validate required parameters
  if (!code || !state) {
    return res.redirect(`${config.FRONTEND_URL}?error=missing_parameters`);
  }
  
  try {
    // Retrieve and validate state from cookie
    const stateCookie = req.cookies[config.STATE_COOKIE_NAME];
    if (!stateCookie) {
      return res.redirect(`${config.FRONTEND_URL}?error=missing_state_cookie`);
    }
    
    // Extract state from signed cookie
    const storedState = stateCookie.split('.')[0];
    
    if (!validateState(state, storedState)) {
      return res.redirect(`${config.FRONTEND_URL}?error=invalid_state`);
    }
    
    // Clear state cookie
    res.clearCookie(config.STATE_COOKIE_NAME);
    
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(config.KICK_TOKEN_URL, {
      grant_type: 'authorization_code',
      client_id: config.KICK_CLIENT_ID,
      client_secret: config.KICK_CLIENT_SECRET,
      redirect_uri: config.KICK_REDIRECT_URI,
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Fetch user information
    const userResponse = await axios.get(`${config.KICK_API_BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });
    
    // Create session data
    const sessionData = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
      user: userResponse.data
    };
    
    // Sign and store session in cookie
    const signedSession = signCookie(JSON.stringify(sessionData), config.COOKIE_SECRET);
    res.cookie(config.SESSION_COOKIE_NAME, signedSession, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: config.COOKIE_MAX_AGE
    });
    
    // Redirect to frontend
    res.redirect(config.FRONTEND_URL);
  } catch (error) {
    console.error('Error in OAuth callback:', error.response?.data || error.message);
    res.redirect(`${config.FRONTEND_URL}?error=authentication_failed`);
  }
});

/**
 * GET /api/auth/user
 * Get current authenticated user
 */
router.get('/user', (req, res) => {
  const sessionCookie = req.cookies[config.SESSION_COOKIE_NAME];
  
  if (!sessionCookie) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No active session'
    });
  }
  
  try {
    // Extract session data from signed cookie
    const sessionData = sessionCookie.split('.')[0];
    const session = JSON.parse(sessionData);
    
    res.json({
      user: session.user,
      expiresIn: session.expiresIn
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid session'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and clear session
 */
router.post('/logout', (req, res) => {
  // Clear session cookie
  res.clearCookie(config.SESSION_COOKIE_NAME);
  
  res.json({
    message: 'Logged out successfully'
  });
});

export default router;
