// This is a custom debugging endpoint - not part of the official Medusa docs
// But can be useful to diagnose notification provider issues

export default async (req, res) => {
  try {
    const { container } = req.scope;
    
    const notificationProviderService = container.resolve("notificationProviderService");
    if (!notificationProviderService) {
      return res.status(500).json({ 
        success: false, 
        message: "Notification provider service not available" 
      });
    }
    
    // Lists all notification providers
    const providers = await notificationProviderService.list({});
    
    return res.json({
      success: true,
      providers,
    });
  } catch (error) {
    console.error("Error listing notification providers:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
