// ── Validation middleware ──────────────────────────────────────────────────────

// Factory that returns middleware checking that all listed fields exist in req.body.
// Returns a 400 with the list of missing fields if any are absent/empty.
function requireFields(fields) {
  return function validateRequiredFields(req, res, next) {
    const missing = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(", ")}`,
      });
    }

    return next();
  };
}

// Normalizes the :roomCode URL param to uppercase and trimmed,
// so room lookups are case-insensitive and whitespace-safe.
function normalizeRoomCodeParam(req, res, next) {
  if (req.params.roomCode) {
    req.params.roomCode = String(req.params.roomCode).trim().toUpperCase();
  }

  return next();
}

module.exports = {
  requireFields,
  normalizeRoomCodeParam,
};
