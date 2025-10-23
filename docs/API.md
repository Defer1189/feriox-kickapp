# API Documentation - FerIOX Kick App

## Base URL

```
http://localhost:3000/api
```

## Authentication

La autenticación se maneja mediante cookies httpOnly que contienen los tokens de acceso y actualización.

## Endpoints

### Sistema

#### Health Check

Verifica que el servidor esté funcionando correctamente.

**Endpoint**: `GET /api/health`

**Respuesta exitosa** (200 OK):
```json
{
  "status": "success",
  "message": "✅ Servidor FerIOX Backend funcionando correctamente",
  "timestamp": "2025-10-23T15:52:23.176Z",
  "environment": "development",
  "version": "1.0.0"
}
```

---

#### Service Info

Proporciona información básica sobre el servicio.

**Endpoint**: `GET /api`

**Respuesta exitosa** (200 OK):
```json
{
  "service": "FerIOX KICK API Integration",
  "developer": "FerIOX",
  "status": "active",
  "version": "1.0.0",
  "message": "Escalado Horizontal, Ambición Vertical - KICK Dev",
  "endpoints": {
    "health": "/api/health",
    "login": "/api/auth/login",
    "user": "/api/auth/user",
    "logout": "/api/auth/logout",
    "config": "/api/auth/config",
    "debug": "/api/auth/debug"
  }
}
```

---

### Autenticación

#### Iniciar Login

Inicia el flujo de autenticación OAuth 2.1 con PKCE.

**Endpoint**: `GET /api/auth/login`

**Parámetros**: Ninguno

**Comportamiento**:
1. Genera un `code_verifier` aleatorio
2. Genera un `code_challenge` (SHA256 del verifier)
3. Genera un `state` aleatorio para prevenir CSRF
4. Guarda el verifier y state en cookies firmadas httpOnly
5. Redirige al usuario a la página de autorización de KICK

**Cookies establecidas**:
- `kick_code_verifier`: Code verifier para PKCE (httpOnly, signed, 10 min)
- `kick_oauth_state`: State para validación CSRF (httpOnly, signed, 10 min)

**Redirige a**: `https://id.kick.com/oauth/authorize?client_id=...&redirect_uri=...&response_type=code&scope=...&code_challenge=...&code_challenge_method=S256&state=...`

---

#### Callback de OAuth

KICK redirige al usuario a este endpoint después de la autorización.

**Endpoint**: `GET /api/auth/callback`

**Parámetros de Query**:
- `code` (string): Código de autorización de KICK
- `state` (string): State para validación CSRF
- `error` (string, opcional): Error de autorización
- `error_description` (string, opcional): Descripción del error

**Validaciones**:
1. Verifica que no haya errores de autorización
2. Verifica que se recibió el código
3. Verifica que exista el code_verifier en cookies
4. Valida que el state coincida (protección CSRF)

**Comportamiento**:
1. Intercambia el código de autorización por tokens
2. Guarda los tokens en cookies httpOnly seguras
3. Limpia las cookies temporales (verifier y state)
4. Redirige al dashboard

**Cookies establecidas**:
- `kick_access_token`: Token de acceso (httpOnly, secure en prod, expira según KICK)
- `kick_refresh_token`: Token de actualización (httpOnly, secure en prod, 30 días)

**Cookies eliminadas**:
- `kick_code_verifier`
- `kick_oauth_state`

**Redirige a**: `/dashboard?auth=success`

**Errores**:
- `400 Bad Request`: Error de autorización, código faltante, verifier faltante, state inválido
- `500 Internal Server Error`: Error al intercambiar el código por tokens

---

#### Obtener Usuario

Obtiene la información del usuario autenticado desde la API de KICK.

**Endpoint**: `GET /api/auth/user`

**Headers**: Ninguno (usa cookies automáticamente)

**Autenticación**: Requiere cookie `kick_access_token`

**Respuesta exitosa** (200 OK):
```json
{
  "status": "success",
  "data": {
    // Datos del usuario desde la API de KICK
    // La estructura depende de la respuesta de KICK API
  },
  "timestamp": "2025-10-23T15:52:23.176Z"
}
```

**Errores**:
- `401 Unauthorized`:
  ```json
  {
    "error": "No autorizado",
    "message": "Token de acceso no encontrado. Por favor, inicia sesión nuevamente."
  }
  ```
  o
  ```json
  {
    "error": "Token inválido o expirado",
    "message": "Por favor, inicia sesión nuevamente."
  }
  ```

- `500 Internal Server Error`:
  ```json
  {
    "error": "Error al obtener datos del usuario",
    "details": "Detalles del error (solo en development)",
    "status": 500,
    "attempted_url": "https://api.kick.com/public/v1/users"
  }
  ```

---

#### Cerrar Sesión

Cierra la sesión del usuario eliminando las cookies de autenticación.

**Endpoint**: `POST /api/auth/logout`

**Headers**: 
```
Content-Type: application/json
```

**Body**: Ninguno

**Autenticación**: Recomendado tener cookie `kick_access_token` pero no es obligatorio

**Respuesta exitosa** (200 OK):
```json
{
  "status": "success",
  "message": "Sesión cerrada correctamente",
  "redirect": "/dashboard?logout=success"
}
```

**Cookies eliminadas**:
- `kick_access_token`
- `kick_refresh_token`
- `kick_code_verifier`
- `kick_oauth_state`

---

#### Verificar Configuración

Verifica que las credenciales OAuth estén configuradas correctamente.

**Endpoint**: `GET /api/auth/config`

**Respuesta** (200 OK):
```json
{
  "client_id": "✅ Configurado",
  "redirect_uri": "http://localhost:3000/api/auth/callback",
  "has_client_secret": true,
  "environment": "development"
}
```

---

#### Debug de Sesión

Proporciona información detallada sobre la sesión actual (útil para debugging).

**Endpoint**: `GET /api/auth/debug`

**Respuesta** (200 OK):
```json
{
  "session": {
    "cookies_present": {
      "access_token": true,
      "refresh_token": true,
      "code_verifier": false,
      "oauth_state": false
    },
    "access_token_preview": "eyJhbGciOiJSUzI1NiIs...vNiIsInR5cCI6IkpXVCJ9",
    "refresh_token_preview": "def50200a1b2c3d4e5f...0a1b2c3d4e5f6a7b8c9d"
  },
  "token_decoded": {
    "payload": {
      "sub": "user_id",
      "iat": 1698765432,
      "exp": 1698769032,
      "scope": "user:read channel:read"
    },
    "issued_at": "2025-10-23T15:52:23.176Z",
    "expires_at": "2025-10-23T16:52:23.176Z",
    "scopes": "user:read channel:read"
  },
  "environment": "development",
  "server_time": "2025-10-23T15:52:23.176Z",
  "server_url": "http://localhost:3000"
}
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - La petición fue exitosa |
| 204 | No Content - La petición fue exitosa pero no hay contenido |
| 400 | Bad Request - La petición tiene errores |
| 401 | Unauthorized - Se requiere autenticación |
| 404 | Not Found - El recurso no existe |
| 500 | Internal Server Error - Error del servidor |

## Manejo de Errores

Todos los errores siguen un formato consistente:

```json
{
  "error": "Tipo de error",
  "message": "Mensaje descriptivo del error",
  "details": "Detalles adicionales (solo en development)"
}
```

## Cookies

### Cookies de Sesión

| Cookie | Tipo | Duración | httpOnly | Secure | Signed | Descripción |
|--------|------|----------|----------|--------|--------|-------------|
| `kick_access_token` | Autenticación | Variable (según KICK) | ✅ | Producción | ❌ | Token de acceso |
| `kick_refresh_token` | Autenticación | 30 días | ✅ | Producción | ❌ | Token de actualización |

### Cookies Temporales

| Cookie | Tipo | Duración | httpOnly | Secure | Signed | Descripción |
|--------|------|----------|----------|--------|--------|-------------|
| `kick_code_verifier` | PKCE | 10 minutos | ✅ | Producción | ✅ | Code verifier para PKCE |
| `kick_oauth_state` | CSRF | 10 minutos | ✅ | Producción | ✅ | State para validación CSRF |

## CORS

El servidor está configurado para aceptar peticiones desde el frontend configurado en `FRONTEND_URL`.

**Métodos permitidos**: GET, POST, PUT, DELETE, OPTIONS
**Headers permitidos**: Content-Type, Authorization, X-Requested-With
**Credentials**: Habilitado (permite envío de cookies)

## Seguridad

### Headers de Seguridad (Helmet)

El servidor configura automáticamente headers de seguridad usando Helmet:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- Y más...

### Timeouts

Todas las peticiones a APIs externas tienen timeout:
- KICK Token Exchange: 15 segundos
- KICK User API: 10 segundos

## OAuth 2.1 con PKCE

### Scopes Solicitados

```
user:read
channel:read
channel:write
chat:write
streamkey:read
events:subscribe
moderation:ban
```

### URLs de KICK

- **Autorización**: `https://id.kick.com/oauth/authorize`
- **Token Exchange**: `https://id.kick.com/oauth/token`
- **User API**: `https://api.kick.com/public/v1/users`

## Rate Limiting

Actualmente no hay rate limiting implementado. Se recomienda implementar rate limiting en producción.

## Versionado

La versión actual de la API es `1.0.0`. Los cambios incompatibles incrementarán la versión mayor.

---

**Última actualización**: 2025-10-23
**Versión**: 1.0.0
