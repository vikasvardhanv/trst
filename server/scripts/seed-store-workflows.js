import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

const { Pool } = pg;

const normalizeSlug = (text) =>
  String(text || '')
    .trim()
    .toLowerCase()
    .replace(/^#/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');

const parseCount = (text) => {
  const match = String(text || '').match(/\((\d+)\s+workflows\)/i);
  if (!match) return undefined;
  const num = Number(match[1]);
  return Number.isFinite(num) ? num : undefined;
};

const parseCategoryIndex = (lines) => {
  const categories = [];
  let inCategoryIndex = false;

  for (const line of lines) {
    if (line.trim() === '## Categories') {
      inCategoryIndex = true;
      continue;
    }

    if (!inCategoryIndex) continue;

    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('---')) break;

    const match = trimmed.match(/^\-\s+\[(.+?)\]\(#(.+?)\)\s*(.*)$/);
    if (!match) continue;

    const title = match[1].trim();
    const slug = normalizeSlug(match[2]);
    const count = parseCount(match[3] || '');
    categories.push({ title, slug, count });
  }

  return categories;
};

const parseWorkflowsByCategory = (lines, categoriesFromIndex) => {
  const workflowsByCategory = new Map();

  let currentCategoryTitle = null;
  let currentCategorySlug = null;

  const findSlugForHeading = (heading) => {
    const existing = categoriesFromIndex.find((c) => c.title === heading);
    if (existing) return existing.slug;
    return normalizeSlug(heading);
  };

  const linkRegex = /\[([^\]]+)\]\(([^)]+?\.json)\)/g;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      if (heading.toLowerCase() === 'categories') continue;

      currentCategoryTitle = heading;
      currentCategorySlug = findSlugForHeading(heading);
      if (!workflowsByCategory.has(currentCategorySlug)) workflowsByCategory.set(currentCategorySlug, new Map());
      continue;
    }

    if (!currentCategorySlug || !currentCategoryTitle) continue;

    // Extract any markdown links to .json inside this category section.
    // This is more resilient than relying on well-formed markdown tables.
    linkRegex.lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      const name = match[1].trim();
      const fileName = match[2].trim();
      const workflowSlug = normalizeSlug(fileName.replace(/\.json$/i, '')) || normalizeSlug(name);

      // Best-effort: if the link is inside a table row, try to read description/integrations from cells.
      let description = '';
      let integrations = [];

      if (line.trimStart().startsWith('|')) {
        const cells = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());

        const linkCellIndex = cells.findIndex((c) => c.includes(`[${name}](${fileName})`));
        if (linkCellIndex >= 0) {
          description = (cells[linkCellIndex + 1] || '').trim();
          const integrationCell = (cells[linkCellIndex + 2] || '').trim();
          integrations = integrationCell
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
        }
      }

      const bucket = workflowsByCategory.get(currentCategorySlug);
      if (!bucket.has(fileName)) {
        bucket.set(fileName, {
          categorySlug: currentCategorySlug,
          categoryTitle: currentCategoryTitle,
          workflowSlug,
          name,
          fileName,
          description,
          integrations,
        });
      }
    }
  }

  // Convert maps to arrays
  const result = new Map();
  for (const [categorySlug, map] of workflowsByCategory.entries()) {
    result.set(categorySlug, Array.from(map.values()));
  }
  return result;
};

const getRepoRoot = () => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  // server/scripts -> repo root
  return path.resolve(dirname, '..', '..');
};

const main = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to seed store workflows');
  }

  const repoRoot = getRepoRoot();
  const readmePath =
    process.env.STORE_README_PATH ||
    process.argv[2] ||
    path.join(repoRoot, 'server', 'data', 'store-catalog.md');
  const markdown = await fs.readFile(readmePath, 'utf8');
  const lines = markdown.split(/\r?\n/);

  const categories = parseCategoryIndex(lines);
  const workflowsByCategory = parseWorkflowsByCategory(lines, categories);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  });

  let inserted = 0;
  let updated = 0;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const workflows of workflowsByCategory.values()) {
      for (const w of workflows) {
        const res = await client.query(
          `INSERT INTO store_workflows (
              category_slug,
              category_title,
              workflow_slug,
              name,
              file_name,
              description,
              integrations,
              price_cents,
              currency,
              is_active
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            ON CONFLICT (file_name)
            DO UPDATE SET
              category_slug = EXCLUDED.category_slug,
              category_title = EXCLUDED.category_title,
              workflow_slug = EXCLUDED.workflow_slug,
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              integrations = EXCLUDED.integrations,
              price_cents = EXCLUDED.price_cents,
              currency = EXCLUDED.currency,
              is_active = EXCLUDED.is_active
            RETURNING (xmax = 0) AS inserted;`,
          [
            w.categorySlug,
            w.categoryTitle,
            w.workflowSlug,
            w.name,
            w.fileName,
            w.description || null,
            w.integrations || [],
            3900,
            'USD',
            true,
          ]
        );

        if (res.rows?.[0]?.inserted) inserted += 1;
        else updated += 1;
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }

  // eslint-disable-next-line no-console
  console.log(`Seed complete: inserted=${inserted} updated=${updated}`);
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', err?.message || err);
  process.exit(1);
});
