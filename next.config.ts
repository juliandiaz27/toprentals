import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/reservar",
        destination: "/reservas",
        permanent: true,
      },
      {
        source: "/misreservas",
        destination: "/mis-reservas",
        permanent: true,
      },
      {
        source: "/quienes-somos",
        destination: "/nosotros",
        permanent: true,
      },
      {
        source: "/trabaja",
        destination: "/trabaja-con-nosotros",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
