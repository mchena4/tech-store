import type { NextConfig } from "next";

const backendUrl = (
  process.env.INTERNAL_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

let backendHostname = "";
try {
  const parsed = new URL(backendUrl);
  backendHostname = parsed.hostname;
} catch {
  // Ignore fallback
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/categories",
        destination: `${backendUrl}/category_list/`,
      },
      {
        source: "/api/categories/",
        destination: `${backendUrl}/category_list/`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "**.onrender.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "**.railway.app",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
      ...(backendHostname && backendHostname !== "127.0.0.1" && backendHostname !== "localhost"
        ? [
            {
              protocol: (backendUrl.startsWith("https") ? "https" : "http") as "https" | "http",
              hostname: backendHostname,
              pathname: "/media/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
