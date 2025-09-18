import { getImageSiteMap } from "@/services/network_requests";

// Define the shape of your image objects
interface BlogImages {
  featured?: string;
  banner?: string;
  carousel?: string[]; // Assuming carousel is an array of strings
  // Add other image properties if they exist
}

// Define the shape of the overall data from the API
interface SiteMapData {
  blog: Record<string, BlogImages>;
}

const BASE_URL: string = `${process.env.CANONICAL_BASE}`;
const MEDIA_URL: string = `${process.env.IMAGE_URL}`; // change if needed

export async function GET() {
  const packages: SiteMapData = await getImageSiteMap();

  const filteredArray: [string, BlogImages][] = Object.entries(packages.blog)
    .filter(([_, value]: [string, BlogImages]) => value.featured || value.banner);

  const urls: string[] = filteredArray.map(([slug, imagesObj]: [string, BlogImages]) => {
    const pageUrl: string = `${BASE_URL}${slug}`;
    const images: string[] = [];

    if (imagesObj.featured) images.push(imagesObj.featured);
    if (imagesObj.banner) images.push(imagesObj.banner);
    
    // Optional: include carousel images if they exist
    // if (Array.isArray(imagesObj.carousel)) {
    //   images.push(...imagesObj.carousel.filter(Boolean));
    // }

    const imageTags: string = images
      .map(
        (img: string) => `
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
  });

  const xml: string = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  >
    ${urls.join("\n")}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}