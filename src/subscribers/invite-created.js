import { NotificationService } from "@medusajs/medusa";

/**
 * Handle invite created events
 */
export default async function userInviteHandler({ 
  data, 
  eventName, 
  container 
}) {
  console.log(`Received ${eventName} event with data:`, JSON.stringify(data, null, 2))
  
  if (eventName === "invite.created" || eventName === "invite.resent") {
    console.log(`Processing ${eventName} event for user invite to ${data.user_email}`)
    
    try {
      // Get the notification service
      const notificationService = container.resolve("notificationService");
      
      // Get domain from environment
      const domain = process.env.ADMIN_URL || "https://dashboard.xglobal-tents.app";
      
      await notificationService.send({
        to: data.user_email,
        templateId: "invite",
        data: {
          inviteToken: data.token,
          userEmail: data.user_email,
          displayName: data.user_email.split('@')[0],
          inviteUrl: `${domain}/invite?token=${data.token}`,
        },
      });
      
      console.log(`Successfully sent ${eventName} notification to ${data.user_email}`)
    } catch (error) {
      console.error(`Failed to send ${eventName} notification:`, error.message)
      console.error(error.stack)
      // Important: Don't let errors here crash the app
    }
  }
}

// Define the events this subscriber handles
userInviteHandler.events = ["invite.created", "invite.resent"];
