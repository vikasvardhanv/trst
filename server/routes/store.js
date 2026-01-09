import express from 'express';
import { getStoreCategory, getStoreWorkflow, listStoreCategories, requestDownloadToken, downloadWorkflow } from '../controllers/storeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (browsing)
router.get('/categories', listStoreCategories);
router.get('/categories/:categorySlug', getStoreCategory);
router.get('/workflows/:categorySlug/:workflowFile', getStoreWorkflow);

// Protected route: request a one-time download token
router.post('/download-token/:workflowId', authenticateToken, requestDownloadToken);

// Download route: uses token (no auth header needed, but token is one-time + expires)
router.get('/download/:token', downloadWorkflow);

export default router;
