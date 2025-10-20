import express from 'express';
import { config } from './config/config.js';
import { securityMiddleware } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

/**
 * Middlewares globales
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Aplicar middlewares de seguridad
 */
securityMiddleware.forEach(middleware => app.use(middleware));

/**
 * Rutas de la API
 */
app.use('/api', routes);

/**
 * Ruta principal
 */
app.get('/', (req, res) => {
  res.json({
    message: 'FerIOX KICK API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      channels: '/api/channels/:username',
      liveChannels: '/api/channels/live',
      search: '/api/search?q=query',
      categories: '/api/categories',
      category: '/api/categories/:slug'
    }
  });
});

/**
 * Manejadores de errores
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Iniciar servidor
 */
app.listen(config.port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
  console.log(`📡 Modo: ${config.nodeEnv}`);
  console.log(`🎮 KICK API: ${config.kickApiBaseUrl}`);
});

export default app;
