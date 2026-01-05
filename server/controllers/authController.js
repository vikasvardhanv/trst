import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { query } from '../config/database.js';
import logger from '../utils/logger.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const TOKEN_KEY = 'highshift_auth_token';
const USER_KEY = 'highshift_user';

const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

const getCookieValue = (cookieHeader, name) => {
  if (!cookieHeader) return null;
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.split('=').slice(1).join('='));
};

const sanitizeRedirectPath = (state) => {
  if (typeof state !== 'string') return '/';
  if (!state.startsWith('/') || state.startsWith('//')) return '/';
  return state;
};

const buildRedirectUrl = (req, state) => {
  const redirectPath = sanitizeRedirectPath(state);
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  try {
    return new URL(redirectPath, baseUrl).toString();
  } catch (error) {
    return new URL('/', baseUrl).toString();
  }
};

const sendOAuthRedirectPage = (res, token, user, redirectUrl) => {
  const payload = JSON.stringify({ token, user, redirectUrl });
  res
    .status(200)
    .type('html')
    .send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Signing you in...</title>
    <style>
      body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
      .card { text-align: center; max-width: 420px; padding: 24px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Signing you in...</h1>
      <p>You will be redirected automatically.</p>
    </div>
    <script>
      (function () {
        var data = ${payload};
        try {
          localStorage.setItem(${JSON.stringify(TOKEN_KEY)}, data.token);
          localStorage.setItem(${JSON.stringify(USER_KEY)}, JSON.stringify(data.user));
        } catch (error) {}
        window.location.replace(data.redirectUrl);
      })();
    </script>
  </body>
</html>`);
};

// OAuth login/signup - creates or finds user by email
export const oauthLogin = async (req, res) => {
  try {
    const { email, fullName, provider, providerId } = req.body;

    if (!email || !provider) {
      return res.status(400).json({
        success: false,
        message: 'Email and provider are required'
      });
    }

    // Check if user exists
    let user = await User.findByEmail(email);

    if (user) {
      // Update last login
      await User.updateLastLogin(user.id);
    } else {
      // Create new user with OAuth
      user = await User.createOAuthUser({ email, fullName, provider, providerId });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          company: user.company,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    logger.auth('OAuth login failed', false, {
      email: req.body?.email,
      provider: req.body?.provider,
      error: error.message,
      code: error.code,
    });
    res.status(500).json({
      success: false,
      message: 'An error occurred during OAuth login'
    });
  }
};

// Google OAuth redirect handler (Sign in with Google redirect mode)
export const googleRedirectCallback = async (req, res) => {
  try {
    const { credential, g_csrf_token: csrfToken, state } = req.body || {};
    if (!credential) {
      return res.status(400).send('Missing Google credential.');
    }

    const csrfCookie = getCookieValue(req.headers.cookie, 'g_csrf_token');
    if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
      logger.auth('Google OAuth CSRF check failed', false, { hasCookie: !!csrfCookie });
      return res.status(403).send('Invalid CSRF token.');
    }

    const clientId = getGoogleClientId();
    if (!clientId) {
      logger.auth('Google OAuth client ID missing', false);
      return res.status(500).send('Google Sign-In is not configured.');
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).send('Google Sign-In did not return an email.');
    }
    if (!payload?.sub) {
      return res.status(400).send('Google Sign-In did not return a user ID.');
    }
    if (payload.email_verified === false) {
      return res.status(400).send('Google email is not verified.');
    }

    let user = await User.findByEmail(payload.email);
    if (user) {
      await User.updateLastLogin(user.id);
    } else {
      user = await User.createOAuthUser({
        email: payload.email,
        fullName: payload.name,
        provider: 'google',
        providerId: payload.sub
      });
    }

    const token = generateToken(user.id);
    const authUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      company: user.company,
      role: user.role
    };
    const redirectUrl = buildRedirectUrl(req, state);

    logger.auth('Google OAuth redirect login', true, { email: user.email });
    return sendOAuthRedirectPage(res, token, authUser, redirectUrl);
  } catch (error) {
    logger.auth('Google OAuth redirect failed', false, {
      error: error.message,
      code: error.code,
    });
    return res.status(500).send('Google Sign-In failed.');
  }
};

// Signup
export const signup = async (req, res) => {
  try {
    const { email, password, fullName, company, phone } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if email exists
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({ email, password, fullName, company, phone });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          company: user.company,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    logger.auth('Signup failed', false, {
      email: req.body?.email,
      error: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack?.split('\n').slice(0, 3).join(' | '),
    });
    res.status(500).json({
      success: false,
      message: 'An error occurred during signup',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          company: user.company,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    logger.auth('Login failed', false, {
      email: req.body?.email,
      error: error.message,
      code: error.code,
    });
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          fullName: req.user.full_name,
          company: req.user.company,
          phone: req.user.phone,
          role: req.user.role,
          createdAt: req.user.created_at,
          lastLogin: req.user.last_login
        }
      }
    });
  } catch (error) {
    logger.error('Get user error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'An error occurred'
    });
  }
};

// Log demo access
export const logDemoAccess = async (req, res) => {
  try {
    const { demoId, demoName } = req.body;
    const userId = req.user.id;

    await query(
      `INSERT INTO demo_access_log (user_id, demo_id, demo_name)
       VALUES ($1, $2, $3)`,
      [userId, demoId, demoName]
    );

    res.json({
      success: true,
      message: 'Demo access logged'
    });
  } catch (error) {
    logger.error('Log demo access error', {
      userId: req.user?.id,
      demoId: req.body?.demoId,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to log demo access'
    });
  }
};

// Verify token (for frontend to check if token is still valid)
export const verifyToken = async (req, res) => {
  // If we get here, the token is valid (middleware already verified)
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.full_name,
        company: req.user.company,
        role: req.user.role
      }
    }
  });
};
