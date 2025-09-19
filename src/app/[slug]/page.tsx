import Article from "@/components/Pages/Article/Article";
import Blog from "@/components/Pages/Blog";
import Category from "@/components/Pages/Category/Category";
import Package from "@/components/Pages/Package/Package";
import { IMAGE_URL } from "@/lib/constants";
import { getArticle, getSiteMap, getStaticRoutes } from "@/services/network_requests";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AuthorItem, Media, Meta, UrlInfo } from "@/types";
import Script from 'next/script';

// Interfaces
interface Content {
  title: string;
  published_at: string;
  updated_at: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
  authors: AuthorItem[];
}

interface ArticleData {
  page_type: "article" | "blog" | "category" | "package";
  content: Content;
}



export async function generateStaticParams() {
  const data = await getStaticRoutes();

  if (!Array.isArray(data)) {
    return [];
  }

  const excludedSlugs = [
    "blog", "booking", "trip-booking", "author", "contact-us", "checkout",
    "plan-your-trip", "about-us", "customize-trip", "nabil-payment-cancelled",
    "nabil-payment-complete", "nabil-payment-declined", "online-booking",
    "online-payment", "package", "review", "story", "team", "thank-you",
    "thank-you-inquiry", "sitemap", "reviews", "luxury-trekking", "travel-guide", "our-teams", "our-team", "authors"
  ];

  return data
    .filter(({ slug }) => !excludedSlugs.includes(slug))
    .map(({ slug }) => ({ slug }));
}

// Generate metadata
export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const data = await getArticle(params.slug);

  if (!data || !data.content) {
    notFound();
  }

  const { meta, urlinfo, banner } = data.content;

  const canonicalUrl = urlinfo.canonical
    ? `${process.env.CANONICAL_BASE}${urlinfo.canonical}`
    : `${process.env.CANONICAL_BASE}${urlinfo.url_slug}`;

  return {
    title: meta.meta_title,
    description: meta.meta_description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": canonicalUrl,
      },
    },
    ...(urlinfo.url_index === 0 && {
      robots: {
        index: false,
        googleBot: {
          index: false,
        },
      },
    }),
    openGraph: {
      title: meta.meta_title,
      description: meta.meta_description,
      url: canonicalUrl,
      siteName: process.env.COMPANY_NAME,
      type: "website",
      ...(banner && {
        images: [
          {
            url: `${IMAGE_URL}${banner.full_path}`,
            width: 1920,
            height: 700,
          },
        ],
      }),
    },
  };
}

export default async function Page(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const { slug } = params;
  const data: ArticleData | null = await getArticle(slug);

  if (!data || !data.content || !data.page_type) {
    notFound();
  }

  const { page_type, content } = data;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": page_type === "blog" ? "Blog" : "Article",
    datePublished: content.published_at,
    description: content.meta.meta_description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": content.title,
    },
    headline: content.meta.meta_title,
    ...(content.banner && {
      image: [`${IMAGE_URL}${content.banner.full_path}`],
    }),
    dateModified: content.updated_at,
    author: {
      "@type": "Person",
      name:
        page_type === "blog" && content.authors.length > 0
          ? content.authors[0].name
          : "teamhimalaya",
      url:
        page_type === "blog" && content.authors.length > 0
          ? `${process.env.CANONICAL_BASE}author/${content.authors[0].urlinfo.url_slug}`
          : process.env.CANONICAL_BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "teamhimalaya",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.CANONICAL_BASE}logo.png`,
      },
    },
  };

  const PageComponent = {
    blog: Blog,
    category: Category,
    article: Article,
    package: Package
  }[page_type];

  return (
    <>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <PageComponent
        data={data}
        siteUrl={`${process.env.CANONICAL_BASE}${content.urlinfo.url_slug}`}
      />
    </>
  )
}