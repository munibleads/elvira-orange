import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_VAPI_PUBLIC_KEY: "79f5efd8-48f4-49b4-813b-24928f9a32a5",
    NEXT_PUBLIC_VAPI_ASSISTANT_ID: "b7428067-33f0-4228-9469-70d6e793a654",
  },
};

export default nextConfig;
