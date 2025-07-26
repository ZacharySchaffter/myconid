import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/account",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
