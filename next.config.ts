import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 300,
        ignored: [
          "**/.next-*/**",
          "**/docs/notion-export/**",
          "**/node_modules/**"
        ],
        poll: 1000
      };
    }

    return config;
  }
};

export default nextConfig;
