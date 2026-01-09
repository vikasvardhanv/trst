import { query } from '../config/database.js';
import { sendContactNotificationEmail } from '../utils/email.js';

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

    let emailSent = false;
    let emailProvider = null;
    let emailErrorMessage = null;

    try {
      const emailResult = await sendContactNotificationEmail({
        leadId: lead.id,
        name,
        email,
        company,
        service,
        message,
      });
      emailSent = true;
      emailProvider = emailResult?.provider || null;
    } catch (emailError) {
      emailErrorMessage = emailError?.message || String(emailError);
      console.error('Failed to send contact notification email:', emailError);
    }

    // Send success response
    res.status(201).json({
      success: true,
      message: emailSent
        ? 'Thank you for contacting us! We\'ll get back to you within 24 hours.'
        : 'Thank you! Your message was received, but notifications are not fully configured yet. Please email us directly at info@highshiftmedia.com if this is urgent.',
      data: {
        id: lead.id,
        submittedAt: lead.created_at,
        emailSent,
        emailProvider,
        ...(process.env.NODE_ENV !== 'production' && emailErrorMessage
          ? { emailError: emailErrorMessage }
          : {}),
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
