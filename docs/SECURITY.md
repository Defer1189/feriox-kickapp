# Security Best Practices

## Overview

This document outlines the security measures implemented in the FerIOX KICK API application and best practices for maintaining security.

## Implemented Security Features

### 1. OAuth2 Authentication

- **Standard Protocol**: Using OAuth 2.0 authorization code flow
- **State Parameter**: CSRF protection with cryptographically secure random state
- **Code Exchange**: Secure server-side token exchange
- **Scope Limitation**: Request only necessary scopes

### 2. Cookie Security

All cookies are configured with security in mind:

```javascript
{
  httpOnly: true,        // Prevents JavaScript access
  secure: true,          // HTTPS only (production)
  signed: true,          // Cryptographic signature
  sameSite: 'lax',      // CSRF protection
  maxAge: ...           // Automatic expiration
}
```

**Cookie Types:**
- `oauth_state`: Temporary state for OAuth flow (10 minutes)
- `access_token`: API access token (expires per KICK's response)
- `refresh_token`: Token refresh capability (30 days)

### 3. CORS Configuration

- **Origin Restriction**: Only configured frontend URL allowed
- **Credentials**: Enabled for cookie transmission
- **Methods**: Limited to necessary HTTP methods
- **Headers**: Restricted allowed headers

### 4. HTTP Security Headers (Helmet.js)

Helmet.js adds security headers:
- X-DNS-Prefetch-Control
- X-Frame-Options
- Strict-Transport-Security
- X-Download-Options
- X-Content-Type-Options
- X-XSS-Protection

### 5. Environment Variables

- **Separation**: Credentials never in source code
- **Template Files**: `.env.example` for documentation
- **Git Ignore**: `.env` files excluded from version control

### 6. Input Validation

- State parameter validation
- Query parameter verification
- Error handling for malformed requests

## Environment Security

### Development vs Production

**Development:**
```env
NODE_ENV=development
# Cookies: secure=false (HTTP allowed)
# Debug logging: enabled
```

**Production:**
```env
NODE_ENV=production
# Cookies: secure=true (HTTPS only)
# Debug logging: disabled
```

### Secure Cookie Secret

Generate a strong, random secret:

```bash
# Generate 32-byte random hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Requirements:
- Minimum 32 characters
- Cryptographically random
- Unique per environment
- Never commit to repository

## API Security

### Token Storage

**Backend:**
- Tokens stored in signed, HTTP-only cookies
- Not accessible to client-side JavaScript
- Automatic expiration

**Frontend:**
- No token storage in localStorage/sessionStorage
- Tokens transmitted automatically via cookies
- XSS protection through HTTP-only cookies

### Request Authentication

```javascript
// Middleware checks for valid access token
export function requireAuth(req, res, next) {
  const accessToken = req.signedCookies.access_token;
  
  if (!accessToken) {
    return res.status(401).json({
      error: { message: 'Authentication required' }
    });
  }
  
  req.accessToken = accessToken;
  next();
}
```

## Common Vulnerabilities & Mitigations

### 1. Cross-Site Request Forgery (CSRF)

**Vulnerability**: Unauthorized actions performed on behalf of authenticated user

**Mitigations:**
- OAuth state parameter validation
- SameSite cookie attribute
- Origin header validation (CORS)

### 2. Cross-Site Scripting (XSS)

**Vulnerability**: Injection of malicious scripts

**Mitigations:**
- HTTP-only cookies (no JS access)
- React's built-in XSS protection
- Content Security Policy headers
- Input sanitization

### 3. Session Hijacking

**Vulnerability**: Stealing session cookies

**Mitigations:**
- HTTPS in production (secure cookies)
- Signed cookies (tampering detection)
- Short token expiration
- HTTP-only flag

### 4. Man-in-the-Middle (MITM)

**Vulnerability**: Intercepting communications

**Mitigations:**
- HTTPS required in production
- Strict-Transport-Security header
- Secure cookie flag

### 5. Token Leakage

**Vulnerability**: Exposure of access tokens

**Mitigations:**
- No tokens in URLs or localStorage
- Server-side storage only
- Automatic expiration
- Refresh token rotation

## Best Practices Checklist

### Deployment

- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Generate unique, strong cookie secret
- [ ] Configure CORS for production domain
- [ ] Update redirect URI in KICK Developer Portal
- [ ] Enable all security headers
- [ ] Set appropriate token expiration times
- [ ] Implement rate limiting (if needed)
- [ ] Monitor logs for suspicious activity

### Code

- [ ] Never commit `.env` files
- [ ] Never log sensitive data (tokens, secrets)
- [ ] Validate all user inputs
- [ ] Use parameterized queries (when using databases)
- [ ] Keep dependencies updated
- [ ] Review third-party packages
- [ ] Handle errors gracefully without leaking info

### Operations

- [ ] Regular security audits
- [ ] Monitor for dependency vulnerabilities
- [ ] Rotate secrets periodically
- [ ] Implement backup strategy
- [ ] Have incident response plan
- [ ] Keep access logs
- [ ] Regular token cleanup

## Credential Management

### What to Keep Secret

**Critical (Never expose):**
- `CLIENT_SECRET`: KICK OAuth2 client secret
- `COOKIE_SECRET`: Cookie signing secret
- Access tokens
- Refresh tokens
- Stream keys

**Configuration (Can be public):**
- `CLIENT_ID`: KICK OAuth2 client ID
- `FRONTEND_URL`: Frontend URL
- `PORT`: Server port
- API endpoint URLs

### Credential Rotation

Rotate credentials:
- Immediately if compromised
- Quarterly as best practice
- When team members leave
- After major updates

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email security concerns to the repository owner
3. Provide detailed description
4. Include reproduction steps if possible
5. Allow time for fix before disclosure

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security Best Practices](https://react.dev/learn/writing-markup-with-jsx#jsx-prevents-injection-attacks)

## Regular Maintenance

### Weekly
- Check for dependency updates
- Review access logs

### Monthly
- Security audit
- Dependency vulnerability scan
- Review and rotate logs

### Quarterly
- Rotate credentials
- Update dependencies
- Security testing
- Documentation review
