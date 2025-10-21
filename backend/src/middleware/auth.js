import { config } from '../config/config.js';
import { unsignCookie } from '../utils/auth.js';

/**
 * Middleware to verify user authentication
 * Checks for valid session cookie
 */
export function requireAuth(req, res, next) {
  const sessionCookie = req.cookies[config.SESSION_COOKIE_NAME];
  
  if (!sessionCookie) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No session found. Please log in.'
    });
  }
  
  // Verify signed cookie
  const sessionData = unsignCookie(sessionCookie, config.COOKIE_SECRET);
  
  if (!sessionData) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid session. Please log in again.'
    });
  }
  
  try {
    req.user = JSON.parse(sessionData);
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid session data. Please log in again.'
    });
  }
}

/**
 * Optional auth middleware - adds user to request if authenticated
 * but doesn't block unauthenticated requests
 */
export function optionalAuth(req, res, next) {
  const sessionCookie = req.cookies[config.SESSION_COOKIE_NAME];
  
  if (sessionCookie) {
    const sessionData = unsignCookie(sessionCookie, config.COOKIE_SECRET);
    if (sessionData) {
      try {
        req.user = JSON.parse(sessionData);
      } catch (error) {
        // Invalid session data, continue without user
      }
    }
  }
  
  next();
}
