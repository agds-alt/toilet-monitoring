// next.config.js - OPTIMIZED VERSION
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Image optimization
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Module transpilation (if needed)
  transpilePackages: [],
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size for client-side only
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Split Supabase into separate chunk
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              priority: 10,
            },
            // Split React/Next.js
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: 'react',
              priority: 10,
            },
            // All other node_modules
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 5,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

// Bundle analyzer wrapper
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = {
  compress: true, // Enable Gzip
  
  // Optional: SWC minify (faster)
  swcMinify: true,
  
  // Optional: Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
// Export with bundle analyzer
module.exports = withBundleAnalyzer(nextConfig);