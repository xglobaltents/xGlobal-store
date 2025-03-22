const plugins = [
  // ...existing plugins...
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: process.env.S3_URL,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      access_key_id: process.env.S3_ACCESS_KEY_ID,
      secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
      cache_control: process.env.S3_CACHE_CONTROL,
    },
  },
  {
    resolve: `./src/services/resend`,
    options: {
      resendOptions: {
        api_key: process.env.RESEND_API_KEY,
        from_email: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      },
    },
  },
  // ...existing plugins...
];

// ...existing code...

module.exports = {
  // ...existing code...
  plugins,
  projectConfig: {
    // ...existing project config...
    email_provider: "resend",
    email_from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
    
    notification_settings: {
      provider_id: "resend",
      enabled: true
    }
  },
  modules: [
    // ...existing code...
    {
      resolve: "@medusajs/medusa/dist/modules/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
              admin_url: process.env.ADMIN_URL || "http://localhost:7001",
            },
          },
        ],
      },
    },
    // If you want to use local notifications instead (for development)
    // Uncomment this and comment out the resend provider above
    /*
    {
      resolve: "@medusajs/medusa/dist/modules/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/dist/services/notification-local",
            id: "local",
            options: {
              channels: ["email"],
            },
          },
        ],
      },
    },
    */
    // ...existing code...
  ],
  // ...existing code...
};