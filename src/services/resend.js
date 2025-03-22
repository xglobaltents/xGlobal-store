import { AbstractNotificationService } from "@medusajs/medusa"
import { Resend } from "resend"

class ResendService extends AbstractNotificationService {
  static identifier = "resend"
  
  // Ensure proper installation check
  static isInstalled() {
    return true
  }

  constructor({ resendOptions }, options) {
    // Use proper Medusa 2.4.0 constructor
    super({
      ...(options || {}),
      channelIdentifier: "email",
    })
    
    // Store options safely
    this.options_ = resendOptions || {}
    
    // Safe API key handling
    const apiKey = (resendOptions && resendOptions.api_key) || process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("Resend API key is missing - emails will fail to send")
    }
    
    try {
      // Initialize Resend safely
      this.resend_ = new Resend(apiKey || "")
    } catch (error) {
      console.error("Failed to initialize Resend:", error)
      // Create a dummy implementation to avoid errors
      this.resend_ = {
        emails: {
          send: async () => {
            throw new Error("Resend was not initialized properly")
          }
        }
      }
    }
  }
  
  async sendNotification(event, data, attachmentGenerator) {
    // Log incoming events for debugging
    console.log(`[ResendService] Handling event: ${event}`)
    
    try {
      if (event === "invite.created") {
        return await this.sendInviteNotification(data)
      }
      
      // Log unsupported events
      console.log(`[ResendService] Ignoring unsupported event type: ${event}`)
      return { status: "not_handled", message: `Event ${event} not supported` }
    } catch (error) {
      console.error(`[ResendService] Error processing event ${event}:`, error)
      return { status: "error", message: error.message }
    }
  }
  
  async sendInviteNotification(data) {
    if (!data) {
      console.error("[ResendService] Missing data for invite notification")
      return { status: "error", message: "Missing data" }
    }
    
    const { user_email, token } = data
    
    if (!user_email || !token) {
      console.error("[ResendService] Missing required fields for invite email")
      return { status: "error", message: "Missing required fields" }
    }
    
    // Use reliable fallbacks for URL
    const adminUrl = process.env.MEDUSA_ADMIN_URL || 
                     process.env.ADMIN_CORS || 
                     "https://dashboard.xglobal-tents.app"
    const inviteLink = `${adminUrl}/invite?token=${token}`
    
    try {
      console.log(`[ResendService] Sending invite email to ${user_email}`)
      
      // Safe email sender handling
      const fromEmail = (this.options_ && this.options_.from_email) || 
                        process.env.RESEND_FROM_EMAIL || 
                        "onboarding@resend.dev"
      
      const result = await this.resend_.emails.send({
        from: fromEmail,
        to: user_email,
        subject: "You've been invited to the XGlobal Store admin",
        html: `
          <div>
            <h1>You've been invited!</h1>
            <p>You've been invited to the XGlobal Store admin panel. Use the link below to accept the invitation:</p>
            <p><a href="${inviteLink}">Accept Invitation</a></p>
            <p>The link will expire in 7 days.</p>
          </div>
        `,
      })
      
      console.log("[ResendService] Email sent successfully:", result?.id)
      return { to: user_email, status: "sent", data: result }
    } catch (error) {
      console.error("[ResendService] Error sending invite email:", error)
      // Return error without throwing to prevent deployment crashes
      return { status: "error", message: error.message }
    }
  }
}

export default ResendService
