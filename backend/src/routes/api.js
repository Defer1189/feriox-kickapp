import express from 'express';
import { config } from '../config/index.js';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

/**
 * GET /api/info
 * API information endpoint
 */
router.get('/info', (req, res) => {
  res.json({
    name: 'FerIOX KICK API Integration',
    version: '1.0.0',
    description: 'Backend API for KICK OAuth2 integration',
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      auth: {
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        logout: '/api/auth/logout',
        status: '/api/auth/status'
      },
      user: {
        profile: '/api/user',
        channel: '/api/user/channel',
        streamkey: '/api/user/streamkey'
      }
    },
    scopes: config.kick.scopes,
    documentation: 'https://github.com/Defer1189/feriox-kickapp'
  });
});

export default router;
