import express from 'express';
import kickRoutes from './kickRoutes.js';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Rutas de KICK API
 */
router.use('/', kickRoutes);

export default router;
