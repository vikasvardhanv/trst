import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const getRepoRoot = () => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  return path.resolve(dirname, '..', '..');
};

const main = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const jsonDir = process.argv[2] || path.join(getRepoRoot(), 'n8n');

  console.log(`Reading JSON files from: ${jsonDir}`);

  const files = await fs.readdir(jsonDir);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  console.log(`Found ${jsonFiles.length} JSON files`);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  });

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  const client = await pool.connect();

  try {
    for (const fileName of jsonFiles) {
      const filePath = path.join(jsonDir, fileName);

      try {
        const content = await fs.readFile(filePath, 'utf8');
        const json = JSON.parse(content);

        // Update workflow_json where file_name matches
        const result = await client.query(
          `UPDATE store_workflows SET workflow_json = $1 WHERE file_name = $2`,
          [json, fileName]
        );

        if (result.rowCount > 0) {
          updated += 1;
        } else {
          notFound += 1;
          // Try to find a close match (catalog might have slightly different names)
          // Log for manual review
          if (notFound <= 20) {
            console.log(`  Not found in DB: ${fileName}`);
          }
        }
      } catch (err) {
        errors += 1;
        console.error(`  Error processing ${fileName}:`, err.message);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }

  console.log(`\nImport complete:`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Not found in DB: ${notFound}`);
  console.log(`  Errors: ${errors}`);

  if (notFound > 20) {
    console.log(`  (only first 20 "not found" shown)`);
  }
};

main().catch((err) => {
  console.error('Import failed:', err.message || err);
  process.exit(1);
});
