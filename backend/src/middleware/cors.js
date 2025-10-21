import cors from 'cors';
import { config } from '../config/index.js';

/**
 * CORS middleware configuration
 * Allows requests from the frontend URL with credentials
 */
export const corsMiddleware = cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
