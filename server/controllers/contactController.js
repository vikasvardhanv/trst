import { query } from '../config/database.js';

// Submit contact form
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Save to database (leads table)
    const result = await query(
      `INSERT INTO leads (name, email, company, service_interest, message, source, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, created_at`,
      [name, email, company || null, service || 'general', message, 'contact_form', 'new']
    );

    const lead = result.rows[0];

    // TODO: Send email notification
    // For now, we'll log it. You can add email service later (SendGrid, AWS SES, etc.)
    console.log('📧 New contact form submission:');
    console.log({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: company || 'N/A',
      service: service || 'N/A',
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      timestamp: lead.created_at
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      data: {
        id: lead.id,
        submittedAt: lead.created_at
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });

    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your message. Please try again or email us directly.',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};
