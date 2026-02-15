/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    unoptimized: true, // Disable image optimization for EdgeOne compatibility , vercel can support this function.
  }
};

export default nextConfig;
