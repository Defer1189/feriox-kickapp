import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config, validateConfig } from './config/index.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

// Validate configuration
validateConfig();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware with signed cookies
app.use(cookieParser(config.cookieSecret));

// Request logging middleware (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Mount routes
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log('🚀 FerIOX KICK API Backend Server');
  console.log('================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${config.nodeEnv}`);
  console.log(`✅ Frontend URL: ${config.frontendUrl}`);
  console.log('\nAvailable endpoints:');
  console.log(`  - Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  - API Info: http://localhost:${PORT}/api/info`);
  console.log(`  - OAuth Login: http://localhost:${PORT}/api/auth/login`);
  console.log('\n📚 Documentation: https://github.com/Defer1189/feriox-kickapp');
  console.log('================================\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
