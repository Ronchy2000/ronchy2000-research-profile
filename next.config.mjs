/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable image optimization for EdgeOne compatibility , vercel can support this function.
  },
  // Ensure trailing slashes for EdgeOne routing
  trailingSlash: false,
  // Skip trailing slash redirects to avoid conflicts with proxy.ts
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
