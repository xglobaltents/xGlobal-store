// Dynamic import to avoid issues during build time
import { Resend } from 'resend';

// Initialize only when actually sending emails to avoid initialization errors
let resend = null;

/**
 * Send an email using Resend with error handling
 * @param {Object} options - Email options
 * @returns {Promise} - Result of the email sending attempt
 */
export const sendEmail = async ({ to, subject, html, from = 'onboarding@resend.dev' }) => {
  // Don't attempt to send emails if API key is missing
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Email sending is disabled.');
    return { success: false, error: 'API key not configured' };
  }
  
  try {
    // Initialize Resend only when needed
    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }
    
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred while sending email' 
    };
  }
};
