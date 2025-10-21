import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config, validateConfig } from './config/config.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

// Validate configuration before starting server
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error.message);
  console.error('\nPlease create a .env file in the backend directory with:');
  console.error('KICK_CLIENT_ID=your_client_id');
  console.error('KICK_CLIENT_SECRET=your_client_secret');
  console.error('KICK_REDIRECT_URI=http://localhost:3001/api/auth/callback');
  console.error('COOKIE_SECRET=your_random_secret_key');
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://kick.com", "https://id.kick.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser(config.COOKIE_SECRET));

// Request logging middleware (development only)
if (config.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'FerIOX KICK API Backend',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      documentation: '/docs'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/info',
      'GET /api/auth/login',
      'GET /api/auth/callback',
      'GET /api/auth/user',
      'POST /api/auth/logout'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 FerIOX KICK API Backend                             ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${config.NODE_ENV}                        ║
║   Frontend URL: ${config.FRONTEND_URL}                   ║
║                                                           ║
║   Available endpoints:                                    ║
║   • GET  /api/health                                      ║
║   • GET  /api/info                                        ║
║   • GET  /api/auth/login                                  ║
║   • GET  /api/auth/callback                               ║
║   • GET  /api/auth/user                                   ║
║   • POST /api/auth/logout                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
