import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["ogl"],
  experimental: {
    viewTransition: true,
  },
  // LAN access during `next dev` for mobile device testing — dev-only, ignored in prod.
  // Value lives in .env.local (gitignored) so a personal network preference isn't
  // committed; unset → undefined → Next's safe default (no extra dev origins).
  // e.g. ALLOWED_DEV_ORIGINS=192.168.*.*,10.*.*.*
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",").map((s) =>
    s.trim()
  ),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    localPatterns: [
      {
        pathname: "/images/**",
        search: "",
      },
    ],
  },
};

export default config;
