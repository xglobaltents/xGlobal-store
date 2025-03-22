// ...existing code...

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
    // Add this to ensure notification providers are properly registered
    notifications: {
      providers: {
        resend: {
          active: true,
          // Match this to the ResendService identifier
          provider_id: "resend",
        },
      },
    },
  },
  // ...existing code...
};