import { NotificationService } from "@medusajs/medusa";

export default async function handleInviteCreated({ 
  data, 
  container,
}) {
  const notificationService = container.resolve("notificationService")
  
  // Explicitly specifying that the ResendService should handle this notification
  notificationService.send(
    "invite.created",
    data,
    "resend"
  )
}
