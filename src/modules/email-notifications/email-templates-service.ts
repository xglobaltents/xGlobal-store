import { render } from '@react-email/render';
import inviteTemplate from './templates/invite';
import resetPasswordTemplate from './templates/reset-password';
import orderConfirmationTemplate from './templates/order-confirmation';

export class EmailTemplatesService {
  private templates: Record<string, any>;

  constructor() {
    // Map event names to template components
    this.templates = {
      'invite.created': inviteTemplate,
      'invite.resent': inviteTemplate,
      'user.password_reset': resetPasswordTemplate,
      'order.placed': orderConfirmationTemplate,
      // Add more templates as needed
    };
  }

  async getTemplate(event: string, data: any) {
    const templateFn = this.templates[event];
    
    if (!templateFn) {
      return null;
    }

    try {
      // Render the React component to HTML
      const html = render(templateFn(data));
      
      // Generate appropriate subject based on the event
      let subject = 'Notification from xGlobal-tents';
      
      if (event.includes('invite')) {
        subject = 'You have been invited to xGlobal-tents admin';
      } else if (event.includes('password_reset')) {
        subject = 'Reset your password';
      } else if (event.includes('order')) {
        subject = `Order Confirmation #${data.order?.display_id || ''}`;
      }
      
      return { html, subject };
    } catch (error) {
      console.error(`Error rendering template for ${event}:`, error);
      return null;
    }
  }
}
