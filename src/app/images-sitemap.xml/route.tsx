import { getImageSiteMap } from "@/services/network_requests";

// Define the shape of your data
interface Images {
  featured?: string;
  banners?: string[];
}

interface Packages {
  package: Record<string, Images>;
}

const BASE_URL: string = `${process.env.CANONICAL_BASE}`;
const MEDIA_URL: string = `${process.env.IMAGE_URL}`;

export async function GET() {
  const packages: Packages = await getImageSiteMap();

  const urls: string[] = Object.entries(packages.package).map(
    ([slug, imagesObj]: [string, Images]) => {
      const pageUrl: string = `${BASE_URL}package/${slug}`;
      const images: string[] = [];
      if (imagesObj.featured) images.push(imagesObj.featured);
      if (Array.isArray(imagesObj.banners)) {
        images.push(...imagesObj.banners.filter(Boolean));
      }

      const imageTags: string = images
        .map(
          (img) => `
        <image:image>
          <image:loc>${MEDIA_URL}${img}</image:loc>
        </image:image>`
        )
        .join("");

      return `
    <url>
        <loc>${pageUrl}</loc>
      ${imageTags}
    </url>`;
    }
  );

  const xml: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urls.join("\n")}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}