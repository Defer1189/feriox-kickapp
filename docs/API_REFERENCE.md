# API Reference - FerIOX Kick App

Quick reference guide for all API endpoints.

---

## Base URL

**Development:** `http://localhost:3000`  
**Production:** `https://your-domain.com`

---

## Health & Info Endpoints

### GET /api/health

Health check endpoint to verify server status.

**Response:**

```json
{
    "status": "success",
    "message": "✅ Servidor FerIOX Backend funcionando correctamente",
    "timestamp": "2025-10-23T17:24:01.683Z",
    "environment": "development",
    "version": "1.0.0"
}
```

### GET /api

Service information and available endpoints.

**Response:**

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
        "debug": "/api/auth/debug",
        "docs": "/api/docs"
    }
}
```

---

## Authentication Endpoints

### GET /api/auth/login

Initiates OAuth 2.1 authentication flow.

**Flow:**

1. Generates PKCE (code_verifier and code_challenge)
2. Generates random state for CSRF protection
3. Stores both in httpOnly signed cookies
4. Redirects user to KICK authorization page

**Cookies Set:**

- `kick_code_verifier` (httpOnly, signed, 10min)
- `kick_oauth_state` (httpOnly, signed, 10min)

**Redirect:**

```
https://id.kick.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:3000/api/auth/callback&
  response_type=code&
  scope=user:read+channel:read+...&
  code_challenge=CHALLENGE&
  code_challenge_method=S256&
  state=STATE
```

### GET /api/auth/callback

OAuth callback endpoint.

**Query Parameters:**

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| code      | string | Yes      | Authorization code from KICK |
| state     | string | Yes      | State for CSRF validation    |

**Flow:**

1. Validates state parameter
2. Exchanges code for access_token using code_verifier
3. Stores access_token and refresh_token in httpOnly cookies
4. Redirects to dashboard

**Cookies Set:**

- `kick_access_token` (httpOnly, expires with token)
- `kick_refresh_token` (httpOnly, 30 days)

**Success Redirect:**

```
/dashboard?auth=success
```

**Error Response:**

```
400 Bad Request - Invalid parameters
500 Internal Server Error - Token exchange failed
```

### GET /api/auth/user

**Protected Route** - Requires authentication cookie.

Fetches authenticated user data from KICK API.

**Headers:**

- Cookie: `kick_access_token=...` (automatically sent by browser)

**Response (Success):**

```json
{
    "status": "success",
    "data": {
        // User data from KICK API
    },
    "timestamp": "2025-10-23T17:24:01.683Z"
}
```

**Response (Unauthorized):**

```json
{
    "error": "No autorizado",
    "message": "Token de acceso no encontrado. Por favor, inicia sesión nuevamente."
}
```

**Status Codes:**

- 200 - Success
- 401 - Unauthorized (no token or invalid token)
- 500 - Server error

### POST /api/auth/logout

**Protected Route** - Clears authentication cookies.

Logs out the current user.

**Response:**

```json
{
    "status": "success",
    "message": "Sesión cerrada correctamente",
    "redirect": "/dashboard?logout=success"
}
```

**Cookies Cleared:**

- `kick_access_token`
- `kick_refresh_token`
- `kick_code_verifier`
- `kick_oauth_state`

---

## Debug Endpoints (Development Only)

### GET /api/auth/config

Verifies OAuth configuration.

**Response:**

```json
{
    "client_id": "✅ Configurado",
    "redirect_uri": "http://localhost:3000/api/auth/callback",
    "has_client_secret": true,
    "environment": "development"
}
```

### GET /api/auth/debug

Shows detailed token and session information.

**Requires:** Authentication cookie

**Response:**

```json
{
    "session": {
        "cookies_present": {
            "access_token": true,
            "refresh_token": true,
            "code_verifier": false,
            "oauth_state": false
        },
        "access_token_preview": "eyJhbGciOiJIUzI1...last20chars",
        "refresh_token_preview": "eyJhbGciOiJIUzI1...last20chars"
    },
    "token_decoded": {
        "payload": {
            /* JWT payload */
        },
        "issued_at": "2025-10-23T17:00:00.000Z",
        "expires_at": "2025-10-23T18:00:00.000Z",
        "scopes": "user:read channel:read..."
    },
    "environment": "development",
    "server_time": "2025-10-23T17:24:01.683Z",
    "server_url": "http://localhost:3000"
}
```

---

## Documentation

### GET /api/docs

Swagger UI interactive API documentation.

Opens in browser with interactive API explorer.

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request

```json
{
    "error": "Error message",
    "message": "Detailed description"
}
```

### 401 Unauthorized

```json
{
    "error": "No autorizado",
    "message": "Token de acceso no encontrado. Por favor, inicia sesión nuevamente."
}
```

### 404 Not Found

```json
{
    "error": "Ruta no encontrada",
    "path": "/api/unknown",
    "availableEndpoints": [...]
}
```

### 500 Internal Server Error

```json
{
    "status": "error",
    "message": "Error interno del servidor",
    "error": "Detailed error (development only)"
}
```

---

## KICK OAuth Scopes

The application requests these scopes:

| Scope              | Description                 | Risk Level |
| ------------------ | --------------------------- | ---------- |
| `user:read`        | Read user information       | Low        |
| `channel:read`     | Read channel information    | Low        |
| `channel:write`    | Modify channel metadata     | Medium     |
| `chat:write`       | Send chat messages          | Medium     |
| `streamkey:read`   | Read stream key (sensitive) | High       |
| `events:subscribe` | Subscribe to webhooks       | Medium     |
| `moderation:ban`   | Execute moderation actions  | High       |

---

## Rate Limiting

**Not implemented yet** - Consider adding rate limiting in production:

- Login endpoint: 5 requests per 15 minutes per IP
- User endpoint: 100 requests per minute per user
- Other endpoints: 1000 requests per hour per IP

---

## Example Usage

### JavaScript (Frontend)

```javascript
// Login
window.location.href = '/api/auth/login';

// Get user data
const response = await fetch('/api/auth/user', {
    credentials: 'include', // Important: include cookies
});
const data = await response.json();

// Logout
await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
});
```

### cURL (Testing)

```bash
# Health check
curl http://localhost:3000/api/health

# Get user (with cookies from browser)
curl -b cookies.txt http://localhost:3000/api/auth/user

# Logout
curl -X POST -b cookies.txt http://localhost:3000/api/auth/logout
```

### Postman

1. **Login:** Visit `/api/auth/login` in browser
2. **Export cookies:** Use browser extension to get cookies
3. **Import to Postman:** Add cookies to request
4. **Test endpoints:** Use cookies for authenticated requests

---

## Security Considerations

### Cookie Security

- All authentication cookies are `httpOnly` (not accessible via JavaScript)
- `secure` flag enabled in production (HTTPS only)
- `sameSite: 'lax'` to prevent CSRF
- Cookies are signed to prevent tampering

### PKCE Flow

- Uses SHA256 for code_challenge
- code_verifier is 128 characters (64 bytes hex)
- Prevents authorization code interception attacks

### State Parameter

- Random 32-character hex string
- Validated on callback to prevent CSRF
- Stored in signed cookie

---

## Testing the API

### Using the Swagger UI

1. Start the server
2. Visit http://localhost:3000/api/docs
3. Explore and test endpoints interactively

### Manual Testing Flow

1. Visit http://localhost:3000/api/health
2. Visit http://localhost:3000/api/auth/login
3. Authorize on KICK
4. You'll be redirected to /dashboard
5. Open DevTools → Network → Check cookies
6. Test /api/auth/user endpoint
7. Test /api/auth/logout endpoint

---

For more details, see:

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- [Installation Guide](./INSTALLATION.md)
- [Development Guide](./DEVELOPMENT.md)
