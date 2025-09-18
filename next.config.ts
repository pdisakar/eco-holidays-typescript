import type { NextConfig } from "next";
const redirection_data = [
  {
    source: '/testimonial',
    destination: '/reviews',
    permanent: true,
  },
  {
    source: '/testimonial/:slug*',
    destination: '/reviews',
    permanent: true,
  },
  {
    source: '/trekking/:slug*',
    destination: '/:slug*',
    permanent: true,
  },
  {
    source: '/tours/:slug*',
    destination: '/:slug*',
    permanent: true,
  },
  {
    source: '/climbing/:slug*',
    destination: '/:slug*',
    permanent: true,
  },

  {
    source: '/tsum-valley-and-manaslu-trekking',
    destination: '/manaslu-tsum-valley-trek',
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["ilucide-react"],
  },
  serverExternalPackages: ["node-html-parser"],
  compiler: {
    removeConsole: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    //unoptimized: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.ecoholidaysnepal.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
    minimumCacheTTL: 60,
  },
  async redirects() {
    const response = await fetch(
      `${process.env.PRODUCTION_SERVER}/urlredirects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        sitekey: `${process.env.SITE_KEY}`
      },
    }
    );

    const redirection = await response.json();
    const data = await redirection.data;
    const redirectionURls = data?.map((a: any) => {
      return {
        source: a.source,
        destination: a.destination,
        permanent: true,
      };
    });
    return [...redirectionURls, ...redirection_data];
  },
};

export default nextConfig;
