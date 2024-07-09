/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

import path from "path";
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(new URL(import.meta.url).pathname, "styles")],
  },
  assetPrefix: isProd ? "https://snake4d.netlify.app/" : undefined,
};

export default nextConfig;
