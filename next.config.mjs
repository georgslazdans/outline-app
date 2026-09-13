import withSerwistInit from "@serwist/next";
import nextMDX from "@next/mdx";
import webpack from "webpack";

const withMDX = nextMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
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
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[name].[hash][ext]",
      },
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      url: false,
      assert: false,
      buffer: false,
      querystring: false,
      util: false,
      net: false,
      tls: false,
      child_process: false,
      cluster: false,
      console: false,
      dgram: false,
      dns: false,
      domain: false,
      events: false,
      inspector: false,
      worker_threads: false,
      readfileasync: false,
      process: false,
      module: false,
    };

    config.plugins = [
      ...config.plugins,
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        const name = resource.request.replace(/^node:/, "");
        resource.request = name;
      }),
    ];

    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    return config;
  },
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: false,
  maximumFileSizeToCacheInBytes: 15000000,
  include: [/^(?!.*\/icons\/(android|ios)\/).*/],
});

export default withSerwist(withMDX(nextConfig));
