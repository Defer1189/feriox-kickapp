# OAuth2 Flow Documentation

## Overview

This document explains the OAuth2 authorization code flow implementation for KICK API integration.

## Flow Diagram

```
┌─────────┐                                  ┌─────────┐                    ┌─────────┐
│         │                                  │         │                    │         │
│  User   │                                  │ Backend │                    │  KICK   │
│ Browser │                                  │ Server  │                    │   API   │
│         │                                  │         │                    │         │
└────┬────┘                                  └────┬────┘                    └────┬────┘
     │                                            │                              │
     │  1. Click "Login with KICK"               │                              │
     ├──────────────────────────────────────────>│                              │
     │                                            │                              │
     │                                            │  2. Generate state          │
     │                                            │     Store in cookie         │
     │                                            │                              │
     │  3. Redirect to KICK authorize URL         │                              │
     │    (with state parameter)                  │                              │
     │<───────────────────────────────────────────┤                              │
     │                                            │                              │
     │  4. GET /oauth/authorize                   │                              │
     │    ?client_id=...                          │                              │
     │    &redirect_uri=...                       │                              │
     │    &response_type=code                     │                              │
     │    &scope=user:read+channel:read...        │                              │
     │    &state=...                              │                              │
     ├────────────────────────────────────────────┼─────────────────────────────>│
     │                                            │                              │
     │  5. User authorizes application            │                              │
     │                                            │                              │
     │  6. Redirect to callback with code         │                              │
     │<───────────────────────────────────────────┼──────────────────────────────┤
     │                                            │                              │
     │  7. GET /api/auth/callback                 │                              │
     │    ?code=...&state=...                     │                              │
     ├──────────────────────────────────────────>│                              │
     │                                            │                              │
     │                                            │  8. Validate state           │
     │                                            │     (compare with cookie)    │
     │                                            │                              │
     │                                            │  9. POST /oauth/token        │
     │                                            │     Exchange code for tokens │
     │                                            ├─────────────────────────────>│
     │                                            │                              │
     │                                            │  10. Return access_token,    │
     │                                            │      refresh_token           │
     │                                            │<─────────────────────────────┤
     │                                            │                              │
     │                                            │  11. Store tokens in         │
     │                                            │      signed cookies          │
     │                                            │                              │
     │  12. Redirect to dashboard                 │                              │
     │<───────────────────────────────────────────┤                              │
     │                                            │                              │
     │  13. Load dashboard page                   │                              │
     │                                            │                              │
     │  14. GET /api/auth/status                  │                              │
     ├──────────────────────────────────────────>│                              │
     │                                            │                              │
     │  15. { authenticated: true }               │                              │
     │<───────────────────────────────────────────┤                              │
     │                                            │                              │
     │  16. GET /api/user                         │                              │
     │     (with cookie)                          │                              │
     ├──────────────────────────────────────────>│                              │
     │                                            │                              │
     │                                            │  17. GET /v1/user            │
     │                                            │      Authorization: Bearer... │
     │                                            ├─────────────────────────────>│
     │                                            │                              │
     │                                            │  18. User data               │
     │                                            │<─────────────────────────────┤
     │                                            │                              │
     │  19. Display user data                     │                              │
     │<───────────────────────────────────────────┤                              │
     │                                            │                              │
```

## Step-by-Step Breakdown

### Step 1-3: Initiate Login

**Frontend → Backend**
```javascript
// User clicks login button
apiService.auth.login(); // Redirects to backend
```

**Backend → KICK**
```javascript
// Generate state
const state = crypto.randomBytes(32).toString('hex');

// Store in signed cookie
res.cookie('oauth_state', state, {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  signed: true,
  maxAge: 600000 // 10 minutes
});

// Build authorization URL
const authUrl = `https://id.kick.com/oauth/authorize?${params}`;

// Redirect
res.redirect(authUrl);
```

### Step 4-6: User Authorization

**User → KICK**
- User sees KICK authorization page
- Reviews requested scopes
- Approves or denies application access
- KICK redirects back with authorization code

### Step 7-11: Token Exchange

**Frontend → Backend**
- Browser receives redirect with code and state
- Automatically calls callback endpoint

**Backend → KICK**
```javascript
// Validate state
if (receivedState !== storedState) {
  throw new Error('Invalid state');
}

// Exchange code for tokens
const tokenResponse = await axios.post(
  'https://id.kick.com/oauth/token',
  {
    grant_type: 'authorization_code',
    client_id: config.kick.clientId,
    client_secret: config.kick.clientSecret,
    redirect_uri: config.kick.redirectUri,
    code: code
  }
);

// Store tokens in cookies
res.cookie('access_token', access_token, { ... });
res.cookie('refresh_token', refresh_token, { ... });
```

### Step 12-19: Authenticated Requests

**Frontend → Backend**
```javascript
// Check auth status
const status = await apiService.auth.status();

// Make authenticated requests
const userData = await apiService.user.getProfile();
```

**Backend → KICK**
```javascript
// Backend forwards request with token
const response = await axios.get(
  'https://api.kick.com/v1/user',
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);
```

## Security Measures

### CSRF Protection (State Parameter)

**Purpose**: Prevent cross-site request forgery attacks

**Implementation**:
1. Generate cryptographically random state
2. Store in signed cookie
3. Include in authorization URL
4. Validate on callback

**Code**:
```javascript
// Generate
const state = crypto.randomBytes(32).toString('hex');

// Validate
if (receivedState !== storedState) {
  return res.status(400).json({
    error: { message: 'Invalid state - possible CSRF attack' }
  });
}
```

### Token Storage

**Method**: HTTP-only, signed cookies

**Benefits**:
- Not accessible to JavaScript (XSS protection)
- Signed to prevent tampering
- Automatic expiration
- Sent automatically with requests

**Code**:
```javascript
res.cookie('access_token', token, {
  httpOnly: true,      // No JavaScript access
  secure: true,        // HTTPS only (production)
  signed: true,        // Cryptographically signed
  sameSite: 'lax',    // CSRF protection
  maxAge: expires_in * 1000
});
```

### Scope Management

**Requested Scopes**:
```javascript
const scopes = [
  'user:read',        // User profile
  'channel:read',     // Channel info
  'channel:write',    // Modify channel
  'chat:write',       // Send messages
  'streamkey:read',   // Stream key
  'events:subscribe', // Events
  'moderation:ban'    // Moderation
];
```

**Principle**: Request only necessary scopes for application functionality

## Error Handling

### Common Errors

1. **Invalid State**
   - Cause: State mismatch or expired
   - Response: 400 Bad Request
   - Action: Clear cookies, redirect to login

2. **Missing Authorization Code**
   - Cause: User denied access
   - Response: 400 Bad Request
   - Action: Redirect to home with error

3. **Token Exchange Failed**
   - Cause: Invalid code or credentials
   - Response: Redirect with error
   - Action: Show error message, allow retry

4. **Authentication Required**
   - Cause: No valid access token
   - Response: 401 Unauthorized
   - Action: Redirect to login

## Token Lifecycle

### Access Token
- **Purpose**: API authentication
- **Lifetime**: Set by KICK (typically 1 hour)
- **Storage**: Signed cookie
- **Renewal**: Use refresh token

### Refresh Token
- **Purpose**: Obtain new access tokens
- **Lifetime**: Longer (typically 30 days)
- **Storage**: Signed cookie
- **Usage**: Not yet implemented (future enhancement)

### State Token
- **Purpose**: CSRF protection
- **Lifetime**: 10 minutes
- **Storage**: Signed cookie
- **Usage**: One-time use during OAuth flow

## Best Practices

1. **Never expose tokens in URLs**: Use cookies instead
2. **Always validate state**: CSRF protection is critical
3. **Use HTTPS in production**: Secure cookie transmission
4. **Short token lifetimes**: Limit exposure window
5. **Implement token refresh**: Better user experience
6. **Log security events**: Monitor for suspicious activity
7. **Handle errors gracefully**: Don't leak sensitive info

## Future Enhancements

1. **Token Refresh**
   - Automatic renewal before expiration
   - Seamless user experience
   - Reduced login frequency

2. **Logout Propagation**
   - Revoke tokens on KICK
   - Complete session cleanup

3. **Multi-factor Authentication**
   - Additional security layer
   - Integration with KICK's MFA

4. **Session Management**
   - Track active sessions
   - Allow user to revoke sessions
   - Display session information
