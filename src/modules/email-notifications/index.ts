import { NotificationService } from "@medusajs/medusa"
import { ModuleExports } from "@medusajs/utils"
import { Resend } from "resend"
import { EmailTemplatesService } from "./email-templates-service"

class ResendNotificationService {
  private client_: Resend
  private templates_: EmailTemplatesService
  private from_: string
  protected logger_: any

  constructor({ logger, options }) {
    this.logger_ = logger
    this.from_ = options.from || process.env.RESEND_FROM_EMAIL || "no-reply@xglobal-tents.app"
    
    // Initialize Resend client with API key
    const apiKey = options.api_key || process.env.RESEND_API_KEY
    if (!apiKey) {
      this.logger_.error("No Resend API key provided. Email notifications will not work.")
    }
    
    this.client_ = new Resend(apiKey)
    this.templates_ = new EmailTemplatesService()
    
    this.logger_.info("Initialized Resend notification provider with from: " + this.from_)
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
        this.logger_.warn(`No template found for notification ${event}, falling back to basic message`)
        // Fall back to basic message if no template is found
        return await this.client_.emails.send({
          from: this.from_,
          to: data.to,
          subject: `Notification: ${event}`,
          html: `<p>You have a notification regarding: ${event}</p>
                <p>Please check your account for more details.</p>`,
        })
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
      
      this.logger_.debug(`Resending email to ${notification.to}`)
      
      // If we have HTML content in the data, use that
      let htmlContent = notification.data.html
      if (!htmlContent && notification.data.template_data) {
        try {
          const event = notification.event_name || "unknown"
          const templateData = await this.templates_.getTemplate(event, notification.data.template_data)
          if (templateData) {
            htmlContent = templateData.html
          }
        } catch (err) {
          this.logger_.error(`Failed to generate template for resend: ${err.message}`)
        }
      }
      
      // If we still don't have HTML, create basic content
      if (!htmlContent) {
        htmlContent = `<p>You have a notification from xGlobal-tents.</p>
                      <p>Please check your account for more details.</p>`
      }
      
      const result = await this.client_.emails.send({
        from: this.from_,
        to: notification.to,
        subject: notification.data.subject || "Notification from xGlobal-tents",
        html: htmlContent
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

const moduleDefinition: ModuleExports = {
  service,
  identifier,
  defaultOptions,
}

export default moduleDefinition
