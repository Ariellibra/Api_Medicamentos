function errorHandler(err, req, res, next) {
  // Log interno
  console.error("🔥 ERROR:", err.stack || err);

  // Seteo de status por defecto (500)
  const statusCode = err.statusCode || 500;

  // Mensaje público (según entorno)
  const response = {
    ok: false,
    status: statusCode,
    mensaje: err.message || "Error interno del servidor",
  };

  // Extra para desarrollo (no lo muestres en producción)
  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
