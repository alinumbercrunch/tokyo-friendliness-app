import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required so Amplify detects and serves SSR correctly; removing this may cause 404s.
  output: "standalone",
};

export default nextConfig;
