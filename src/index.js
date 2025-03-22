// Main entry point for custom code
export default {
  load: (container, options) => {
    // Log startup information
    console.log("Loading custom Resend notification handler")
    
    try {
      // Get the notification provider registry
      const notificationProviderService = container.resolve("notificationProviderService")
      
      // Register our provider with the service
      if (notificationProviderService) {
        console.log("Registering 'resend' as notification provider for email channel")
        notificationProviderService.registerInstalledProviders([{
          id: "resend",
          is_installed: true
        }])
      } else {
        console.warn("Notification provider service not found - email notifications may not work")
      }
    } catch (err) {
      console.error("Error during module initialization:", err)
    }
  }
}
