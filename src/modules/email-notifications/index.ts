import { NotificationProviderProps, NotificationModule } from "@medusajs/medusa"
import { Resend } from "resend"
import { EmailTemplatesService } from "./email-templates-service"

class ResendNotificationService {
  private client_: Resend
  private templates_: EmailTemplatesService
  private from_: string
  protected logger_: any

  constructor({ logger, options }) {
    this.logger_ = logger
    this.from_ = options.from
    
    // Initialize Resend client with API key
    this.client_ = new Resend(options.api_key)
    this.templates_ = new EmailTemplatesService()
    
    this.logger_.info("Initialized Resend notification provider")
  }

  async sendNotification(
    event: string,
    data: any,
    attachmentGenerator: unknown
  ) {
    if (!data.to) {
      this.logger_.warn(`No recipient found for notification ${event}`)
      return
    }

    try {
      const templateData = await this.templates_.getTemplate(event, data)
      
      if (!templateData) {
        this.logger_.warn(`No template found for notification ${event}`)
        return
      }
      
      const { subject, html } = templateData
      
      this.logger_.debug(`Sending email for event ${event} to ${data.to}`)
      
      const result = await this.client_.emails.send({
        from: this.from_,
        to: data.to,
        subject: subject,
        html: html
      })
      
      this.logger_.debug(`Email sent successfully: ${result.id}`)
      return { to: data.to, status: "sent", data: result }
    } catch (error) {
      this.logger_.error(`Failed to send email for ${event}: ${error.message}`)
      throw error
    }
  }

  async resendNotification(
    notification: any,
    config: Record<string, unknown> = {}
  ) {
    try {
      if (!notification.to) {
        this.logger_.warn(`No recipient found for resending notification ${notification.id}`)
        return
      }
      
      const result = await this.client_.emails.send({
        from: this.from_,
        to: notification.to,
        subject: notification.data.subject || "Notification from xGlobal-tents",
        html: notification.data.html
      })
      
      this.logger_.debug(`Email resent successfully: ${result.id}`)
      return { to: notification.to, status: "sent", data: result }
    } catch (error) {
      this.logger_.error(`Failed to resend email: ${error.message}`)
      throw error
    }
  }
}

export const service = ResendNotificationService
export const identifier = "resend"
export const defaultOptions = {}

export default NotificationModule({
  service,
  defaultOptions,
  identifier,
})
