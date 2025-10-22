/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // Image domains untuk storage yang digunakan
  images: {
    domains: [
      'res.cloudinary.com', // Cloudinary untuk photo storage
      'lh3.googleusercontent.com', // Google auth (jika pakai OAuth)
      'avatars.githubusercontent.com', // GitHub auth (jika pakai OAuth)
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables untuk client side
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
  },

  // Webpack configuration untuk path aliases
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Path aliases untuk development dan production
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@/app': './src/app',
      '@/api': './src/app/api',
      '@/dashboard': './src/app/dashboard',
      '@/core': './src/core',
      '@/entities': './src/core/entities',
      '@/dtos': './src/core/dtos',
      '@/repositories': './src/core/repositories',
      '@/use-cases': './src/core/use-cases',
      '@/types': './src/core/types',
      '@/infrastructure': './src/infrastructure',
      '@/database': './src/infrastructure/database',
      '@/auth': './src/infrastructure/auth',
      '@/storage': './src/infrastructure/storage',
      '@/presentation': './src/presentation',
      '@/components': './src/presentation/components',
      '@/features': './src/presentation/components/features',
      '@/ui': './src/presentation/components/ui',
      '@/layout': './src/presentation/components/layout',
      '@/hooks': './src/presentation/hooks',
      '@/contexts': './src/presentation/contexts',
      '@/styles': './src/presentation/styles',
      '@/lib': './src/lib',
      '@/constants': './src/lib/constants',
      '@/utils': './src/lib/utils',
    };

    // Support untuk QR scanner dan camera
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Rule khusus untuk file binary (jika ada library QR scanner)
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    return config;
  },

  // Headers untuk security dan CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/dashboard/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  // Redirects untuk user experience
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/inspect',
        destination: '/dashboard/inspect',
        permanent: true,
      },
      {
        source: '/scan',
        destination: '/dashboard/scan',
        permanent: true,
      },
      {
        source: '/reports',
        destination: '/dashboard/reports',
        permanent: true,
      },
    ];
  },

  // Compiler optimization untuk production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output standalone untuk deployment yang lebih efisien
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;
