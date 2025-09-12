const { i18n } = await import('./next-i18next.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // Removed this as it conflicts with i18n
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  i18n, // Added i18n configuration
};

export default nextConfig;
