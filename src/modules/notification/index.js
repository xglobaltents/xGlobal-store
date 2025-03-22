import ResendService from "../../services/resend"

export default {
  resolve: async (container, options) => {
    try {
      console.log("Initializing Resend notification module")
      return {}
    } catch (error) {
      console.error("Failed to initialize Resend module:", error)
      return {}
    }
  },
  
  // We don't need complex registration in the module
  // The service is registered via medusa-config.js
}
