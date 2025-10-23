// D:\Dinero\Kick\FerIOX_KickApp\backend\server.js
import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

// Configuración inicial
const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Middlewares ---
// Middleware de seguridad
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));

// Middleware de CORS
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de cookies
app.use(cookieParser(process.env.SESSION_SECRET));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// --- Funciones Helper de PKCE ---

/**
 * Genera un 'code_verifier' aleatorio para PKCE
 * @returns {string} Code verifier en formato hexadecimal (128 caracteres)
 */
function generateCodeVerifier() {
    return crypto.randomBytes(64).toString('hex');
}

/**
 * Genera un 'code_challenge' a partir del verifier usando SHA256
 * @param {string} verifier - Code verifier original
 * @returns {string} Code challenge en formato base64url
 */
function generateCodeChallenge(verifier) {
    return crypto.createHash('sha256')
        .update(verifier)
        .digest('base64url');
}

/**
 * Genera un estado aleatorio para la seguridad OAuth (prevención de CSRF)
 * @returns {string} Estado aleatorio en formato hexadecimal (32 caracteres)
 */
function generateState() {
    return crypto.randomBytes(16).toString('hex');
}

// --- Rutas ---

// Swagger UI Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'FerIOX Kick App API Docs',
}));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar salud del servidor
 *     description: Endpoint para verificar que el servidor está funcionando correctamente
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: '✅ Servidor FerIOX Backend funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
    });
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Información del servicio
 *     description: Proporciona información básica sobre el servicio y endpoints disponibles
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Información del servicio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceInfo'
 */
app.get('/api', (req, res) => {
    res.json({
        service: 'FerIOX KICK API Integration',
        developer: 'FerIOX',
        status: 'active',
        version: '1.0.0',
        message: 'Escalado Horizontal, Ambición Vertical - KICK Dev',
        endpoints: {
            health: '/api/health',
            login: '/api/auth/login',
            user: '/api/auth/user',
            logout: '/api/auth/logout',
            config: '/api/auth/config',
            debug: '/api/auth/debug',
            docs: '/api/docs',
        },
    });
});

/**
 * @swagger
 * /api/auth/login:
 *   get:
 *     summary: Iniciar el flujo de autenticación OAuth 2.1
 *     description: Genera PKCE, state, y redirige al usuario a KICK para autorización
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirección a KICK OAuth
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/auth/login', (req, res) => {
    try {
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        const state = generateState();

        res.cookie('kick_code_verifier', codeVerifier, {
            httpOnly: true,
            signed: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000,
            sameSite: 'lax',
        });

        res.cookie('kick_oauth_state', state, {
            httpOnly: true,
            signed: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000,
            sameSite: 'lax',
        });

        const KICK_AUTH_URL = 'https://id.kick.com/oauth/authorize';
        const scopes = [
            'user:read',
            'channel:read',
            'channel:write',
            'chat:write',
            'streamkey:read',
            'events:subscribe',
            'moderation:ban',
        ];

        const params = new URLSearchParams({
            client_id: process.env.KICK_CLIENT_ID,
            redirect_uri: process.env.KICK_REDIRECT_URI,
            response_type: 'code',
            scope: scopes.join(' '),
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            state: state,
        });

        const authUrl = `${KICK_AUTH_URL}?${params.toString()}`;
        console.log('🔐 URL de autorización generada:', authUrl);

        res.redirect(authUrl);

    } catch (error) {
        console.error('❌ Error en /api/auth/login:', error);
        res.status(500).json({
            error: 'Error interno al iniciar sesión',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

/**
 * @swagger
 * /api/auth/callback:
 *   get:
 *     summary: Callback de autorización OAuth
 *     description: Endpoint donde KICK redirige después de la autorización. Intercambia el código por un access_token
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de autorización de KICK
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: Estado para validación CSRF
 *     responses:
 *       302:
 *         description: Redirección al dashboard con autenticación exitosa
 *       400:
 *         description: Error de autorización o parámetros inválidos
 *       500:
 *         description: Error al obtener el token
 */
app.get('/api/auth/callback', async (req, res) => {
    const { code, state, error: authError, error_description } = req.query;
    const { kick_code_verifier: codeVerifier, kick_oauth_state: originalState } = req.signedCookies;

    console.log('🔄 Callback recibido:', { code: !!code, state, hasCodeVerifier: !!codeVerifier, hasOriginalState: !!originalState });

    if (authError) {
        console.error('❌ Error de OAuth:', authError, error_description);
        return res.status(400).send(`Error de autorización: ${authError} - ${error_description}`);
    }
    if (!code) {
        return res.status(400).send('Error: No se recibió código de autorización.');
    }
    if (!codeVerifier) {
        return res.status(400).send('Error: No se encontró el verificador PKCE. La sesión puede haber expirado.');
    }
    if (!state || !originalState || state !== originalState) {
        return res.status(400).send('Error: State no válido. Posible ataque CSRF.');
    }

    try {
        const KICK_TOKEN_URL = 'https://id.kick.com/oauth/token';

        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: process.env.KICK_CLIENT_ID,
            client_secret: process.env.KICK_CLIENT_SECRET,
            redirect_uri: process.env.KICK_REDIRECT_URI,
            code_verifier: codeVerifier,
        });

        console.log('🔄 Intercambiando código por token...');

        const response = await axios.post(KICK_TOKEN_URL, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            timeout: 15000,
        });

        const { access_token, refresh_token, expires_in, token_type, scope } = response.data;
        console.log('✅ Token obtenido exitosamente');

        res.cookie('kick_access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: expires_in * 1000,
            sameSite: 'lax',
        });

        if (refresh_token) {
            res.cookie('kick_refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'lax',
            });
        }

        res.clearCookie('kick_code_verifier');
        res.clearCookie('kick_oauth_state');

        res.redirect(`/dashboard?auth=success`);

    } catch (error) {
        console.error('❌ Error en callback OAuth:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);

        res.status(500).send(`
            Error al obtener el token de acceso.
            Verifica que las credenciales y redirect_uri estén correctamente configuradas.
            ${process.env.NODE_ENV === 'development' ? `Detalles: ${error.message}` : ''}
        `);
    }
});

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     description: Ruta protegida que retorna los datos del usuario desde KICK API
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: No autorizado - Token no encontrado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al obtener datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/auth/user', async (req, res) => {
    const { kick_access_token: accessToken } = req.cookies;

    if (!accessToken) {
        return res.status(401).json({
            error: 'No autorizado',
            message: 'Token de acceso no encontrado. Por favor, inicia sesión nuevamente.',
        });
    }

    try {
        const userResponse = await axios.get('https://api.kick.com/public/v1/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'User-Agent': 'FerIOX-KickApp/1.0.0',
            },
            timeout: 10000,
        });

        console.log('✅ Datos del usuario obtenidos exitosamente');

        res.json({
            status: 'success',
            data: userResponse.data,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ Error al obtener datos del usuario:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('URL:', error.config?.url);
        console.error('Headers:', error.config?.headers);

        if (error.response?.status === 401) {
            res.clearCookie('kick_access_token');
            return res.status(401).json({
                error: 'Token inválido o expirado',
                message: 'Por favor, inicia sesión nuevamente.',
            });
        }

        res.status(500).json({
            error: 'Error al obtener datos del usuario',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            status: error.response?.status,
            attempted_url: error.config?.url,
        });
    }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     description: Elimina las cookies de autenticación para cerrar sesión
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 */
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('kick_access_token');
    res.clearCookie('kick_refresh_token');
    res.clearCookie('kick_code_verifier');
    res.clearCookie('kick_oauth_state');
    res.json({
        status: 'success',
        message: 'Sesión cerrada correctamente',
        redirect: '/dashboard?logout=success',
    });
});

/**
 * @swagger
 * /api/auth/config:
 *   get:
 *     summary: Verificar configuración OAuth
 *     description: Endpoint de desarrollo para verificar credenciales OAuth configuradas
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: Configuración OAuth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConfigResponse'
 */
app.get('/api/auth/config', (req, res) => {
    res.json({
        client_id: process.env.KICK_CLIENT_ID ? '✅ Configurado' : '❌ Faltante',
        redirect_uri: process.env.KICK_REDIRECT_URI,
        has_client_secret: !!process.env.KICK_CLIENT_SECRET,
        environment: process.env.NODE_ENV,
    });
});

/**
 * @swagger
 * /api/auth/debug:
 *   get:
 *     summary: Información de debug del token
 *     description: Endpoint de desarrollo que muestra información detallada sobre el token y la sesión
 *     tags: [Debug]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Información de debug
 */
app.get('/api/auth/debug', (req, res) => {
    const {
        kick_access_token: accessToken,
        kick_refresh_token: refreshToken,
        kick_code_verifier: codeVerifier,
        kick_oauth_state: oauthState,
    } = req.cookies;

    const debugInfo = {
        session: {
            cookies_present: {
                access_token: !!accessToken,
                refresh_token: !!refreshToken,
                code_verifier: !!codeVerifier,
                oauth_state: !!oauthState,
            },
            access_token_preview: accessToken ? 
                `${accessToken.substring(0, 20)}...${accessToken.substring(accessToken.length - 20)}` : 
                'No disponible',
            refresh_token_preview: refreshToken ? 
                `${refreshToken.substring(0, 20)}...${refreshToken.substring(refreshToken.length - 20)}` : 
                'No disponible'
        },
        environment: process.env.NODE_ENV,
        server_time: new Date().toISOString(),
        server_url: process.env.BACKEND_URL,
    };

    if (accessToken) {
        try {
            const tokenParts = accessToken.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                debugInfo.token_decoded = {
                    payload: payload,
                    issued_at: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'No disponible',
                    expires_at: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No disponible',
                    scopes: payload.scope || 'No especificado'
                };
            }
        } catch (error) {
            debugInfo.token_decode_error = error.message;
        }
    }

    res.json(debugInfo);
});

/**
 * RUTA TEMPORAL: Dashboard simple para pruebas
 * Muestra un mensaje simple después de la autenticación.
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
                    <p>${isAuthenticated ? 
                        '✅ <strong>Autenticado</strong> - Tienes una sesión activa' : 
                        '❌ <strong>No autenticado</strong> - Inicia sesión para continuar'}</p>
                </div>
                
                <div class="debug">
                    <h3>🔧 Panel de Control</h3>
                    ${isAuthenticated ? `
                        <button class="btn-success" onclick="testEndpoint('/api/auth/user')">👤 Ver mis datos</button>
                        <button class="btn-info" onclick="testEndpoint('/api/auth/debug')">🐛 Debug del Token</button>
                        <button class="btn-info" onclick="testEndpoint('/api/auth/config')">⚙️ Ver Configuración</button>
                        <button class="btn-danger" onclick="logout()">🚪 Cerrar Sesión</button>
                    ` : `
                        <a href="/api/auth/login"><button class="btn-primary">🔐 Iniciar Sesión con KICK</button></a>
                    `}
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
                                // Recargar la página después de 2 segundos para actualizar el estado
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

                    // Mostrar mensajes según parámetros de URL
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

// Ruta para favicon para evitar el error 404
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        availableEndpoints: ['/api/health', '/api/auth/login', '/api/auth/user', '/api/auth/logout', '/api/auth/config', '/api/auth/debug', '/dashboard'],
    });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`
        🚀 Servidor FerIOX Backend inicializado correctamente
        📍 Puerto: ${PORT}
        🌐 Ambiente: ${process.env.NODE_ENV}
        🔗 URL: ${process.env.BACKEND_URL}
        🎯 Frontend: ${process.env.FRONTEND_URL}
        ⚡ Modo: ${process.env.NODE_ENV === 'development' ? 'Desarrollo' : 'Producción'}

        📋 Endpoints disponibles:
            ✅ Health Check: ${process.env.BACKEND_URL}/api/health
            🔐 Auth Login: ${process.env.BACKEND_URL}/api/auth/login
            ⚙️  Auth Config: ${process.env.BACKEND_URL}/api/auth/config
            👤 User Data: ${process.env.BACKEND_URL}/api/auth/user
            🚪 Logout: ${process.env.BACKEND_URL}/api/auth/logout
            📊 Dashboard: ${process.env.BACKEND_URL}/dashboard
            📚 API Docs: ${process.env.BACKEND_URL}/api/docs
        
        🔍 Para debug:
            - Verifica la configuración: ${process.env.BACKEND_URL}/api/auth/config
            - Debug del token: ${process.env.BACKEND_URL}/api/auth/debug
            - Revisa que KICK_REDIRECT_URI en .env coincida con la app en KICK Dev
    `);
});

// Manejo graceful de cierre
process.on('SIGINT', () => {
    console.log('\n🔴 Cerrando servidor FerIOX Backend...');
    process.exit(0);
});

export default app;