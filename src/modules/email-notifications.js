import { Resend } from "resend";

class ResendNotificationService {
  constructor(container, options) {
    this.resendClient = new Resend(options.api_key);
    this.from = options.from;
    this.options = options;
  }

  async sendNotification(event, data, attachmentGenerator) {
    const { to, subject, html, text } = data;

    try {
      const payload = {
        from: this.from,
        to,
        subject,
        html: html || text,
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
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return emailData;
    } catch (error) {
      console.error("Error sending notification with Resend:", error);
      throw error;
    }
  }
}

export default ResendNotificationService;
