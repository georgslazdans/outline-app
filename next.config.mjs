import { default as PWA } from "next-pwa";
import { nanoid } from "nanoid";
import { default as getStaticPrecacheEntries } from "./config/staticprecache.js";
import { default as getGeneratedPrecacheEntries } from "./config/precache.js";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

const buildId = nanoid();

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: () => buildId,

  output: "export",
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    nextImageExportOptimizer_remoteImageCacheTTL: "0",
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};
const pwaConfig = {
  dest: "public",
  // cacheOnFrontEndNav: true,
  dynamicStartUrl: false,
};

const pwa = (pwaConfig) => {
  return { withNextConfig: (nextConfig) => PWA(pwaConfig)(nextConfig) };
};

const configFunction = (phase, { defaultConfig }) => {
  const config = { ...pwaConfig };

  if (phase === PHASE_PRODUCTION_BUILD) {
    config.additionalManifestEntries = [
      ...getStaticPrecacheEntries(config),
      ...getGeneratedPrecacheEntries(buildId),
    ];
  }
  console.log("PWA config", config);
  return pwa(config).withNextConfig({ ...defaultConfig, ...nextConfig });
};
export default configFunction;
