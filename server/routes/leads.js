import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// Modal API endpoints
const SCRAPER_API = 'https://vikasvardhanv--gmaps-lead-scraper-fastapi-app.modal.run';
const EMAIL_API = 'https://vikasvardhanv--lead-gen-email-sender-fastapi-app.modal.run';

// Proxy endpoint for lead scraping
router.post('/scrape', async (req, res) => {
  try {
    const { query, location, radius = 5000, limit = 20 } = req.body;

    if (!query || !location) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query and location are required' 
      });
    }

    logger.info(`Lead scraping request: ${query} in ${location}`);

    const response = await fetch(`${SCRAPER_API}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        location: location.trim(),
        radius,
        limit,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Scraper API error: ${response.status} - ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    logger.info(`Scraper returned ${data.leads?.length || 0} leads`);
    
    res.json({
      success: true,
      leads: data.leads || [],
      sheet_url: data.sheet_url || null,
      count: data.leads?.length || 0,
    });

  } catch (error) {
    logger.error(`Lead scraping error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to scrape leads' 
    });
  }
});

// Proxy endpoint for sending emails
router.post('/send-emails', async (req, res) => {
  try {
    const { sheet_url, doc_template_url, sender_name, sender_email } = req.body;

    if (!sheet_url || !doc_template_url || !sender_name || !sender_email) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    logger.info(`Email campaign request from ${sender_email}`);

    const response = await fetch(`${EMAIL_API}/send-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheet_url,
        doc_template_url,
        sender_name,
        sender_email,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Email API error: ${response.status} - ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    logger.info(`Email campaign submitted successfully`);
    
    res.json({
      success: true,
      message: data.message || 'Emails queued successfully',
    });

  } catch (error) {
    logger.error(`Email sending error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send emails' 
    });
  }
});

export default router;
