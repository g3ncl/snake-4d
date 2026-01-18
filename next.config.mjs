/** @type {import('next').NextConfig} */
import path from "path";
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(new URL(import.meta.url).pathname, "styles")],
  },
  assetPrefix: process.env.URL,
};

export default nextConfig;
