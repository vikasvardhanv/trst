import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const User = {
  // Create a new user with email/password
  async create({ email, password, fullName, company, phone }) {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, company, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, company, phone, role, created_at`,
      [email.toLowerCase(), passwordHash, fullName, company, phone]
    );

    return result.rows[0];
  },

  // Create a new user via OAuth (no password required)
  async createOAuthUser({ email, fullName, provider, providerId }) {
    // Generate a random password hash for OAuth users (they won't use it)
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, auth_provider, auth_provider_id, email_verified)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, email, full_name, company, phone, role, created_at`,
      [email.toLowerCase(), passwordHash, fullName || email.split('@')[0], provider, providerId]
    );

    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const result = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const result = await query(
      `SELECT id, email, full_name, company, phone, role, created_at, last_login
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Update last login
  async updateLastLogin(id) {
    await query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
  },

  // Check if email exists
  async emailExists(email) {
    const result = await query(
      `SELECT id FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows.length > 0;
  },

  // Update user profile
  async updateProfile(id, { fullName, company, phone }) {
    const result = await query(
      `UPDATE users
       SET full_name = COALESCE($2, full_name),
           company = COALESCE($3, company),
           phone = COALESCE($4, phone)
       WHERE id = $1
       RETURNING id, email, full_name, company, phone, role`,
      [id, fullName, company, phone]
    );
    return result.rows[0];
  }
};

export default User;
