/**
 * Simple logger utility for Coolify terminal visibility
 * All logs use console.log/console.error which appear in Coolify logs
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const isProduction = process.env.NODE_ENV === 'production';

// Format timestamp for logs
const getTimestamp = () => {
  return new Date().toISOString();
};

// Format log message with consistent structure
const formatLog = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

const logger = {
  error: (message, meta = {}) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, meta));
  },

  warn: (message, meta = {}) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, meta));
  },

  info: (message, meta = {}) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, meta));
  },

  debug: (message, meta = {}) => {
    // Only log debug in development
    if (!isProduction) {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, meta));
    }
  },

  // Log HTTP requests
  request: (req, statusCode, duration) => {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent')?.substring(0, 50),
    };

    if (statusCode >= 500) {
      console.error(formatLog(LOG_LEVELS.ERROR, 'HTTP Request', meta));
    } else if (statusCode >= 400) {
      console.warn(formatLog(LOG_LEVELS.WARN, 'HTTP Request', meta));
    } else {
      console.log(formatLog(LOG_LEVELS.INFO, 'HTTP Request', meta));
    }
  },

  // Log database operations
  db: (operation, success, meta = {}) => {
    if (success) {
      console.log(formatLog(LOG_LEVELS.INFO, `DB ${operation}`, meta));
    } else {
      console.error(formatLog(LOG_LEVELS.ERROR, `DB ${operation} FAILED`, meta));
    }
  },

  // Log auth events
  auth: (event, success, meta = {}) => {
    const level = success ? LOG_LEVELS.INFO : LOG_LEVELS.WARN;
    const fn = success ? console.log : console.warn;
    fn(formatLog(level, `AUTH ${event}`, meta));
  },

  // Log startup info
  startup: (message, meta = {}) => {
    console.log(formatLog(LOG_LEVELS.INFO, `STARTUP: ${message}`, meta));
  },
};

export default logger;
