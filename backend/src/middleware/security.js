import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from '../config/config.js';

/**
 * Configuración de CORS
 */
export const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Configuración de rate limiting
 */
export const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware de seguridad para todas las rutas
 */
export const securityMiddleware = [
  helmet(),
  cors(corsOptions),
  limiter
];
