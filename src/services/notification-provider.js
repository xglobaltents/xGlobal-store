import { Resend } from "resend";
import { MedusaError } from "medusa-core-utils";

class ResendNotificationService {
  static identifier = "resend";
  
  constructor({ resendOptions }, options) {
    this.options = options;
    this.resendOptions = resendOptions;
    
    // Initialize Resend client
    this.resendClient = new Resend(resendOptions.api_key);
    this.fromEmail = resendOptions.from_email;
  }
  
  // This is required for Medusa to recognize this as a notification provider
  getIdentifier() {
    return "resend";
  }
  
  // Specify the channels this provider can handle
  getChannels() {
    return ["email"];
  }
  
  async sendNotification(eventName, eventData, attachmentGenerator) {
    console.log(`[ResendNotificationService] Sending notification for event: ${eventName}`, eventData);
    
    // First, check if we should handle this event
    if (eventName === "invite" || eventName === "invite.created" || eventName === "invite.resent") {
      return this.handleInviteNotification(eventData);
    }

    // For other notifications
    return this.handleDefaultNotification(eventName, eventData, attachmentGenerator);
  }

  async handleInviteNotification(data) {
    console.log("[ResendNotificationService] Handling invite notification", data);
    const { to, data: eventData } = data;
    
    try {
      const { inviteToken, userEmail, displayName, inviteUrl } = eventData;
      const finalInviteUrl = inviteUrl || `${process.env.ADMIN_URL}/invite?token=${inviteToken}`;

      console.log(`[ResendNotificationService] Sending invite email to ${to} with URL: ${finalInviteUrl}`);

      const { data: emailData, error } = await this.resendClient.emails.send({
        from: this.fromEmail,
        to: to,
        subject: "You've been invited to join the team",
        html: `
          <div>
            <h1>You've been invited!</h1>
            <p>Hello ${displayName || userEmail},</p>
            <p>You've been invited to join the team. Click the link below to accept the invitation:</p>
            <p><a href="${finalInviteUrl}">Accept Invitation</a></p>
            <p>If you didn't request this invitation, please ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        console.error("[ResendNotificationService] Error sending invite email:", error);
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Error sending invite email: ${error.message}`);
      }

      console.log("[ResendNotificationService] Successfully sent invite email:", emailData);
      return { to, data: emailData, status: "sent" };
    } catch (error) {
      console.error("[ResendNotificationService] Failed to send invite email:", error);
      throw error;
    }
  }

  async handleDefaultNotification(eventName, data, attachmentGenerator) {
    console.log("[ResendNotificationService] Handling default notification for event:", eventName);
    const { to, subject, html, text } = data;

    try {
      const payload = {
        from: this.fromEmail,
        to,
        subject: subject || `Notification: ${eventName}`,
        html: html || text || `You have a new notification for event: ${eventName}`,
      };

      // If there are attachments, add them
      if (attachmentGenerator) {
        const attachments = await attachmentGenerator.createAttachments();
        if (attachments?.length) {
          payload.attachments = attachments;
        }
      }

      console.log("[ResendNotificationService] Sending email with payload:", payload);
      const { data: emailData, error } = await this.resendClient.emails.send(payload);

      if (error) {
        console.error("[ResendNotificationService] Error sending email:", error);
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Failed to send email: ${error.message}`);
      }

      console.log("[ResendNotificationService] Successfully sent email:", emailData);
      return { to, data: emailData, status: "sent" };
    } catch (error) {
      console.error("[ResendNotificationService] Error sending notification:", error);
      throw error;
    }
  }
}

export default ResendNotificationService;
