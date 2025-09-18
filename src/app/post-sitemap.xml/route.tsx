import { getSiteMap } from "@/services/network_requests";

interface BlogPost {
  slug: string;
  updated_at: string;
  canonical: string | null;
}

interface SiteMapData {
  blogs: BlogPost[];
}

interface SitemapPost {
  url: string;
  lastModified: string;
  priority: number;
}

const BASE_URL: string = `${process.env.CANONICAL_BASE}`;

export async function GET() {
  const response = await getSiteMap();
  const allData: SiteMapData = response;
  const posts: SitemapPost[] = allData.blogs
    //.filter((a) => a.canonical === null)
    .map((itm: BlogPost) => {
      return {
        url: BASE_URL + itm.slug,
        lastModified: itm.updated_at,
        priority: 1,
      };
    })

  const xml: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts
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
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}