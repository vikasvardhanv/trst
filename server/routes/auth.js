import express from 'express';
import { signup, login, getCurrentUser, logDemoAccess, verifyToken, oauthLogin, googleRedirectCallback } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/oauth', oauthLogin);  // Google/Apple OAuth
router.post('/google/callback', googleRedirectCallback);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.get('/verify', authenticateToken, verifyToken);
router.post('/demo-access', authenticateToken, logDemoAccess);

export default router;
