import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { query } from '../config/database.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
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
    console.error('OAuth login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during OAuth login'
    });
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
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during signup'
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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
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
    console.error('Get user error:', error);
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
    console.error('Log demo access error:', error);
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
