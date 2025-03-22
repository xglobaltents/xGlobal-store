import { Resend } from "resend";
import dotenv from "dotenv";

// Load environment variables directly in the subscriber
dotenv.config();

/**
 * Handle invite created events by sending emails directly with Resend
 */
export default async function inviteSubscriber({ data, eventName, container }) {
  try {
    const notificationService = container.resolve("notificationService");
    
    const domain = process.env.ADMIN_URL || "https://dashboard.xglobal-tents.app";
    const inviteUrl = `${domain}/invite?token=${data.token}`;
    
    await notificationService.send({
      to: data.user_email,
      data: {
        userEmail: data.user_email,
        displayName: data.user_email.split('@')[0],
        inviteUrl: inviteUrl,
      },
    });
    
  } catch (error) {
    console.error("[inviteSubscriber] Error:", error.message);
  }
}

inviteSubscriber.events = ["invite.created", "invite.resent"];
