import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Node.js runtime for all API routes
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('bcryptjs', 'jsonwebtoken');
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-API-Version',
            value: '1.0'
          }
        ]
      }
    ]
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true
};

export default nextConfig;
