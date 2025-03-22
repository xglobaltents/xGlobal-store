import { NotificationService } from "@medusajs/medusa"
import { Resend } from "resend"
import { render } from "@react-email/render"
import { InviteEmail } from "./templates/invite-email"

class ResendProvider extends NotificationService {
  static identifier = "resend"

  constructor(container, options) {
    super(container)
    
    this.options_ = options
    
    // Initialize Resend client with API key
    this.resendClient_ = new Resend(options.api_key)
    this.fromEmail_ = options.from
    this.adminUrl_ = options.admin_url || "http://localhost:7001"
  }

  async sendNotification(event, data, attachmentGenerator) {
    if (event === "invite.created" || event === "invite.resent") {
      return await this.sendInvite(data)
    }
    
    // Handle other notification types here
    return
  }

  async sendInvite(data) {
    try {
      const to = data.to || data.user_email || data.email
      const token = data.data?.token || data.token
      const displayName = data.data?.display_name || data.display_name || to
      
      if (!to || !token) {
        throw new Error("Missing required data for sending invite email")
      }
      
      // Generate invite URL
      const inviteUrl = `${this.adminUrl_}/invite?token=${token}`
      
      // Render email using React template
      const emailHtml = render(
        InviteEmail({
          inviteUrl,
          userEmail: to,
          displayName: displayName
        })
      )
      
      // Send email via Resend
      const { data: responseData, error } = await this.resendClient_.emails.send({
        from: this.fromEmail_,
        to: to,
        subject: "You've been invited to join the team",
        html: emailHtml,
      })
      
      if (error) {
        throw new Error(`Resend API error: ${error.message}`)
      }
      
      return responseData
    } catch (error) {
      console.error("Failed to send invite email:", error)
      throw error
    }
  }

  async resendNotification(notification, config, attachmentGenerator) {
    return await this.sendNotification(
      notification.event_name,
      {
        ...notification.data,
        ...config,
      },
      attachmentGenerator
    )
  }
}

export default ResendProvider
