import { getSiteMap } from "@/services/network_requests";

interface TeamMember {
  slug: string;
  updated_at: string;
}

interface SiteMapData {
  teams: TeamMember[];
}

const BASE_URL: string = `${process.env.CANONICAL_BASE}`;

export async function GET() {
  const response = await getSiteMap();
  const allData: SiteMapData = response;
  const team: TeamMember[] = allData.teams

  

  const xml: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${team
    .map(
      (post: TeamMember) => `<url>
  <loc>${BASE_URL}our-team/${post.slug}</loc>
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