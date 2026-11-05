import type { NextConfig } from "next";

// MOBILE_BUILD=1 produces a static export in out/ for the Capacitor apps
// (scripts/build-mobile.mjs moves the server-only src/app/api aside for it).
const isMobile = process.env.MOBILE_BUILD === "1";

const nextConfig: NextConfig = isMobile
  ? {
      output: "export",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
