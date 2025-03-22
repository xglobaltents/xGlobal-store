import { Resend } from "resend";
import { BaseService } from "medusa-interfaces";
import { MedusaError } from "medusa-core-utils";

class ResendNotificationService extends BaseService {
  constructor({ resendOptions }, options) {
    super();
    
    this.options = options;
    this.resendOptions = resendOptions;
    this.resendClient = new Resend(resendOptions.api_key);
    this.fromEmail = resendOptions.from_email;
  }

  async sendNotification(eventName, eventData, attachmentGenerator) {
    // First, check if we should handle this event
    if (eventName === "invite") {
      return this.handleInviteNotification(eventData);
    }

    // For other notifications
    return this.handleDefaultNotification(eventName, eventData, attachmentGenerator);
  }

  async handleInviteNotification(data) {
    const { to, data: eventData } = data;
    
    try {
      const { inviteUrl, userEmail, displayName } = eventData;

      const { data: emailData, error } = await this.resendClient.emails.send({
        from: this.fromEmail,
        to: to,
        subject: "You've been invited to join the team",
        html: `
          <div>
            <h1>You've been invited!</h1>
            <p>Hello ${displayName || userEmail},</p>
            <p>You've been invited to join the team. Click the link below to accept the invitation:</p>
            <p><a href="${inviteUrl}">Accept Invitation</a></p>
            <p>If you didn't request this invitation, please ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Error sending invite email: ${error.message}`);
      }

      return { to, data: emailData };
    } catch (error) {
      console.error("Failed to send invite email:", error);
      throw error;
    }
  }

  async handleDefaultNotification(eventName, data, attachmentGenerator) {
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

      const { data: emailData, error } = await this.resendClient.emails.send(payload);

      if (error) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Failed to send email: ${error.message}`);
      }

      return { to, data: emailData };
    } catch (error) {
      console.error("Error sending notification with Resend:", error);
      throw error;
    }
  }
}

export default ResendNotificationService;
