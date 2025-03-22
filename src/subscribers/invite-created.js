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
      // Get the notification service - use a safer fallback approach
      let notificationService

      if (container.hasRegistration("notificationModuleService")) {
        notificationService = container.resolve("notificationModuleService")
      } else if (container.hasRegistration("notificationService")) {
        notificationService = container.resolve("notificationService")
        console.log("Using legacy notification service")
      } else {
        throw new Error("No notification service available")
      }
      
      // Get domain from environment or use default
      const domain = process.env.BACKEND_URL || "https://dashboard.xglobal-tents.app"
      
      // Print available providers for debugging
      if (container.hasRegistration("notificationProviderService")) {
        const notificationProviderService = container.resolve("notificationProviderService")
        try {
          const providers = notificationProviderService.listInstalledProviders()
          console.log("Available notification providers:", JSON.stringify(providers, null, 2))
        } catch (err) {
          console.warn("Could not list providers:", err.message)
        }
      }
      
      const notificationData = {
        type: "invite",
        to: data.user_email,
        data: {
          ...data,
          domain,
          template_data: {
            user_email: data.user_email,
            token: data.token,
            display_name: data.display_name || "",
            domain: domain
          }
        }
      }
      
      console.log(`Creating notification for ${eventName} with:`, JSON.stringify(notificationData, null, 2))
      
      await notificationService.createNotifications([notificationData], {
        attachments: [],
        channel: "email",
        event_name: eventName,
      })
      
      console.log(`Successfully sent ${eventName} notification to ${data.user_email}`)
    } catch (error) {
      console.error(`Failed to send ${eventName} notification:`, error.message)
      console.error(error.stack)
      // Important: Don't let errors here crash the app
    }
  }
}

export default async function handleInvite(data, container) {
  const notificationService = container.resolve(NotificationService);

  await notificationService.send({
    to: data.user_email,
    templateId: "invite",
    data: {
      inviteToken: data.token,
      userEmail: data.user_email,
      displayName: data.user_email.split('@')[0],
      inviteUrl: `${process.env.ADMIN_URL}/invite?token=${data.token}`,
    },
  });
}

handleInvite.event = "invite.created";
