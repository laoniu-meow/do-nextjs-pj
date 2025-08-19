/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode temporarily to see if it helps with the error
  reactStrictMode: false,
  
  // Turbopack configuration (stable in Next.js 15)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Experimental features
  experimental: {
    // Remove the deprecated optimizePackageImports option
  },

  // Webpack configuration to handle potential issues
  webpack: (config, { dev, isServer }) => {
    // Add fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Disable some features that might cause issues in development
  ...(process.env.NODE_ENV === 'development' && {
    // Disable source maps in development to reduce memory usage
    productionBrowserSourceMaps: false,
  }),
};

module.exports = nextConfig;
