import { AbstractNotificationService } from "@medusajs/medusa"
import { Resend } from "resend"

class ResendService extends AbstractNotificationService {
  static identifier = "resend"
  
  constructor({ resendOptions }, options) {
    super(options)
    
    this.options_ = resendOptions
    
    this.resend_ = new Resend(resendOptions.api_key)
  }
  
  async sendNotification(
    event,
    data,
    attachmentGenerator
  ) {
    if (event === "invite.created") {
      return await this.sendInviteNotification(data)
    }
    
    return
  }
  
  async sendInviteNotification(data) {
    const { user_email, token, user } = data
    
    const adminUrl = process.env.MEDUSA_ADMIN_URL || 
                     process.env.ADMIN_CORS || 
                     "https://dashboard.xglobal-tents.app"
    const inviteLink = `${adminUrl}/invite?token=${token}`
    
    try {
      const result = await this.resend_.emails.send({
        from: this.options_.from_email || "onboarding@resend.dev",
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
      
      return result
    } catch (error) {
      console.error("Error sending invite email via Resend:", error)
      throw error
    }
  }
}

export default ResendService
