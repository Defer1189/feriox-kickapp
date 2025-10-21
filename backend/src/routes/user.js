import express from 'express';
import axios from 'axios';
import { config } from '../config/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/user
 * Get authenticated user data (user:read scope)
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const response = await axios.get(`${config.kick.apiBaseUrl}/v1/user`, {
      headers: {
        Authorization: `Bearer ${req.accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('User fetch error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: {
        message: error.response?.data?.message || 'Failed to fetch user data',
        status: error.response?.status || 500
      }
    });
  }
});

/**
 * GET /api/user/channel
 * Get user's channel data (channel:read scope)
 */
router.get('/channel', requireAuth, async (req, res) => {
  try {
    const response = await axios.get(`${config.kick.apiBaseUrl}/v1/channels/me`, {
      headers: {
        Authorization: `Bearer ${req.accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Channel fetch error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: {
        message: error.response?.data?.message || 'Failed to fetch channel data',
        status: error.response?.status || 500
      }
    });
  }
});

/**
 * GET /api/user/streamkey
 * Get user's stream key (streamkey:read scope)
 */
router.get('/streamkey', requireAuth, async (req, res) => {
  try {
    const response = await axios.get(`${config.kick.apiBaseUrl}/v1/channels/me/streamkey`, {
      headers: {
        Authorization: `Bearer ${req.accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Stream key fetch error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: {
        message: error.response?.data?.message || 'Failed to fetch stream key',
        status: error.response?.status || 500
      }
    });
  }
});

export default router;
