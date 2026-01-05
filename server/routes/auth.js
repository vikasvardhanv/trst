import express from 'express';
import { signup, login, getCurrentUser, logDemoAccess, verifyToken, oauthLogin, googleRedirectCallback, googleAuthRedirect, googleAuthCallback } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/oauth', oauthLogin);  // Google/Apple OAuth (client-side flow)
router.post('/google/callback', googleRedirectCallback); // Legacy redirect mode

// Google OAuth 2.0 Authorization Code Flow (server-side)
router.get('/google', googleAuthRedirect);          // Step 1: Redirect to Google
router.get('/google/callback', googleAuthCallback); // Step 2: Handle callback with code

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.get('/verify', authenticateToken, verifyToken);
router.post('/demo-access', authenticateToken, logDemoAccess);

export default router;
