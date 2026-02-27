/** @type {import('next').NextConfig} */

// Production-optimized Next.js configuration
const nextConfig = {
  // Enable React Strict Mode for catching potential problems
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    // Disable unoptimized images in production
    unoptimized: false,
    
    // Allowed remote image sources
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Add any other allowed domains here
    ],
    
    // Cache duration for optimized images (in seconds)
    minimumCacheTTL: 86400, // 24 hours
    
    // Responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Image formats to support
    formats: ["image/webp", "image/avif"],
  },

  // Compression settings
  compress: true,

  // Experimental features (use with caution)
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Headers for security (applied to all routes)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Cache static assets
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirect rules
  async redirects() {
    return [
      // Redirect HTTP to HTTPS (when using custom server)
      // Note: Most hosting platforms handle this automatically
    ];
  },

  // Webpack configuration for production optimizations
  webpack: (config, { isServer, dev }) => {
    // Production-only optimizations
    if (!dev && !isServer) {
      // Optimize bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
            },
            common: {
              minChunks: 2,
              chunks: "all",
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // TypeScript and ESLint configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. (Not recommended for production)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds to successfully complete even if
    // your project has ESLint errors. (Not recommended for production)
    ignoreDuringBuilds: false,
  },

  // Output configuration
  output: "standalone", // Creates a standalone build for Docker/deployment
  distDir: ".next",

  // Power management (for serverless environments)
  poweredByHeader: false, // Remove X-Powered-By header for security
};

export default nextConfig;
