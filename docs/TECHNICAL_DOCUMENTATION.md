# Documentación Técnica - FerIOX KICK App

## 📖 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Flujo de Autenticación OAuth 2.1](#flujo-de-autenticación-oauth-21)
5. [Backend](#backend)
6. [Frontend](#frontend)
7. [Seguridad](#seguridad)
8. [API Endpoints](#api-endpoints)

## 🏗️ Arquitectura General

FerIOX KICK App es una aplicación Full-Stack que implementa OAuth 2.1 con PKCE para integrarse de forma segura con la API pública de KICK.

### Diagrama de Arquitectura

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│   Frontend      │◄────────┤   Backend        │◄────────┤   KICK API      │
│   (React+Vite)  │         │   (Express.js)   │         │   (OAuth 2.1)   │
│   Port: 5173    │         │   Port: 3000     │         │                 │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
       │                            │
       │                            │
       │      HTTP Cookies          │
       │      (httpOnly, secure)    │
       └────────────────────────────┘
```

### Principios de Diseño

1. **Separación de Responsabilidades**: Backend y Frontend completamente independientes
2. **Seguridad por Diseño**: Implementación de PKCE, CSRF protection, httpOnly cookies
3. **Modularidad**: Código organizado por dominio y funcionalidad
4. **Documentación**: JSDoc completo y Swagger para la API
5. **Calidad**: ESLint y Prettier para mantener estándares de código

## 💻 Stack Tecnológico

### Backend

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js 4.21.2
- **HTTP Client**: Axios 1.12.2
- **Seguridad**:
  - Helmet 8.1.0 (Headers HTTP seguros)
  - CORS 2.8.5 (Control de acceso)
  - cookie-parser 1.4.7 (Cookies firmadas)
- **Documentación**: Swagger JSDoc + Swagger UI Express
- **Desarrollo**: Nodemon 3.1.10

### Frontend

- **Framework**: React 19.1.1
- **Build Tool**: Vite (rolldown-vite 7.1.14)
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.12.2
- **Validación**: PropTypes 15.8.1

### Herramientas de Desarrollo

- **Linting**: ESLint 8.57.0
- **Formatting**: Prettier 3.2.5
- **Git Hooks**: Husky 8.0.3
- **Monorepo**: Concurrently 9.2.1

## 📁 Estructura del Proyecto

```
feriox-kickapp/
├── backend/                      # Servidor Express.js
│   ├── config/                   # Configuración centralizada
│   │   ├── env.js               # Variables de entorno
│   │   └── swagger.js           # Configuración de Swagger
│   ├── controllers/              # Controladores de lógica de negocio
│   │   └── auth.controller.js   # Controlador de autenticación
│   ├── middlewares/              # Middlewares de Express
│   │   ├── auth.middleware.js   # Verificación de autenticación
│   │   ├── errorHandler.middleware.js
│   │   └── validation.middleware.js
│   ├── routes/                   # Definición de rutas
│   │   ├── auth.routes.js       # Rutas de autenticación
│   │   ├── public.routes.js     # Rutas públicas
│   │   └── index.js             # Agregador de rutas
│   ├── services/                 # Lógica de servicios
│   │   ├── oauth.service.js     # Servicio OAuth
│   │   └── kick.service.js      # Servicio KICK API
│   ├── utils/                    # Utilidades
│   │   ├── pkce.js              # Funciones PKCE
│   │   └── logger.js            # Sistema de logging
│   ├── server.js                 # Punto de entrada
│   ├── .env.example             # Ejemplo de variables de entorno
│   └── package.json             # Dependencias del backend
│
├── frontend/                     # Aplicación React
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   └── layout/         # Componentes de layout
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── Layout.jsx
│   │   ├── context/             # Contextos de React
│   │   │   └── AuthContext.jsx # Contexto de autenticación
│   │   ├── core/                # Configuración del núcleo
│   │   │   ├── api/            # Cliente HTTP
│   │   │   └── config/         # Configuración
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── Home/
│   │   │   ├── Auth/
│   │   │   └── Dashboard/
│   │   ├── services/            # Servicios HTTP
│   │   │   └── auth.service.js
│   │   ├── App.jsx              # Componente principal
│   │   └── main.jsx             # Punto de entrada
│   ├── vite.config.js           # Configuración de Vite
│   └── package.json             # Dependencias del frontend
│
├── docs/                         # Documentación completa
│   ├── INSTALLATION.md          # Guía de instalación
│   ├── TECHNICAL_DOCUMENTATION.md
│   ├── DEVELOPMENT.md           # Guía de desarrollo
│   ├── API_DOCUMENTATION.md     # Documentación de la API
│   └── SECURITY.md              # Consideraciones de seguridad
│
├── .eslintrc.json               # Configuración de ESLint
├── .prettierrc.json             # Configuración de Prettier
├── .husky/                      # Git hooks
├── package.json                 # Scripts del monorepo
└── README.md                    # Documentación principal
```

## 🔐 Flujo de Autenticación OAuth 2.1

### Secuencia Completa

```
1. Usuario → Frontend: Click "Iniciar Sesión"
2. Frontend → Backend: GET /api/auth/login
3. Backend: 
   - Genera code_verifier (random 64 bytes)
   - Genera code_challenge (SHA256 de verifier, base64url)
   - Genera state (random 16 bytes)
   - Guarda verifier y state en cookies httpOnly
4. Backend → Usuario: Redirect a KICK OAuth
5. Usuario → KICK: Autoriza la aplicación
6. KICK → Backend: Redirect con code y state
7. Backend:
   - Valida state (CSRF protection)
   - Intercambia code por tokens con KICK
   - Envía code_verifier para validación PKCE
8. KICK → Backend: Retorna access_token y refresh_token
9. Backend:
   - Guarda tokens en cookies httpOnly
   - Limpia cookies temporales
10. Backend → Frontend: Redirect a /dashboard
11. Frontend → Backend: GET /api/auth/user
12. Backend → KICK API: GET /users (con access_token)
13. KICK API → Backend: Datos del usuario
14. Backend → Frontend: Retorna datos del usuario
15. Frontend: Muestra dashboard con datos
```

### Componentes de Seguridad

1. **PKCE (Proof Key for Code Exchange)**:
   - `code_verifier`: String aleatorio de 128 caracteres
   - `code_challenge`: SHA256(code_verifier) en base64url
   - `code_challenge_method`: S256

2. **State Parameter**:
   - String aleatorio de 32 caracteres
   - Almacenado en cookie firmada
   - Validado en el callback para prevenir CSRF

3. **Cookies Seguras**:
   - `httpOnly`: No accesibles desde JavaScript
   - `secure`: Solo HTTPS en producción
   - `sameSite`: Protección contra CSRF
   - Firmadas con `SESSION_SECRET`

## 🔧 Backend

### Capa de Configuración

**`config/env.js`**: Centraliza todas las variables de entorno y configuración.

```javascript
export const kick = {
    clientId: process.env.KICK_CLIENT_ID,
    clientSecret: process.env.KICK_CLIENT_SECRET,
    redirectUri: process.env.KICK_REDIRECT_URI,
    authUrl: 'https://id.kick.com/oauth/authorize',
    tokenUrl: 'https://id.kick.com/oauth/token',
    apiBaseUrl: 'https://api.kick.com/public/v1',
    scopes: ['user:read', 'channel:read', ...]
};
```

### Capa de Servicios

**`services/oauth.service.js`**: Maneja toda la lógica de OAuth.

Funciones principales:
- `prepareOAuthFlow()`: Genera PKCE y state
- `exchangeCodeForTokens()`: Intercambia código por tokens
- `refreshAccessToken()`: Refresca el access token
- `revokeToken()`: Revoca un token (placeholder)

**`services/kick.service.js`**: Interactúa con la API de KICK.

Funciones principales:
- `getUserInfo()`: Obtiene datos del usuario
- `getChannelInfo()`: Obtiene información del canal
- `sendChatMessage()`: Envía mensajes al chat
- `banUser()`: Ejecuta acciones de moderación

### Capa de Middlewares

1. **`auth.middleware.js`**:
   - `requireAuth`: Verifica presencia de access_token
   - `requireRefreshToken`: Verifica presencia de refresh_token
   - `optionalAuth`: Autenticación opcional

2. **`validation.middleware.js`**:
   - `validateQueryParams`: Valida parámetros de query
   - `validateBodyParams`: Valida parámetros del body
   - `validateOAuthState`: Valida el state de OAuth
   - `sanitizeInput`: Limpia input del usuario

3. **`errorHandler.middleware.js`**:
   - `notFoundHandler`: Maneja rutas 404
   - `errorHandler`: Manejo global de errores

### Capa de Controladores

**`controllers/auth.controller.js`**: Implementa la lógica de autenticación.

Endpoints implementados:
- `login`: Inicia el flujo OAuth
- `callback`: Maneja el callback de OAuth
- `getUser`: Obtiene datos del usuario autenticado
- `logout`: Cierra sesión
- `refresh`: Refresca el access token
- `getConfig`: Verificación de configuración
- `getDebugInfo`: Información de debug

## ⚛️ Frontend

### Arquitectura de Componentes

```
App (Router + AuthProvider)
└── Layout
    ├── Header (navegación + auth status)
    ├── Main (contenido dinámico)
    │   ├── Home (página de inicio)
    │   ├── Login (página de login)
    │   └── Dashboard (protegida, requiere auth)
    └── Footer
```

### Context API

**`AuthContext.jsx`**: Maneja el estado global de autenticación.

Estado:
- `user`: Datos del usuario autenticado
- `isAuthenticated`: Boolean de estado de auth
- `isLoading`: Boolean de carga
- `error`: Mensajes de error

Métodos:
- `login()`: Redirige al flujo de OAuth
- `logout()`: Cierra sesión
- `refreshUser()`: Actualiza datos del usuario
- `checkAuthStatus()`: Verifica estado de auth

### Cliente HTTP

**`core/api/client.js`**: Cliente Axios configurado.

Características:
- Configuración base (baseURL, timeout, headers)
- Interceptor de requests (agregar headers)
- Interceptor de responses:
  - Maneja errores 401
  - Intenta refrescar token automáticamente
  - Reintenta request original tras refresh

### Servicios

**`services/auth.service.js`**: API de autenticación.

Funciones:
- `login()`: Redirige a /api/auth/login
- `getUser()`: Obtiene usuario autenticado
- `logout()`: Cierra sesión
- `refreshToken()`: Refresca access token
- `checkHealth()`: Health check del backend

### Rutas y Navegación

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

## 🔒 Seguridad

### Implementaciones de Seguridad

1. **OAuth 2.1 con PKCE**: Protección contra ataques de intercepción
2. **State Parameter**: Prevención de CSRF
3. **httpOnly Cookies**: Tokens no accesibles desde JavaScript
4. **Secure Cookies**: Solo HTTPS en producción (NODE_ENV=production)
5. **Helmet**: Headers de seguridad HTTP
6. **CORS Configurado**: Solo origen del frontend autorizado
7. **Input Validation**: Validación y sanitización de entrada
8. **Error Handling**: Sin exposición de detalles sensibles

### Variables Sensibles

⚠️ **NUNCA** exponer en el frontend:
- `KICK_CLIENT_SECRET`
- `SESSION_SECRET`
- Access tokens y refresh tokens

✅ **Siempre** usar variables de entorno en el backend.

## 📡 API Endpoints

### Públicos

- **GET `/api/health`**: Health check del servidor
- **GET `/api`**: Información del servicio
- **GET `/api/auth/login`**: Inicia flujo OAuth
- **GET `/api/auth/callback`**: Callback OAuth
- **GET `/api/auth/config`**: Verifica configuración
- **GET `/api/docs`**: Documentación Swagger

### Protegidos (requieren autenticación)

- **GET `/api/auth/user`**: Datos del usuario autenticado
- **POST `/api/auth/logout`**: Cerrar sesión
- **POST `/api/auth/refresh`**: Refrescar access token

### Dashboard Temporal

- **GET `/dashboard`**: Dashboard HTML simple para pruebas

## 📊 Swagger Documentation

La documentación interactiva de la API está disponible en:

```
http://localhost:3000/api/docs
```

Incluye:
- Todos los endpoints disponibles
- Schemas de request/response
- Posibilidad de probar endpoints directamente
- Ejemplos de uso

## 🔄 Flujo de Datos

### Flujo de Autenticación

```
Usuario → Frontend → Backend → KICK → Backend → Frontend → Usuario
```

### Flujo de Obtención de Datos

```
Frontend → Backend → KICK API → Backend → Frontend
```

### Manejo de Tokens

```
Backend (genera) → Cookies httpOnly → Frontend (automático) → Backend (valida)
```

## 🚀 Despliegue

### Consideraciones

1. **Variables de Entorno**:
   - Cambiar `NODE_ENV=production`
   - Usar URLs de producción
   - Generar `SESSION_SECRET` seguro

2. **Seguridad**:
   - HTTPS obligatorio
   - Certificados SSL válidos
   - Configurar CORS para dominio de producción

3. **Rendimiento**:
   - Build del frontend: `npm run build`
   - Servir estáticos desde el backend o CDN
   - Habilitar compresión

## 📈 Escalabilidad

### Recomendaciones

1. **Backend**:
   - Usar Redis para sesiones
   - Implementar rate limiting
   - Load balancer para múltiples instancias

2. **Frontend**:
   - CDN para assets estáticos
   - Code splitting
   - Lazy loading de componentes

3. **Base de Datos**:
   - Implementar caché
   - Optimizar queries
   - Réplicas para lectura

## 🐛 Debug y Logging

### Backend

```bash
# Modo debug con logs detallados
LOG_LEVEL=debug npm run dev
```

Logs disponibles:
- Requests HTTP (método, ruta, timestamp)
- Errores con stack trace (solo development)
- Información de OAuth (generación PKCE, intercambio tokens)
- Respuestas de KICK API

### Frontend

- React DevTools para inspeccionar componentes
- Redux DevTools para estado (si se implementa)
- Network tab para peticiones HTTP
- Console para logs de errores

## 🧪 Testing

### Recomendaciones

1. **Backend**:
   - Unit tests: Jest + Supertest
   - Integration tests: Endpoints completos
   - Security tests: OWASP ZAP

2. **Frontend**:
   - Unit tests: Jest + React Testing Library
   - E2E tests: Playwright o Cypress
   - Visual regression: Percy o Chromatic

## 📚 Referencias

- [Documentación de KICK Dev](https://dev.kick.com)
- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1)
- [PKCE Specification](https://datatracker.ietf.org/doc/html/rfc7636)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
