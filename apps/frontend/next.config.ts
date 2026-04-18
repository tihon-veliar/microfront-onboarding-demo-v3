import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      enabled: false,
    },
  },
  images: {
    domains: ["images.ctfassets.net"],
  },
};

export default nextConfig;
