/**
 * Middleware de manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: 'Ruta no encontrada',
      status: 404
    }
  });
};
