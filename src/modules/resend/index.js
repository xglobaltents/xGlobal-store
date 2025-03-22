import { NotificationService } from "medusa-interfaces"
import { Resend } from 'resend'

class ResendService extends NotificationService {
  static identifier = "resend"

  constructor({ }, options) {
    super()
    
    this.options = options
    this.resend = new Resend(options.api_key)
  }

  async sendNotification(event, eventData, attachmentGenerator) {
    if (event.startsWith("invite.")) {
      return await this.sendInviteNotification(event, eventData)
    }
    
    // Handle other notification types as needed
    return
  }

  async sendInviteNotification(event, data) {
    const { email, token, user_email } = data

    const subject = "You've been invited to the store's team"
    const message = `You've been invited to join the team. Click this link to accept the invite: ${this.options.admin_url}/invite?token=${token}&email=${email}`

    return await this.resend.emails.send({
      from: this.options.from,
      to: email,
      subject: subject,
      text: message,
    })
  }

  async resendNotification(notification, config, attachmentGenerator) {
    const data = notification.data
    const event = notification.event_name
    
    return await this.sendNotification(event, data, attachmentGenerator)
  }
}

export default ResendService
