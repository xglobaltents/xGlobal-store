import { Resend } from "resend";
import { MedusaError } from "medusa-core-utils";

class ResendNotificationService {
  static identifier = "resend";
  
  constructor({ resendOptions }, options) {
    console.log("[ResendNotificationService] Initializing with options:", 
      { ...resendOptions, api_key: resendOptions.api_key ? "***MASKED***" : undefined });
      
    this.options = options;
    this.resendClient = new Resend(resendOptions.api_key);
    this.fromEmail = resendOptions.from_email;
    
    // Log initialization status
    console.log(`[ResendNotificationService] Initialized with from email: ${this.fromEmail}`);
  }
  
  getIdentifier() {
    return "resend";
  }
  
  getChannels() {
    console.log("[ResendNotificationService] getChannels called, returning ['email']");
    return ["email"];
  }
  
  canSendTo(deliveryType) {
    console.log(`[ResendNotificationService] canSendTo called with deliveryType: ${deliveryType}`);
    return deliveryType === "email";
  }
  
  validateOptions(options) {
    console.log("[ResendNotificationService] validateOptions called");
    return options;
  }
  
  async sendNotification(eventName, eventData, attachmentGenerator) {
    console.log(`[ResendNotificationService] sendNotification called for event: ${eventName}`);
    console.log("Event data:", JSON.stringify(eventData, null, 2));
    
    const { to, data } = eventData;
    
    try {
      const payload = {
        from: this.fromEmail,
        to,
        subject: "Notification from your store",
        html: `<p>You have a new notification for ${eventName}</p>`,
      };
      
      if (eventName === "invite" || eventName.includes("invite")) {
        const inviteUrl = data?.inviteUrl || `${process.env.ADMIN_URL}/invite?token=${data?.inviteToken}`;
        const displayName = data?.displayName || data?.userEmail?.split('@')[0] || "there";
        
        payload.subject = "You've been invited to join the team";
        payload.html = `
          <div>
            <h1>You've been invited!</h1>
            <p>Hello ${displayName},</p>
            <p>You've been invited to join the team. Click the link below to accept the invitation:</p>
            <p><a href="${inviteUrl}">Accept Invitation</a></p>
            <p>If you didn't request this invitation, please ignore this email.</p>
          </div>
        `;
      }
      
      console.log(`[ResendNotificationService] Sending email to ${to} with subject: ${payload.subject}`);
      
      const { data: emailData, error } = await this.resendClient.emails.send(payload);
      
      if (error) {
        console.error("[ResendNotificationService] Error sending email:", error);
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Failed to send email: ${error.message}`);
      }
      
      console.log("[ResendNotificationService] Email sent successfully:", emailData);
      return { to, data: emailData, status: "sent" };
    } catch (error) {
      console.error("[ResendNotificationService] Error in sendNotification:", error);
      throw error;
    }
  }
}

export default ResendNotificationService;
