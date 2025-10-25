/**
 * @fileoverview Punto central de rutas de la aplicación
 * @module routes/index
 * @author FerIOX
 * @description Agrupa y exporta todas las rutas de la aplicación
 */

import express from 'express';
import publicRoutes from './public.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

// Rutas públicas
router.use('/', publicRoutes);

// Rutas de autenticación
router.use('/auth', authRoutes);

export default router;
