/**
 * Custom error handler middleware
 * Handles errors and returns appropriate JSON responses
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
      path: req.path
    }
  });
}
