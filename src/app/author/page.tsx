import PageBanner from "@/components/Banners/PageBanner";
import { IMAGE_URL } from "@/lib/constants";
import { getContentByKeyType } from "@/services/network_requests";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import AuthorCard from "@/components/Card/AuthorCard";
import type { Metadata } from "next";
import { Media, Meta, UrlInfo } from "@/types";

interface PageContent {
  page_title: string;
  page_description?: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
}

interface Author {
  id: number;
  author_blog_count: number;
}

interface ContentData {
  pagecontent: PageContent;
  listcontent: Author[];
}

export async function generateMetadata(): Promise<Metadata> {
  const data: ContentData | null = await getContentByKeyType("authorpage");
  if (!data) {
    return {};
  }
  const { pagecontent } = data;
  const canonicalUrl = `${process.env.CANONICAL_BASE}author`;

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

export default async function Page() {
  const data: ContentData | null = await getContentByKeyType("authorpage");
  if (!data) {
    return notFound();
  }

  const { listcontent, pagecontent } = data;
  const { page_title, page_description, banner } = pagecontent;

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={page_title} />}
      <div className=" common-box pt-0 border-t border-t-border" role="main">
        <div className="container">
          <div className="page-title  py-10">
            <Breadcrumb currentPage={page_title} />
            <h1>{page_title}</h1>
          </div>

          {page_description && (
            <article
              className="common-module"
              dangerouslySetInnerHTML={{ __html: page_description }}
            ></article>
          )}

          <ul className="grid xl:grid-cols-4 gap-6 md:grid-cols-3 sm:grid-cols-2 justify-center">
            {listcontent
              .sort((a, b) => b.author_blog_count - a.author_blog_count)
              .map((itm) => (
                <li key={itm.id}>
                  <AuthorCard data={itm} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}