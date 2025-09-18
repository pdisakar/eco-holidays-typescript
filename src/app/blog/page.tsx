import dynamic from "next/dynamic";
import { getBlogPage } from "@/services/network_requests";
import { IMAGE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import BlogList from "@/components/Pages/Blog/blogListing";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import { Media, Meta, UrlInfo } from "@/types";

const PageBanner = dynamic(() => import("@/components/Banners/PageBanner"));



interface PageContent {
  page_title: string;
  page_description?: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
}

interface BlogPageData {
  pagecontent: PageContent;
  // You might have other properties here, like a list of blog posts
  // listcontent: BlogItem[];
}

export async function generateMetadata(): Promise<Metadata> {
  const data: BlogPageData | null = await getBlogPage();
  if (!data) {
    return {};
  }
  const { pagecontent } = data;
  const canonicalUrl = `${process.env.CANONICAL_BASE}${pagecontent.urlinfo.url_slug}`;

  return {
    title: pagecontent.meta.meta_title,
    description: pagecontent.meta.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pagecontent.meta.meta_title,
      description: pagecontent.meta.meta_description,
      url: canonicalUrl,
      images: pagecontent.banner
        ? [
            {
              url: IMAGE_URL + pagecontent.banner.full_path,
              width: 1650,
              height: 600,
              alt: pagecontent.meta.meta_title,
            },
          ]
        : [],
    },
  };
}

export default async function Blog() {
  const data: BlogPageData | null = await getBlogPage();
  if (!data) {
    return notFound();
  }


  const { pagecontent } = data;
  const { banner, page_title, page_description } = pagecontent;

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={page_title} />}
      <div className="common-box pt-0 pb-0">
        <div className="container">
          <div className="lg:w-9/12 lg:mx-auto">
            <div className="page-title mt-10 mb-6">
              <Breadcrumb data={[]} currentPage={page_title} classes="mb-1.5" />
              <h1>{page_title}</h1>
            </div>

            {page_description && (
              <article
                className="common-module"
                dangerouslySetInnerHTML={{ __html: page_description }}
              ></article>
            )}
          </div>
        </div>
        <BlogList data={data} />
      </div>
    </>
  );
}