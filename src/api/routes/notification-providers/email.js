// This is a custom debugging endpoint - not part of the official Medusa docs
// But can be useful to diagnose notification provider issues

export default async (req, res) => {
  try {
    const { container } = req.scope;
    
    // Get all resolved services to check
    const services = container.getAllAssociations();
    console.log("Available services:", services);
    
    // Get notification service
    const notificationService = container.resolve("notificationService");
    if (!notificationService) {
      return res.status(500).json({ 
        success: false, 
        message: "Notification service not available" 
      });
    }
    
    // Get resend service specifically
    const resendService = container.resolve("resendService");
    const resendAvailable = !!resendService;
    
    // Check for notification providers
    const notificationProviders = container.resolve("notificationProviders") || [];
    const providers = Array.isArray(notificationProviders) 
      ? notificationProviders 
      : [];
    
    return res.json({
      success: true,
      resendAvailable,
      providers: providers.map(p => ({
        id: p.identifier || p.id,
        channel: p.channel,
        registered: true
      })),
      notificationModules: Object.keys(container.modules || {}),
      serviceCount: services.length,
      hasEmailProvider: providers.some(p => p.channel === "email"),
    });
  } catch (error) {
    console.error("Error getting email providers:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: error.stack
    });
  }
};
