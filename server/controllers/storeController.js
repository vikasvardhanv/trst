import crypto from 'node:crypto';
import { query } from '../config/database.js';

// Generate a secure random token
const generateDownloadToken = () => crypto.randomBytes(32).toString('hex');

// Token validity duration (5 minutes)
const TOKEN_VALIDITY_MS = 5 * 60 * 1000;

export const listStoreCategories = async (req, res) => {
  try {
    const result = await query(
      `SELECT
          category_slug AS slug,
          category_title AS title,
          COUNT(*)::int AS count
        FROM store_workflows
        WHERE is_active = TRUE
        GROUP BY category_slug, category_title
        ORDER BY category_title ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load store categories',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const getStoreCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    if (!categorySlug) {
      return res.status(400).json({ success: false, message: 'categorySlug is required' });
    }

    const result = await query(
      `SELECT
          category_slug,
          category_title,
          workflow_slug,
          name,
          file_name,
          description,
          integrations,
          price_cents,
          currency
        FROM store_workflows
        WHERE is_active = TRUE AND category_slug = $1
        ORDER BY name ASC`,
      [categorySlug]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const categoryTitle = result.rows[0].category_title;
    const workflows = result.rows.map((row) => ({
      categorySlug: row.category_slug,
      categoryTitle: row.category_title,
      workflowSlug: row.workflow_slug,
      name: row.name,
      fileName: row.file_name,
      description: row.description || '',
      integrations: Array.isArray(row.integrations) ? row.integrations : [],
      priceCents: row.price_cents,
      currency: row.currency,
    }));

    res.json({
      success: true,
      data: {
        slug: categorySlug,
        title: categoryTitle,
        count: workflows.length,
        workflows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load store category',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const getStoreWorkflow = async (req, res) => {
  try {
    const { categorySlug, workflowFile } = req.params;
    if (!categorySlug || !workflowFile) {
      return res.status(400).json({
        success: false,
        message: 'categorySlug and workflowFile are required',
      });
    }

    const fileName = decodeURIComponent(workflowFile);

    const result = await query(
      `SELECT
          id,
          category_slug,
          category_title,
          workflow_slug,
          name,
          file_name,
          description,
          integrations,
          price_cents,
          currency,
          workflow_json IS NOT NULL AS has_json
        FROM store_workflows
        WHERE is_active = TRUE AND category_slug = $1 AND file_name = $2
        LIMIT 1`,
      [categorySlug, fileName]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found',
      });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        category: {
          slug: row.category_slug,
          title: row.category_title,
        },
        workflow: {
          id: row.id,
          categorySlug: row.category_slug,
          categoryTitle: row.category_title,
          workflowSlug: row.workflow_slug,
          name: row.name,
          fileName: row.file_name,
          description: row.description || '',
          integrations: Array.isArray(row.integrations) ? row.integrations : [],
          priceCents: row.price_cents,
          currency: row.currency,
          hasJson: row.has_json,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load store workflow',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

// Request a secure download token (requires auth)
export const requestDownloadToken = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!workflowId) {
      return res.status(400).json({ success: false, message: 'workflowId is required' });
    }

    // Verify workflow exists and has JSON content
    const wfResult = await query(
      `SELECT id, name, workflow_json IS NOT NULL AS has_json FROM store_workflows WHERE id = $1 AND is_active = TRUE LIMIT 1`,
      [workflowId]
    );

    if (!wfResult.rows.length) {
      return res.status(404).json({ success: false, message: 'Workflow not found' });
    }

    if (!wfResult.rows[0].has_json) {
      return res.status(404).json({ success: false, message: 'Workflow file not available' });
    }

    // Generate token
    const token = generateDownloadToken();
    const expiresAt = new Date(Date.now() + TOKEN_VALIDITY_MS);

    await query(
      `INSERT INTO store_download_tokens (user_id, workflow_id, token, expires_at) VALUES ($1, $2, $3, $4)`,
      [userId, workflowId, token, expiresAt]
    );

    res.json({
      success: true,
      data: {
        token,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate download token',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

// Download workflow JSON using a secure token (no direct URL guessing)
export const downloadWorkflow = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Download token required' });
    }

    // Look up token
    const tokenResult = await query(
      `SELECT dt.id AS token_id, dt.workflow_id, dt.expires_at, dt.used_at, sw.name, sw.file_name, sw.workflow_json
       FROM store_download_tokens dt
       JOIN store_workflows sw ON sw.id = dt.workflow_id
       WHERE dt.token = $1
       LIMIT 1`,
      [token]
    );

    if (!tokenResult.rows.length) {
      return res.status(404).json({ success: false, message: 'Invalid or expired download token' });
    }

    const row = tokenResult.rows[0];

    // Check expiration
    if (new Date(row.expires_at) < new Date()) {
      return res.status(410).json({ success: false, message: 'Download token has expired' });
    }

    // Mark token as used (one-time use)
    if (row.used_at) {
      return res.status(410).json({ success: false, message: 'Download token already used' });
    }

    await query(`UPDATE store_download_tokens SET used_at = NOW() WHERE id = $1`, [row.token_id]);

    // Return JSON file as download
    const jsonContent = row.workflow_json;
    if (!jsonContent) {
      return res.status(404).json({ success: false, message: 'Workflow file not available' });
    }

    const safeFileName = row.file_name.replace(/[^a-zA-Z0-9_\-.]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jsonContent, null, 2));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Download failed',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};
