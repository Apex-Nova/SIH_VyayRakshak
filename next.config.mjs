/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Keep demo builds unblocked; lint is run separately via `npm run lint`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
