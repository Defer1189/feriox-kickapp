/**
 * @fileoverview Punto de entrada del servidor Express
 * @module server
 * @author FerIOX
 * @description Configuración y arranque del servidor backend de FerIOX KICK App
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

// Importar configuración
import config, { validateEnvVars } from './config/env.js';
import { swaggerSpec, swaggerUiOptions } from './config/swagger.js';

// Importar middlewares
import * as logger from './utils/logger.js';
import * as errorHandler from './middlewares/errorHandler.middleware.js';
import { sanitizeInput } from './middlewares/validation.middleware.js';

// Importar rutas
import routes from './routes/index.js';

// Validar variables de entorno
try {
    validateEnvVars();
    logger.info('✅ Variables de entorno validadas correctamente');
} catch (error) {
    logger.error('❌ Error en validación de variables de entorno:', error.message);
    process.exit(1);
}

// Crear aplicación Express
const app = express();

// ============================================================================
// CONFIGURACIÓN DE MIDDLEWARES DE SEGURIDAD
// ============================================================================

/**
 * Helmet - Configuración de headers de seguridad HTTP
 */
if (config.security.helmetEnabled) {
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: 'cross-origin' },
            contentSecurityPolicy: false,
        }),
    );
    logger.debug('Helmet habilitado');
}

/**
 * CORS - Configuración de Cross-Origin Resource Sharing
 */
app.use(
    cors({
        origin: config.security.corsOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
);
logger.debug(`CORS configurado para: ${config.security.corsOrigin}`);

// ============================================================================
// CONFIGURACIÓN DE MIDDLEWARES DE PARSEO
// ============================================================================

/**
 * Parseo de JSON y URL-encoded
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * Cookie parser - Para manejar cookies firmadas
 */
app.use(cookieParser(config.security.sessionSecret));

// ============================================================================
// MIDDLEWARES PERSONALIZADOS
// ============================================================================

/**
 * Middleware de logging de requests
 */
app.use(logger.requestLogger);

/**
 * Middleware de sanitización de input
 */
app.use(sanitizeInput);

// ============================================================================
// CONFIGURACIÓN DE SWAGGER
// ============================================================================

/**
 * Documentación Swagger UI
 */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
logger.debug('Swagger UI configurado en /api/docs');

// ============================================================================
// RUTAS DE LA APLICACIÓN
// ============================================================================

/**
 * Todas las rutas de la API están bajo /api
 */
app.use('/api', routes);

/**
 * Ruta temporal de dashboard para pruebas
 */
app.get('/dashboard', (req, res) => {
    const { kick_access_token: accessToken } = req.cookies;
    const isAuthenticated = !!accessToken;

    res.send(`
        <html>
            <head>
                <title>FerIOX - Dashboard</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .success { color: green; }
                    .error { color: red; }
                    .info { color: blue; }
                    .debug { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
                    button { margin: 5px; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
                    .btn-primary { background: #007bff; color: white; }
                    .btn-success { background: #28a745; color: white; }
                    .btn-danger { background: #dc3545; color: white; }
                    .btn-info { background: #17a2b8; color: white; }
                    .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
                    .status-authenticated { background: #d4edda; border: 1px solid #c3e6cb; }
                    .status-not-authenticated { background: #f8d7da; border: 1px solid #f5c6cb; }
                </style>
            </head>
            <body>
                <h1>FerIOX KickApp Dashboard</h1>
                
                <div class="status ${isAuthenticated ? 'status-authenticated' : 'status-not-authenticated'}">
                    <h3>Estado de Autenticación:</h3>
                    <p>${
    isAuthenticated
        ? '✅ <strong>Autenticado</strong> - Tienes una sesión activa'
        : '❌ <strong>No autenticado</strong> - Inicia sesión para continuar'
}</p>
                </div>
                
                <div class="debug">
                    <h3>🔧 Panel de Control</h3>
                    ${
    isAuthenticated
        ? `
                        <button class="btn-success" onclick="testEndpoint('/api/auth/user')">👤 Ver mis datos</button>
                        <button class="btn-info" onclick="testEndpoint('/api/auth/debug')">🐛 Debug del Token</button>
                        <button class="btn-info" onclick="testEndpoint('/api/auth/config')">⚙️ Ver Configuración</button>
                        <button class="btn-danger" onclick="logout()">🚪 Cerrar Sesión</button>
                    `
        : `
                        <a href="/api/auth/login"><button class="btn-primary">🔐 Iniciar Sesión con KICK</button></a>
                    `
}
                </div>

                <div id="result" class="debug"></div>

                <script>
                    async function testEndpoint(endpoint) {
                        const resultDiv = document.getElementById('result');
                        resultDiv.innerHTML = '<p>🔄 Cargando...</p>';
                        
                        try {
                            const response = await fetch(endpoint);
                            const data = await response.json();
                            resultDiv.innerHTML = '<h4>Resultado:</h4><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                        } catch (error) {
                            resultDiv.innerHTML = '<p class="error">❌ Error: ' + error.message + '</p>';
                        }
                    }

                    async function logout() {
                        const resultDiv = document.getElementById('result');
                        resultDiv.innerHTML = '<p>🔄 Cerrando sesión...</p>';
                        
                        try {
                            const response = await fetch('/api/auth/logout', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            const data = await response.json();
                            
                            if (data.status === 'success') {
                                resultDiv.innerHTML = '<p class="success">✅ ' + data.message + '</p>';
                                setTimeout(() => {
                                    window.location.href = '/dashboard?logout=success';
                                }, 2000);
                            } else {
                                resultDiv.innerHTML = '<p class="error">❌ Error al cerrar sesión</p>';
                            }
                        } catch (error) {
                            resultDiv.innerHTML = '<p class="error">❌ Error: ' + error.message + '</p>';
                        }
                    }

                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('auth') === 'success') {
                        document.getElementById('result').innerHTML = 
                            '<p class="success">🎉 ¡Autenticación exitosa! Token almacenado correctamente.</p>';
                    }
                    if (urlParams.get('logout') === 'success') {
                        document.getElementById('result').innerHTML = 
                            '<p class="info">👋 Sesión cerrada correctamente.</p>';
                    }
                </script>
            </body>
        </html>
    `);
});

/**
 * Ruta para favicon
 */
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

/**
 * Manejo de rutas no encontradas (404)
 */
app.use(errorHandler.notFoundHandler);

/**
 * Manejo global de errores
 */
app.use(errorHandler.errorHandler);

// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================

/**
 * Iniciar servidor
 */
app.listen(config.server.port, () => {
    logger.info(`
        🚀 Servidor FerIOX Backend inicializado correctamente
        📍 Puerto: ${config.server.port}
        🌐 Ambiente: ${config.server.nodeEnv}
        🔗 URL: ${config.server.backendUrl}
        🎯 Frontend: ${config.server.frontendUrl}
        ⚡ Modo: ${config.server.nodeEnv === 'development' ? 'Desarrollo' : 'Producción'}

        📋 Endpoints disponibles:
            ✅ Health Check: ${config.server.backendUrl}/api/health
            🔐 Auth Login: ${config.server.backendUrl}/api/auth/login
            ⚙️  Auth Config: ${config.server.backendUrl}/api/auth/config
            👤 User Data: ${config.server.backendUrl}/api/auth/user
            🚪 Logout: ${config.server.backendUrl}/api/auth/logout
            📚 API Docs: ${config.server.backendUrl}/api/docs
            📊 Dashboard: ${config.server.backendUrl}/dashboard
        
        🔍 Para debug:
            - Verifica la configuración: ${config.server.backendUrl}/api/auth/config
            - Debug del token: ${config.server.backendUrl}/api/auth/debug
            - Revisa que KICK_REDIRECT_URI en .env coincida con la app en KICK Dev
    `);
});

/**
 * Manejo graceful de cierre
 */
process.on('SIGINT', () => {
    logger.info('🔴 Cerrando servidor FerIOX Backend...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('🔴 Cerrando servidor FerIOX Backend...');
    process.exit(0);
});

export default app;
