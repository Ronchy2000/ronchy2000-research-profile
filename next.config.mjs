/** @type {import('next').NextConfig} */
const isStaticExportBuild =
  process.env.EDGEONE === "1" || process.env.CF_PAGES === "1";

const nextConfig = {
  images: {
    // EdgeOne Pages does not support Next.js image optimization.
    unoptimized: true
  },
  ...(isStaticExportBuild
    ? {
        // EdgeOne Pages and Cloudflare Pages: prefer fully-static export.
        output: "export",
        trailingSlash: true
      }
    : {})
};

export default nextConfig;
