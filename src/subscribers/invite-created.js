/**
 * Handle invite created events
 */
export default async function userInviteHandler({ 
  data, 
  eventName, 
  container 
}) {
  const notificationService = container.resolve("notificationModuleService")
  
  if (eventName === "invite.created" || eventName === "invite.resent") {
    console.log(`Processing ${eventName} event for user invite`)
    
    try {
      // Get domain from environment or use default
      const domain = process.env.BACKEND_URL || "https://dashboard.xglobal-tents.app"
      
      await notificationService.createNotifications([
        {
          type: "invite",
          to: data.user_email,
          data: {
            ...data,
            domain
          }
        }
      ], {
        attachments: [],
        channel: "email",
        event_name: eventName,
      })
      
      console.log(`Successfully sent ${eventName} notification to ${data.user_email}`)
    } catch (error) {
      console.error(`Failed to send ${eventName} notification:`, error.message)
    }
  }
}
