import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Désactive ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionnel : désactive aussi TypeScript errors pendant le build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
