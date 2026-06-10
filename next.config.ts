import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/health/:path*",
        destination: `${backendUrl}/health/:path*`,
      },
    ];
  },
};

export default nextConfig;
