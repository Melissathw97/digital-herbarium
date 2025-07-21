import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This wildcard allows all hostnames
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1", // 👈 explicitly allow "kong"
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
