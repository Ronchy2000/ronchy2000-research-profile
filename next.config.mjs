/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  images: {
    unoptimized: true, // Disable image optimization for EdgeOne compatibility , vercel can support this function.
  }
};

export default nextConfig;
