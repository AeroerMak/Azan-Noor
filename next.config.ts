import type { NextConfig } from "next";

// MOBILE_BUILD=1 produces a static export in out/ for the Capacitor apps.
// Server-only routes are named *.web.ts so they are left out of that build.
const isMobile = process.env.MOBILE_BUILD === "1";

const nextConfig: NextConfig = isMobile
  ? {
      output: "export",
      pageExtensions: ["tsx", "ts"],
      images: { unoptimized: true },
    }
  : {
      pageExtensions: ["tsx", "ts", "web.ts"],
    };

export default nextConfig;
