# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Health & Info

#### GET /health
Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-21T03:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

#### GET /info
Get information about the API and available endpoints.

**Response:**
```json
{
  "name": "FerIOX KICK API Integration",
  "version": "1.0.0",
  "description": "Backend API for KICK OAuth2 integration",
  "endpoints": { ... },
  "scopes": [...],
  "documentation": "https://github.com/Defer1189/feriox-kickapp"
}
```

### Authentication

#### GET /auth/login
Initiates the OAuth2 login flow by redirecting to KICK's authorization page.

**Process:**
1. Generates a random state for CSRF protection
2. Stores state in a signed, HTTP-only cookie
3. Redirects to KICK authorization URL with required parameters

**Parameters:**
- All parameters are handled automatically

**Redirects to:** KICK authorization page

---

#### GET /auth/callback
Handles the OAuth2 callback from KICK after user authorization.

**Query Parameters:**
- `code` (string): Authorization code from KICK
- `state` (string): CSRF protection state

**Process:**
1. Validates state parameter against cookie
2. Exchanges authorization code for access token
3. Stores tokens in signed, HTTP-only cookies
4. Redirects to frontend dashboard

**Success:** Redirects to `http://localhost:5173/dashboard`
**Failure:** Redirects to `http://localhost:5173?error=auth_failed`

---

#### POST /auth/logout
Logs out the user by clearing authentication cookies.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### GET /auth/status
Check if the user is currently authenticated.

**Response:**
```json
{
  "authenticated": true
}
```

### User Data

All user endpoints require authentication (valid access token in cookies).

#### GET /user
Get the authenticated user's profile data.

**Scope Required:** `user:read`

**Response:**
```json
{
  "id": "user_id",
  "username": "username",
  "email": "email@example.com",
  ...
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Authentication required",
    "status": 401
  }
}
```

---

#### GET /user/channel
Get the authenticated user's channel data.

**Scope Required:** `channel:read`

**Response:**
```json
{
  "id": "channel_id",
  "name": "Channel Name",
  "followers": 1234,
  ...
}
```

---

#### GET /user/streamkey
Get the authenticated user's stream key.

**Scope Required:** `streamkey:read`

**Response:**
```json
{
  "streamkey": "your_stream_key_here"
}
```

**⚠️ Security Warning:** Keep stream keys confidential!

## OAuth2 Scopes

The application requests the following scopes:

| Scope | Description |
|-------|-------------|
| `user:read` | Read user profile information |
| `channel:read` | Read channel data and settings |
| `channel:write` | Modify channel settings |
| `chat:write` | Send messages in chat |
| `streamkey:read` | Access stream key |
| `events:subscribe` | Subscribe to channel events |
| `moderation:ban` | Perform moderation actions |

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

1. **CSRF Protection**: State parameter validation
2. **HTTP-Only Cookies**: Tokens stored securely
3. **Signed Cookies**: Prevent tampering
4. **Helmet.js**: Security headers
5. **CORS**: Restricted to frontend origin
6. **Environment Variables**: Secure credential storage

## Rate Limiting

Currently, rate limiting is managed by KICK's API. Follow their rate limits and best practices.
