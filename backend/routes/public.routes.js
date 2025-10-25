/**
 * @fileoverview Rutas públicas (health check, info)
 * @module routes/public
 * @author FerIOX
 * @description Define todas las rutas públicas de la aplicación
 */

import express from 'express';
import { app as appConfig, server } from '../config/env.js';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check del servidor
 *     tags: [Health]
 *     description: Verifica que el servidor esté funcionando correctamente
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: '✅ Servidor FerIOX Backend funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: server.nodeEnv,
        version: appConfig.version,
    });
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Información del servicio
 *     tags: [Health]
 *     description: Proporciona información básica sobre el servicio
 *     responses:
 *       200:
 *         description: Información del servicio
 */
router.get('/', (req, res) => {
    res.json({
        service: appConfig.name,
        developer: appConfig.author,
        status: 'active',
        version: appConfig.version,
        description: appConfig.description,
        message: 'Escalado Horizontal, Ambición Vertical - KICK Dev',
        endpoints: {
            health: '/api/health',
            login: '/api/auth/login',
            user: '/api/auth/user',
            logout: '/api/auth/logout',
            refresh: '/api/auth/refresh',
            config: '/api/auth/config',
            debug: '/api/auth/debug',
            docs: '/api/docs',
        },
    });
});

export default router;
