# Documentación de la API - FerIOX KICK App

## URL Base

```
http://localhost:3001
```

## Endpoints

### 1. Health Check

Verifica el estado del servidor.

**Endpoint:** `GET /api/health`

**Respuesta exitosa (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

---

### 2. Información de la API

Obtiene información general sobre la API y sus endpoints.

**Endpoint:** `GET /api/info`

**Respuesta exitosa (200):**
```json
{
  "name": "FerIOX KICK API Integration",
  "version": "1.0.0",
  "description": "Backend API for KICK streaming platform integration",
  "endpoints": {
    "health": "/api/health",
    "info": "/api/info",
    "auth": {
      "login": "/api/auth/login",
      "callback": "/api/auth/callback",
      "user": "/api/auth/user",
      "logout": "/api/auth/logout"
    }
  },
  "scopes": [
    "user:read",
    "channel:read",
    "channel:write",
    "chat:write",
    "streamkey:read",
    "events:subscribe",
    "moderation:ban"
  ],
  "documentation": "/docs"
}
```

---

### 3. Iniciar Login OAuth

Inicia el flujo de autenticación OAuth2 con KICK.

**Endpoint:** `GET /api/auth/login`

**Comportamiento:**
1. Genera un `state` aleatorio para protección CSRF
2. Guarda el `state` en una cookie firmada
3. Redirige al usuario a la página de autorización de KICK

**Redirección:**
```
https://id.kick.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:3001/api/auth/callback&
  response_type=code&
  scope=user:read+channel:read+channel:write+chat:write+streamkey:read+events:subscribe+moderation:ban&
  state=RANDOM_STATE
```

---

### 4. Callback de OAuth

Procesa el callback de KICK después de la autorización.

**Endpoint:** `GET /api/auth/callback`

**Parámetros de consulta:**
- `code` (string, requerido): Código de autorización de KICK
- `state` (string, requerido): State para validación CSRF
- `error` (string, opcional): Error de autorización si ocurrió
- `error_description` (string, opcional): Descripción del error

**Comportamiento:**
1. Valida el `state` contra la cookie
2. Intercambia el código de autorización por un access token
3. Obtiene información del usuario de KICK
4. Crea una sesión firmada en una cookie
5. Redirige al usuario al frontend

**Redirección exitosa:**
```
http://localhost:5173
```

**Redirección con error:**
```
http://localhost:5173?error=ERROR_MESSAGE
```

---

### 5. Obtener Usuario Actual

Obtiene información del usuario autenticado.

**Endpoint:** `GET /api/auth/user`

**Headers requeridos:**
- `Cookie`: Debe incluir la cookie de sesión

**Respuesta exitosa (200):**
```json
{
  "user": {
    "id": 123456,
    "username": "usuario_kick",
    "email": "usuario@example.com",
    "slug": "usuario_kick",
    "avatar": "https://...",
    ...
  },
  "expiresIn": 3600
}
```

**Respuesta de error (401):**
```json
{
  "error": "Unauthorized",
  "message": "No active session"
}
```

---

### 6. Logout

Cierra la sesión del usuario.

**Endpoint:** `POST /api/auth/logout`

**Headers requeridos:**
- `Cookie`: Debe incluir la cookie de sesión

**Respuesta exitosa (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 7. Ruta No Encontrada

Todas las rutas no definidas retornan un error 404.

**Respuesta (404):**
```json
{
  "error": "Not Found",
  "message": "Route GET /some/path not found",
  "availableRoutes": [
    "GET /",
    "GET /api/health",
    "GET /api/info",
    "GET /api/auth/login",
    "GET /api/auth/callback",
    "GET /api/auth/user",
    "POST /api/auth/logout"
  ]
}
```

---

## Códigos de Estado HTTP

- `200` - Éxito
- `302` - Redirección (usado en OAuth flow)
- `401` - No autorizado (sesión inválida o faltante)
- `404` - Ruta no encontrada
- `500` - Error interno del servidor

---

## Cookies

### `oauth_state`
- **Propósito**: Almacena el state CSRF para validación OAuth
- **Duración**: 10 minutos
- **Flags**: `httpOnly`, `sameSite: lax`
- **Firmada**: Sí

### `kick_session`
- **Propósito**: Almacena la sesión del usuario autenticado
- **Duración**: 24 horas
- **Flags**: `httpOnly`, `sameSite: lax`, `secure` (en producción)
- **Firmada**: Sí

---

## Seguridad

### CSRF Protection
El flujo OAuth usa un parámetro `state` aleatorio que se valida en el callback para prevenir ataques CSRF.

### Cookie Signing
Todas las cookies están firmadas con HMAC-SHA256 usando el `COOKIE_SECRET` configurado.

### CORS
Solo se permiten peticiones desde el `FRONTEND_URL` configurado con credenciales habilitadas.

### Helmet
Se utilizan headers de seguridad configurados con Helmet para proteger contra vulnerabilidades comunes.

---

## Ejemplos de Uso

### JavaScript (Frontend)

```javascript
// Login
window.location.href = 'http://localhost:3001/api/auth/login';

// Get user
const response = await fetch('http://localhost:3001/api/auth/user', {
  credentials: 'include'
});
const data = await response.json();

// Logout
await fetch('http://localhost:3001/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
```

### cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Get user (with cookie)
curl -H "Cookie: kick_session=..." http://localhost:3001/api/auth/user

# Logout
curl -X POST -H "Cookie: kick_session=..." http://localhost:3001/api/auth/logout
```
