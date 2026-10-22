/** @type {import('next').NextConfig} */
const isStaticExportBuild =
  process.env.EDGEONE === "1" ||
  process.env.CF_PAGES === "1" ||
  process.env.GITHUB_PAGES === "1";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "1";
const githubPagesBasePath = isGitHubPagesBuild
  ? process.env.NEXT_PUBLIC_BASE_PATH || "/ronchy2000-research-profile"
  : "";

const nextConfig = {
  images: {
    // EdgeOne Pages does not support Next.js image optimization.
    unoptimized: true
  },
  ...(isStaticExportBuild
    ? {
        // Static hosts: prefer a fully-static export.
        output: "export",
        trailingSlash: true
      }
    : {}),
  ...(isGitHubPagesBuild
    ? {
        // GitHub Pages serves project sites below /<repository-name>.
        basePath: githubPagesBasePath,
        env: {
          NEXT_PUBLIC_BASE_PATH: githubPagesBasePath
        }
      }
    : {})
};

export default nextConfig;
