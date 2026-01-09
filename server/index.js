import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import leadsRoutes from './routes/leads.js';
import storeRoutes from './routes/store.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Only log API requests to reduce noise
    if (req.originalUrl.startsWith('/api')) {
      logger.request(req, res.statusCode, duration);
    }
  });

  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for SPA
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://highshiftmedia.com',
  'https://www.highshiftmedia.com',
].filter(Boolean);

app.use(cors({
  origin: isProduction
    ? allowedOrigins
    : true, // Allow all in development
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/store', storeRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Serve static files in production
if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');

  // Serve static files
  app.use(express.static(distPath));

  // Handle SPA routing - send all non-API requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled server error', {
    message: err.message,
    stack: err.stack?.split('\n').slice(0, 3).join(' | '),
    url: req.originalUrl,
    method: req.method,
    body: req.body ? JSON.stringify(req.body).substring(0, 200) : undefined,
  });

  res.status(500).json({
    success: false,
    message: isProduction
      ? 'An unexpected error occurred'
      : err.message
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION - Server shutting down', {
    message: err.message,
    stack: err.stack?.split('\n').slice(0, 5).join(' | '),
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION', {
    reason: reason?.toString(),
  });
});

app.listen(PORT, () => {
  logger.startup('Server started', {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
  });

  // Log database connection status
  logger.startup('Database URL configured', {
    hasDbUrl: !!process.env.DATABASE_URL,
    dbHost: process.env.DATABASE_URL?.match(/@([^:]+):/)?.[1]?.substring(0, 10) + '...' || 'not set',
  });
});

export default app;
