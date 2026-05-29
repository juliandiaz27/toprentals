import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/reservar",
        destination: "/reservas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
