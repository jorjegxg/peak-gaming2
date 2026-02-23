import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/peak-hosted",
  assetPrefix: "/peak-hosted/",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "media.rawg.io", pathname: "/**" },
      { protocol: "https", hostname: "cmsassets.rgpub.io", pathname: "/**" },
      { protocol: "https", hostname: "drop-assets.ea.com", pathname: "/**" },
      { protocol: "https", hostname: "cdna.artstation.com", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
    ],
  },
};

export default nextConfig;
