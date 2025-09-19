import Article from '@/components/Pages/Article/Article';
import Blog from '@/components/Pages/Blog';
import Category from '@/components/Pages/Category/Category';
import Package from '@/components/Pages/Package/Package';
import { IMAGE_URL } from '@/lib/constants';
import { getArticle, getStaticRoutes } from '@/services/network_requests';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';

interface Media {
  full_path: string;
  alt_text?: string;
}

interface Meta {
  meta_title: string;
  meta_description: string;
}

interface UrlInfo {
  url_slug: string;
  canonical?: string;
  url_index?: number;
}

interface BreadcrumbData {
  slug: string;
  title: string;
}


interface GenericAuthor {
  name: string;
  urlinfo: { url_slug: string };
}

interface GenericContent {
  title: string;
  published_at: string;
  updated_at: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
  authors: GenericAuthor[];
}

// Extend GenericContent to include ArticleContent-specific fields
interface ArticleContent extends GenericContent {
  page_title: string;
  page_description: string;
}

interface ArticlePageData {
  page_type: 'article';
  content: ArticleContent;
  breadcrumbs: BreadcrumbData | null;
  [key: string]: any;
}


interface CategoryContent extends GenericContent {
  description: string;
  children: any[];
  packages: any[];
  blogs: any[];
  banner: Media; 
}

interface CategoryPageData {
  page_type: 'category';
  content: CategoryContent;
  breadcrumbs: BreadcrumbData[][];
  [key: string]: any;
}



interface PackagePageData {
  page_type: 'package';
  content: GenericContent;
  [key: string]: any;
}


interface BlogAuthor {
  name: string;
  description: string;
  avatar?: Media;
  urlinfo: {
    url_slug: string;
    url_title?: string;
  };
}

interface BlogContentData {
  title: string;
  abstract: string;
  blog_date: string;
  btag: string[];
  authors: BlogAuthor[];
  banner?: Media;
  published_at: string;
  updated_at: string;
  meta: Meta;
  urlinfo: UrlInfo;
}

interface BlogPageData {
  page_type: 'blog';
  content: BlogContentData;
  tocHtml: string;
  updatedHtml: string;
  block_count: number;
  previous_blog?: any;
  next_blog?: any;
  [key: string]: any;
}


type PageData =
  | ArticlePageData
  | CategoryPageData
  | PackagePageData
  | BlogPageData;



export async function generateStaticParams() {
  const data = await getStaticRoutes();

  if (!Array.isArray(data)) return [];

  const excludedSlugs = [
    'blog',
    'booking',
    'trip-booking',
    'author',
    'contact-us',
    'checkout',
    'plan-your-trip',
    'about-us',
    'customize-trip',
    'nabil-payment-cancelled',
    'nabil-payment-complete',
    'nabil-payment-declined',
    'online-booking',
    'online-payment',
    'package',
    'review',
    'story',
    'team',
    'thank-you',
    'thank-you-inquiry',
    'sitemap',
    'reviews',
    'luxury-trekking',
    'travel-guide',
    'our-teams',
    'our-team',
    'authors',
  ];

  return data
    .filter(({ slug }) => !excludedSlugs.includes(slug))
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const data: PageData | null = await getArticle(params.slug);

  if (!data || !data.content) notFound();

  const { meta, urlinfo, banner } = data.content;

  const canonicalUrl = urlinfo.canonical
    ? `${process.env.CANONICAL_BASE}${urlinfo.canonical}`
    : `${process.env.CANONICAL_BASE}${urlinfo.url_slug}`;

  return {
    title: meta.meta_title,
    description: meta.meta_description,
    alternates: {
      canonical: canonicalUrl,
      languages: { 'x-default': canonicalUrl },
    },
    ...(urlinfo.url_index === 0 && {
      robots: { index: false, googleBot: { index: false } },
    }),
    openGraph: {
      title: meta.meta_title,
      description: meta.meta_description,
      url: canonicalUrl,
      siteName: process.env.COMPANY_NAME,
      type: 'website',
      ...(banner && {
        images: [
          { url: `${IMAGE_URL}${banner.full_path}`, width: 1920, height: 700 },
        ],
      }),
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const data: PageData | null = await getArticle(slug);

  if (!data || !data.content || !data.page_type) notFound();

  const { page_type, content } = data;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': page_type === 'blog' ? 'Blog' : 'Article',
    datePublished: content.published_at,
    description: content.meta.meta_description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': content.title },
    headline: content.meta.meta_title,
    ...(content.banner && {
      image: [`${IMAGE_URL}${content.banner.full_path}`],
    }),
    dateModified: content.updated_at,
    author: {
      '@type': 'Person',
      name:
        page_type === 'blog' && content.authors.length > 0
          ? content.authors[0].name
          : 'teamhimalaya',
      url:
        page_type === 'blog' && content.authors.length > 0
          ? `${process.env.CANONICAL_BASE}author/${content.authors[0].urlinfo.url_slug}`
          : process.env.CANONICAL_BASE,
    },
    publisher: {
      '@type': 'Organization',
      name: 'teamhimalaya',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.CANONICAL_BASE}logo.png`,
      },
    },
  };

  return (
    <>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {page_type === 'blog' && (
        <Blog
          data={data}
          siteUrl={`${process.env.CANONICAL_BASE}${content.urlinfo.url_slug}`}
        />
      )}

      {/* blog complete */}

      {page_type === 'category' && (
        <Category
          data={data}
          siteUrl={`${process.env.CANONICAL_BASE}${content.urlinfo.url_slug}`}
        />
      )}

      {page_type === 'article' && (
        <Article
          data={data}
          siteUrl={`${process.env.CANONICAL_BASE}${content.urlinfo.url_slug}`}
        />
      )}

      {page_type === 'package' && (
        <Package
          data={data}
          siteUrl={`${process.env.CANONICAL_BASE}${content.urlinfo.url_slug}`}
        />
      )}
    </>
  );
}
