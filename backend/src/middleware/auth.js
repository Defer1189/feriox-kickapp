/**
 * Authentication middleware
 * Checks if user has a valid access token in cookies
 */
export function requireAuth(req, res, next) {
  const accessToken = req.signedCookies.access_token;

  if (!accessToken) {
    return res.status(401).json({
      error: {
        message: 'Authentication required',
        status: 401
      }
    });
  }

  // Store token in request for use in routes
  req.accessToken = accessToken;
  next();
}
