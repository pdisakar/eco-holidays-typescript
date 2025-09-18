// app/sitemap_index.xml/route.js

export async function GET() {
  const BASE_URL = `${process.env.CANONICAL_BASE}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}page-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}post-sitemap.xml</loc>
  </sitemap>
   <sitemap>
    <loc>${BASE_URL}trip-sitemap.xml</loc>
  </sitemap>
   <sitemap>
    <loc>${BASE_URL}team-sitemap.xml</loc>
  </sitemap>
    <sitemap>
    <loc>${BASE_URL}images-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}post-images-sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
