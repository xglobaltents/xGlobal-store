import { NotificationService } from "@medusajs/medusa";

/**
 * Handle invite created events
 */
export default async function inviteSubscriber({ data, eventName, container }) {
  try {
    console.log(`[inviteSubscriber] Received ${eventName} event`);
    
    // Try to get the old style notification service first
    let notificationService;
    
    if (container.hasRegistration("notificationService")) {
      notificationService = container.resolve("notificationService");
      console.log("[inviteSubscriber] Using legacy notification service");
    } else if (container.hasRegistration("notificationModuleService")) {
      notificationService = container.resolve("notificationModuleService");
      console.log("[inviteSubscriber] Using notification module service");
    } else {
      console.error("[inviteSubscriber] No notification service available");
      return;
    }
    
    // Get domain from environment
    const domain = process.env.ADMIN_URL || "https://dashboard.xglobal-tents.app";
    const inviteUrl = `${domain}/invite?token=${data.token}`;
    
    console.log(`[inviteSubscriber] Sending invite to ${data.user_email} with URL: ${inviteUrl}`);
    
    // Send the notification
    await notificationService.sendNotification(
      "invite",
      {
        to: data.user_email,
        data: {
          inviteToken: data.token,
          userEmail: data.user_email,
          displayName: data.user_email.split('@')[0] || "there",
          inviteUrl
        },
      }
    );
    
    console.log(`[inviteSubscriber] Successfully sent notification to ${data.user_email}`);
  } catch (error) {
    console.error("[inviteSubscriber] Error handling invite event:", error.message);
    console.error(error.stack);
    // Don't throw errors - let the flow continue
  }
}

// Register for both create and resend events
inviteSubscriber.events = ["invite.created", "invite.resent"];
