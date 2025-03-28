/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ignore TypeScript errors during build to prevent functions directory issues
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
