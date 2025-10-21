import express from 'express';
import { config } from '../config/config.js';

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
    environment: config.NODE_ENV
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
    description: 'Backend API for KICK streaming platform integration',
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      auth: {
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        user: '/api/auth/user',
        logout: '/api/auth/logout'
      }
    },
    scopes: config.KICK_SCOPES,
    documentation: '/docs'
  });
});

export default router;
