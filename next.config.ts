import type { NextConfig } from "next";

/** Encabezados de seguridad. Sin CSP estricta: GNAHS y Elfsight cargan scripts de terceros. */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // El panel no se puede embeber ni indexar
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/admin",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
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
