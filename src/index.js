// Main entry point for custom code
export default {
  load: (container, options) => {
    // Log startup information
    console.log("Loading custom Resend notification handler")
    
    try {
      // Check if services exist before resolving them
      if (container.hasRegistration("notificationService") && 
          container.hasRegistration("notificationProviderService")) {
        
        const notificationService = container.resolve("notificationService")
        const notificationProviderService = container.resolve("notificationProviderService")
        
        console.log("Registering 'resend' as notification provider for email channel")
        
        // Register the provider for the email channel
        notificationProviderService.registerInstalledProviders([{
          id: "resend",
          is_installed: true
        }])
        
        // Important: Register the provider for the email channel specifically
        if (container.hasRegistration("resendService")) {
          const resendProvider = container.resolve("resendService")
          notificationService.registerProvider("email", resendProvider)
          console.log("Successfully registered resend provider for email channel")
        } else {
          console.warn("Resend service not available - email notifications may not work")
        }
      } else {
        console.warn("Notification service or provider service not found - email notifications may not work")
      }
    } catch (err) {
      console.error("Error during module initialization:", err.message)
      console.error(err.stack)
      // Don't let errors here crash the app on startup
    }
  }
}
