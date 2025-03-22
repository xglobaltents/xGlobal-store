import { Resend } from "resend";
import { NotificationService } from "@medusajs/medusa";

class ResendNotificationService extends NotificationService {
  static identifier = "resend";
  
  constructor({ resendOptions }, options) {
    super();
    
    this.options = options;
    this.resendClient = new Resend(resendOptions.api_key);
    this.fromEmail = resendOptions.from_email;
  }

  getIdentifier() {
    return ResendNotificationService.identifier;
  }

  getChannels() {
    return ["email"];
  }

  async sendNotification(event, data) {
    const { to, data: eventData } = data;
    
    try {
      const payload = {
        from: this.fromEmail,
        to,
        subject: "You've been invited to join the team",
        html: `
          <div>
            <h1>You've been invited!</h1>
            <p>Hello ${eventData.displayName || eventData.userEmail},</p>
            <p>You've been invited to join the team. Click the link below to accept the invitation:</p>
            <p><a href="${eventData.inviteUrl}">Accept Invitation</a></p>
          </div>
        `
      };

      const { data: emailData } = await this.resendClient.emails.send(payload);
      return { to, data: emailData, status: "sent" };
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

export default ResendNotificationService;
