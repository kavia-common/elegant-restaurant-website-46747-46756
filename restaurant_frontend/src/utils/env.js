//
// PUBLIC_INTERFACE
// env.js - Centralized environment configuration for the frontend.
// Exposes a read-only config object with all relevant REACT_APP_* variables and helpers.
/**
 * PUBLIC_INTERFACE
 * getConfig
 * Returns a frozen config object sourced from process.env (Create React App).
 * This ensures a single place to read environment variables throughout the app.
 */
export function getConfig() {
  // Normalize and trim trailing slashes where appropriate
  const trimEndSlash = (v) =>
    typeof v === 'string' ? v.replace(/\/+$/, '') : v;

  const cfg = {
    // Base URL priority: API_BASE > BACKEND_URL > ''
    API_BASE: trimEndSlash(
      process.env.REACT_APP_API_BASE ||
        process.env.REACT_APP_BACKEND_URL ||
        ''
    ),
    BACKEND_URL: trimEndSlash(process.env.REACT_APP_BACKEND_URL || ''),
    FRONTEND_URL: trimEndSlash(process.env.REACT_APP_FRONTEND_URL || ''),
    WS_URL: trimEndSlash(process.env.REACT_APP_WS_URL || ''),
    NODE_ENV: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development',
    NEXT_TELEMETRY_DISABLED:
      process.env.REACT_APP_NEXT_TELEMETRY_DISABLED === '1' ||
      process.env.REACT_APP_NEXT_TELEMETRY_DISABLED === 'true',
    ENABLE_SOURCE_MAPS:
      process.env.REACT_APP_ENABLE_SOURCE_MAPS === '1' ||
      process.env.REACT_APP_ENABLE_SOURCE_MAPS === 'true',
    PORT: process.env.REACT_APP_PORT || '',
    TRUST_PROXY:
      process.env.REACT_APP_TRUST_PROXY === '1' ||
      process.env.REACT_APP_TRUST_PROXY === 'true',
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
    HEALTHCHECK_PATH: process.env.REACT_APP_HEALTHCHECK_PATH || '/health',
    FEATURE_FLAGS: process.env.REACT_APP_FEATURE_FLAGS || '',
    EXPERIMENTS_ENABLED:
      process.env.REACT_APP_EXPERIMENTS_ENABLED === '1' ||
      process.env.REACT_APP_EXPERIMENTS_ENABLED === 'true',
  };

  return Object.freeze(cfg);
}

/**
 * PUBLIC_INTERFACE
 * getApiBase
 * Returns the resolved API base URL following priority: REACT_APP_API_BASE || REACT_APP_BACKEND_URL || ''.
 */
export function getApiBase() {
  const { API_BASE } = getConfig();
  return API_BASE;
}

// PUBLIC_INTERFACE
// Default export for convenience
const env = Object.freeze({
  getConfig,
  getApiBase,
});
export default env;
