#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this script to create all necessary tables in PostgreSQL
 *
 * Usage:
 *   node server/scripts/init-db.js
 *
 * Make sure DATABASE_URL is set in your environment or .env file
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('Starting database initialization...\n');

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    console.log('\nPlease set DATABASE_URL in your .env file or environment:');
    console.log('DATABASE_URL=postgresql://user:password@host:port/database');
    process.exit(1);
  }

  // Parse DATABASE_URL to check if it requires SSL
  const requiresSSL = process.env.DATABASE_URL?.includes('sslmode=require');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: requiresSSL ? { rejectUnauthorized: false } : false,
  });

  try {
    // Test connection
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Connected successfully!\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute SQL
    console.log('Executing initialization script...\n');
    await client.query(sql);

    // Verify tables were created
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n========================================');
    console.log('Database initialization complete!');
    console.log('========================================\n');
    console.log('Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    console.log('');

    client.release();
    await pool.end();

    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('\nERROR during database initialization:');
    console.error(error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\nCould not connect to database. Please check:');
      console.log('1. Database server is running');
      console.log('2. DATABASE_URL is correct');
      console.log('3. Network/firewall allows connection');
    }

    await pool.end();
    process.exit(1);
  }
}

initDatabase();
