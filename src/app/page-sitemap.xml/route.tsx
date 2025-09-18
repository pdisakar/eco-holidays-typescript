import { getSiteMap } from "@/services/network_requests";

// Define the shape of your data
interface PageData {
  slug: string;
  updated_at: string;
  // Add any other properties your page objects have
}

interface AuthorData {
  slug: string;
  updated_at: string;
  // Add any other properties your author objects have
}

interface DestinationData {
  slug: string;
  updated_at: string;
  // Add any other properties your destination objects have
}

interface SiteMapData {
  pages: PageData[];
  authors: AuthorData[];
  destination: DestinationData[];
}

const BASE_URL: string = `${process.env.CANONICAL_BASE}`;

export async function GET() {
  const response = await getSiteMap();
  const allData: SiteMapData = response;

  const article: PageData[] = allData.pages.filter(
    ({ slug }) =>
      !["team-himalaya"].includes(slug)
  );

  const author: AuthorData[] = allData.authors;
  const category: DestinationData[] = allData.destination;

  function formatDateForSitemap(date: Date = new Date()): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid Date");
    }
    const isoString = date.toISOString();
    return isoString.replace(".000Z", "+00:00");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${BASE_URL}</loc>
  <lastmod>${formatDateForSitemap(new Date())}</lastmod>
  <priority>1.0</priority>
</url>
  ${category
    .map(
      (post) => `<url>
  <loc>${BASE_URL}${post.slug}</loc>
  <lastmod>${post.updated_at}</lastmod>
  <priority>0.8</priority>
</url>`
    )
    .join("\n")}
    ${article
      .map(
        (post) => `<url>
  <loc>${BASE_URL}${post.slug}</loc>
  <lastmod>${post.updated_at}</lastmod>
  <priority>0.8</priority>
</url>`
      )
      .join("\n")}
    ${author
      .map(
        (post) => `<url>
  <loc>${BASE_URL}author/${post.slug}</loc>
  <lastmod>${post.updated_at}</lastmod>
  <priority>0.7</priority>
</url>`
    )
    .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}