import { getSiteMap } from "@/services/network_requests";
const BASE_URL = `${process.env.CANONICAL_BASE}`;

export async function GET() {
  const allData = await getSiteMap();

  const packages = await allData.packages
    //.filter((a) => a.canonical === null)
    .map((itm) => {
      return {
        url: BASE_URL + itm.slug,
        lastModified: itm.updated_at,
        priority: 1,
      };
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">


  ${packages
    .map(
      (post) => `<url>
  <loc>${post.url}</loc>
  <lastmod>${post.lastModified}</lastmod>
  <priority>1.0</priority>
</url>`
    )
    .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
