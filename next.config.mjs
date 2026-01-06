/** @type {import('next').NextConfig} */
import path from "path";
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(new URL(import.meta.url).pathname, "styles")],
  },
  assetPrefix: process.env.URL,
};

export default nextConfig;
