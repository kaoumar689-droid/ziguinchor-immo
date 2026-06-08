import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdihkzydctnnegkfpooo.supabase.co",
      },
    ],
  },
};

export default nextConfig;