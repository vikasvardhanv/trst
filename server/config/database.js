import pg from 'pg';
import logger from '../utils/logger.js';
const { Pool } = pg;

// Parse DATABASE_URL to check if it requires SSL
const requiresSSL = process.env.DATABASE_URL?.includes('sslmode=require');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: requiresSSL ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection
pool.on('connect', (client) => {
  logger.db('Pool client connected', true, {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  });
});

pool.on('error', (err, client) => {
  logger.error('Unexpected PostgreSQL pool error', {
    message: err.message,
    code: err.code,
    detail: err.detail,
  });
});

pool.on('remove', (client) => {
  logger.debug('Pool client removed', {
    totalCount: pool.totalCount,
  });
});

// Wrapper with logging for queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries (> 100ms)
    if (duration > 100) {
      logger.warn('Slow query detected', {
        duration: `${duration}ms`,
        query: text.substring(0, 100),
        rows: result.rowCount,
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('Database query failed', {
      duration: `${duration}ms`,
      query: text.substring(0, 100),
      error: error.message,
      code: error.code,
      detail: error.detail,
    });
    throw error;
  }
};

// Test database connection on startup
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW() as now, current_database() as db');
    logger.db('Connection test', true, {
      database: result.rows[0].db,
      serverTime: result.rows[0].now,
    });
    return true;
  } catch (error) {
    logger.error('Database connection test failed', {
      message: error.message,
      code: error.code,
    });
    return false;
  }
};

// Run connection test
testConnection();

export default pool;
