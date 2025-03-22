/**
 * Handle invite created events
 */
export default async function handleInviteCreated({ 
  data, 
  container,
}) {
  try {
    console.log("Invite created event received for:", data?.user_email)
    
    const notificationService = container.resolve("notificationService")
    if (!notificationService) {
      console.error("Notification service not available")
      return
    }
    
    // Simple notification dispatch
    await notificationService.send("invite.created", data)
    console.log("Invite notification dispatched successfully")
  } catch (error) {
    // Log but don't throw to prevent deployment crashes
    console.error("Failed to handle invite notification:", error)
  }
}
