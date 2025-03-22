/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing code...
  
  experimental: {
    // ...existing experimental options...
    serverComponentsExternalPackages: ['resend'],
    
    // Add this to improve serverless function compatibility
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/darwin-x64',
      ],
    },
  },
  
  // Keep environment variable handling simple to avoid deployment issues
  env: {
    // ...existing env variables...
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  
  // Add this to optimize for serverless environments
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle module not found errors during build
      config.externals = [...config.externals, 'resend'];
    }
    return config;
  },
};

module.exports = nextConfig;
