import { Resend } from "resend";
import dotenv from "dotenv";

// Load environment variables directly in the subscriber
dotenv.config();

/**
 * Handle invite created events by sending emails directly with Resend
 */
export default async function inviteSubscriber({ data, eventName, container }) {
  try {
    console.log(`[inviteSubscriber] Received ${eventName} event for ${data.user_email}`);
    
    // Get API key and from email directly from environment
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    
    if (!apiKey) {
      console.error("[inviteSubscriber] Missing RESEND_API_KEY in environment");
      return;
    }
    
    if (!fromEmail) {
      console.error("[inviteSubscriber] Missing RESEND_FROM_EMAIL in environment");
      return;
    }
    
    // Get domain from environment
    const domain = process.env.ADMIN_URL || "https://dashboard.xglobal-tents.app";
    const inviteUrl = `${domain}/invite?token=${data.token}`;
    const displayName = data.user_email.split('@')[0] || "there";
    
    console.log(`[inviteSubscriber] Sending invite directly to ${data.user_email} with URL: ${inviteUrl}`);
    
    // Initialize Resend directly
    const resend = new Resend(apiKey);
    
    // Send the email directly with Resend
    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: data.user_email,
      subject: "You've been invited to join the team",
      html: `
        <div>
          <h1>You've been invited!</h1>
          <p>Hello ${displayName},</p>
          <p>You've been invited to join the team. Click the link below to accept the invitation:</p>
          <p><a href="${inviteUrl}">Accept Invitation</a></p>
          <p>If you didn't request this invitation, please ignore this email.</p>
        </div>
      `,
    });
    
    if (error) {
      console.error("[inviteSubscriber] Error sending invite email:", error);
    } else {
      console.log(`[inviteSubscriber] Successfully sent invitation email to ${data.user_email}`, emailData);
    }
  } catch (error) {
    console.error("[inviteSubscriber] Error handling invite event:", error.message);
    console.error(error.stack);
    // Don't throw errors - let the flow continue
  }
}

// Register for both create and resend events
inviteSubscriber.events = ["invite.created", "invite.resent"];
