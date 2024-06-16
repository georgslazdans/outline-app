import { default as PWA } from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

const withPWA = PWA({
  dest: "public",
});

export default withPWA(nextConfig);
