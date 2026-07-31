// ── Not-found handler ─────────────────────────────────────────────────────────
// Catches any request that didn't match a route above it.
function notFound(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// ── Global error handler ──────────────────────────────────────────────────────
// Centralized catch for all errors thrown/passed via next(err).
// If headers were already sent, delegates to Express's default handler.
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({
    success: false,
    message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
