import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   output: 'export',      // This tells Next.js to generate static files
  images: {
    unoptimized: true,   // Required for static export
  },
    trailingSlash: true, // Optional: recommended for cleaner URLs on some hosts

};

export default nextConfig;
