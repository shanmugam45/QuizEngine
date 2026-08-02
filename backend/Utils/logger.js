// ── Minimal timestamped logger ────────────────────────────────────────────────

function ts() {
  return new Date().toISOString();
}

function info(service, message, meta = {}) {
  console.log(`[${ts()}] [INFO] [${service}] ${message}`, meta);
}

function warn(service, message, meta = {}) {
  console.warn(`[${ts()}] [WARN] [${service}] ${message}`, meta);
}

function error(service, message, meta = {}) {
  console.error(`[${ts()}] [ERROR] [${service}] ${message}`, meta);
}

module.exports = { info, warn, error };
