import express from 'express';
import axios from 'axios';
import { config } from '../config/index.js';
import { generateState, buildAuthUrl, validateState } from '../utils/oauth.js';

const router = express.Router();

/**
 * GET /api/auth/login
 * Initiates OAuth2 flow by redirecting to KICK authorization page
 */
router.get('/login', (req, res) => {
  try {
    // Generate random state for CSRF protection
    const state = generateState();

    // Store state in signed cookie
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      signed: true,
      maxAge: 600000, // 10 minutes
      sameSite: 'lax'
    });

    // Build authorization URL
    const authUrl = buildAuthUrl({
      authUrl: config.kick.authUrl,
      clientId: config.kick.clientId,
      redirectUri: config.kick.redirectUri,
      scopes: config.kick.scopes,
      state
    });

    // Redirect to KICK authorization page
    res.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to initiate login',
        status: 500
      }
    });
  }
});

/**
 * GET /api/auth/callback
 * Handles OAuth2 callback from KICK
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state: receivedState } = req.query;
    const storedState = req.signedCookies.oauth_state;

    // Validate state parameter
    if (!validateState(receivedState, storedState)) {
      return res.status(400).json({
        error: {
          message: 'Invalid state parameter - possible CSRF attack',
          status: 400
        }
      });
    }

    // Clear state cookie
    res.clearCookie('oauth_state');

    if (!code) {
      return res.status(400).json({
        error: {
          message: 'Authorization code not provided',
          status: 400
        }
      });
    }

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      config.kick.tokenUrl,
      {
        grant_type: 'authorization_code',
        client_id: config.kick.clientId,
        client_secret: config.kick.clientSecret,
        redirect_uri: config.kick.redirectUri,
        code
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Store tokens in signed cookies
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      signed: true,
      maxAge: expires_in * 1000,
      sameSite: 'lax'
    });

    if (refresh_token) {
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax'
      });
    }

    // Redirect to frontend
    res.redirect(`${config.frontendUrl}/dashboard`);
  } catch (error) {
    console.error('Callback error:', error.response?.data || error.message);
    res.redirect(`${config.frontendUrl}?error=auth_failed`);
  }
});

/**
 * POST /api/auth/logout
 * Clears authentication cookies
 */
router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.clearCookie('oauth_state');

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get('/status', (req, res) => {
  const isAuthenticated = !!req.signedCookies.access_token;

  res.json({
    authenticated: isAuthenticated
  });
});

export default router;
