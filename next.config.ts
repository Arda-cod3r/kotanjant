import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ürün/hero görselleri hem uzak (demo) hem de yerel (/uploads) kaynaklardan gelebilir.
  images: {
    // Local placeholder görselleri SVG olduğu için optimizasyon izni gerekir.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  experimental: {
    // Admin panelinden görsel yüklerken büyük gövdeleri kabul et.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
