/** @type {import('next').NextConfig} */
const isEdgeOneBuild = process.env.EDGEONE === "1";

const nextConfig = {
  images: {
    // EdgeOne Pages does not support Next.js image optimization.
    unoptimized: true
  },
  ...(isEdgeOneBuild
    ? {
        // EdgeOne Pages: prefer fully-static export for maximum compatibility.
        output: "export",
        trailingSlash: true
      }
    : {})
};

export default nextConfig;
