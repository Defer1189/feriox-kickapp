# Arquitectura - FerIOX KICK App

## Visión General

FerIOX KICK App es una aplicación full-stack que integra con la API de KICK usando OAuth2 para autenticación segura. La aplicación sigue una arquitectura de cliente-servidor con frontend y backend completamente separados.

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│     Browser     │◄───────►│  Express API    │◄───────►│   KICK API      │
│  (React + Vite) │  HTTP   │   (Node.js)     │  OAuth2 │   (id.kick.com) │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
    Frontend                    Backend                    External API
   Port: 5173                  Port: 3001
```

---

## Componentes Principales

### 1. Frontend (React + Vite)

**Tecnologías:**
- React 18
- Vite 5
- Axios para HTTP requests
- CSS modules

**Estructura:**
```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── services/            # Capa de servicios
│   │   └── api.js
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js
│   ├── App.jsx              # Componente principal
│   ├── App.css
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
└── package.json
```

**Responsabilidades:**
- Interfaz de usuario
- Gestión de estado de autenticación
- Comunicación con backend via API REST
- Manejo de rutas OAuth callback

---

### 2. Backend (Express.js)

**Tecnologías:**
- Express 4
- Node.js (ES Modules)
- Helmet (seguridad)
- CORS
- Cookie-parser
- Axios (HTTP client)
- dotenv (configuración)

**Estructura:**
```
backend/
├── src/
│   ├── config/              # Configuración
│   │   └── config.js
│   ├── middleware/          # Express middlewares
│   │   └── auth.js
│   ├── routes/              # Definición de rutas
│   │   ├── auth.js
│   │   └── api.js
│   ├── utils/               # Utilidades
│   │   └── auth.js
│   └── server.js            # Entry point
├── .env.example
└── package.json
```

**Responsabilidades:**
- API REST
- Autenticación OAuth2
- Manejo de sesiones
- Comunicación con KICK API
- Seguridad y validación

---

## Flujo de Autenticación OAuth2

```
┌─────────┐                                          ┌─────────┐
│ Usuario │                                          │  KICK   │
└────┬────┘                                          └────┬────┘
     │                                                     │
     │  1. Click "Login"                                  │
     ├──────────────────►┌──────────┐                    │
     │                   │ Frontend │                     │
     │                   └─────┬────┘                     │
     │                         │                          │
     │                         │ 2. GET /api/auth/login   │
     │                         ├──────────►┌──────────┐  │
     │                         │           │ Backend  │  │
     │                         │           └────┬─────┘  │
     │                         │                │        │
     │                         │    3. Generate state    │
     │                         │       Save in cookie    │
     │                         │                │        │
     │                         │  4. Redirect to KICK    │
     │  5. Redirect            │◄───────────────┤        │
     ├────────────────────────────────────────────────►  │
     │                         │                │        │
     │  6. User authorizes                      │        │
     │◄─────────────────────────────────────────────────┤
     │                         │                │        │
     │  7. Callback with code & state            │      │
     ├──────────────────────────────────────────►       │
     │                         │                │        │
     │                         │ 8. Validate state       │
     │                         │    Exchange code        │
     │                         │       for token ├──────►│
     │                         │                │        │
     │                         │  9. Get user info       │
     │                         │                ├──────►│
     │                         │                │◄───────┤
     │                         │                │        │
     │                         │ 10. Create session      │
     │                         │     Set cookie          │
     │                         │                │        │
     │  11. Redirect to app    │◄───────────────┤        │
     │◄────────────────────────┤                │        │
     │                         │                │        │
     │  12. Load dashboard     │                │        │
     ├──────────────────►      │                │        │
     │                         │                │        │
```

### Paso a Paso

1. **Usuario inicia login**: Click en botón "Conectar con KICK"
2. **Frontend redirige**: GET a `/api/auth/login`
3. **Backend genera state**: 
   - Genera string aleatorio criptográficamente seguro
   - Firma y guarda en cookie `oauth_state`
4. **Backend construye URL de autorización**: Con client_id, redirect_uri, scopes, state
5. **Usuario es redirigido a KICK**: Para autorizar la aplicación
6. **Usuario autoriza**: En la página de KICK
7. **KICK redirige de vuelta**: Con `code` y `state` en query params
8. **Backend valida y procesa**:
   - Valida state contra cookie
   - Intercambia code por access_token
   - Obtiene información del usuario
9. **Backend crea sesión**:
   - Genera sesión firmada con user data y tokens
   - Guarda en cookie `kick_session`
10. **Usuario redirigido a frontend**: Con sesión activa
11. **Frontend carga dashboard**: Usuario autenticado

---

## Seguridad

### Capas de Seguridad

1. **HTTPS** (Producción)
   - Todas las comunicaciones encriptadas
   - Cookies marcadas como `secure`

2. **CSRF Protection**
   - Parameter `state` en OAuth flow
   - Validación de state en callback
   - Cookies con flag `sameSite: lax`

3. **Cookie Security**
   - `httpOnly`: No accesible desde JavaScript
   - `signed`: Firmadas con HMAC-SHA256
   - `maxAge`: Expiración automática
   - `secure`: Solo HTTPS en producción

4. **CORS**
   - Solo peticiones desde frontend configurado
   - Credentials habilitadas solo para origen específico

5. **Headers de Seguridad (Helmet)**
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

6. **Validación de Input**
   - Validación de todos los parámetros
   - Sanitización de datos
   - Manejo seguro de errores

---

## Manejo de Estado

### Frontend

```javascript
// Hook useAuth
const { 
  user,           // Usuario autenticado o null
  loading,        // Estado de carga
  error,          // Error si existe
  isAuthenticated,// Boolean
  login,          // Función para iniciar login
  logout,         // Función para logout
  checkAuth       // Función para verificar auth
} = useAuth();
```

### Backend

```javascript
// Sesión en cookie firmada
{
  accessToken: "...",    // Token de acceso a KICK API
  refreshToken: "...",   // Token de refresh
  expiresIn: 3600,       // Tiempo de expiración
  user: {                // Datos del usuario
    id: 123456,
    username: "...",
    email: "...",
    ...
  }
}
```

---

## API REST

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/info` | Información de la API |
| GET | `/api/auth/login` | Iniciar OAuth flow |
| GET | `/api/auth/callback` | Callback OAuth |
| GET | `/api/auth/user` | Obtener usuario actual |
| POST | `/api/auth/logout` | Cerrar sesión |

---

## Configuración

### Variables de Entorno

**Backend:**
```env
PORT=3001
NODE_ENV=development
KICK_CLIENT_ID=...
KICK_CLIENT_SECRET=...
KICK_REDIRECT_URI=...
COOKIE_SECRET=...
FRONTEND_URL=...
```

**Frontend:**
```env
VITE_API_URL=http://localhost:3001
```

---

## Escalabilidad

### Consideraciones

1. **Sesiones**
   - Actualmente en cookies (stateless)
   - Fácil de escalar horizontalmente
   - Para multi-servidor: usar Redis o base de datos

2. **Rate Limiting**
   - No implementado actualmente
   - Recomendado para producción
   - Usar `express-rate-limit`

3. **Caching**
   - No implementado actualmente
   - Considerar para datos de usuario
   - Usar Redis o memoria cache

4. **Load Balancing**
   - Compatible con múltiples instancias
   - Usar nginx o similar como reverse proxy

---

## Mejoras Futuras

1. **Refresh Token Flow**
   - Renovar access tokens automáticamente
   - Mejorar experiencia de usuario

2. **WebSockets**
   - Eventos en tiempo real de KICK
   - Notificaciones push

3. **Database**
   - Persistencia de sesiones
   - Almacenar preferencias de usuario

4. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright/Cypress)

5. **Monitoring**
   - Logging estructurado
   - Métricas de aplicación
   - Error tracking (Sentry)

6. **API Extensions**
   - Más endpoints de KICK API
   - Gestión de canal
   - Chat management
   - Analytics
