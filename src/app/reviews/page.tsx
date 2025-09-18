import ReviewList from "@/components/Pages/Review/ReviewList";
import PageBanner from "@/components/Banners/PageBanner";
import { getContentByKeyType } from "@/services/network_requests";
import { IMAGE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import { Media, Meta, UrlInfo } from "@/types";

interface PageContent {
  page_title: string;
  page_description?: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
}

interface TestimonialPageData {
  pagecontent: PageContent;
  listcontent: any[];
  testimonials_count: number
}

export async function generateMetadata(): Promise<Metadata> {
  const data: TestimonialPageData | null = await getContentByKeyType("testimonialpage");
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

export default async function Testimonial() {
  const data: TestimonialPageData | null = await getContentByKeyType("testimonialpage?_limit=6");

  if (!data) {
    return notFound();
  }

  const { page_title, page_description, banner } = data.pagecontent;
  const { listcontent, testimonials_count } = data;

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={page_title} />}
      <div className="common-box">
        <div className="container">
          <div className="col-xl-9 mx-auto">
            <div className="page-title text-center">
              <Breadcrumb
                currentPage={page_title}
                classes="[&>.breadcrumb]:justify-center"
              />
              <h1>{page_title}</h1>
            </div>

            {page_description && (
              <article
                className="common-module"
                dangerouslySetInnerHTML={{ __html: page_description }}
              ></article>
            )}
          </div>
          <ReviewList data={listcontent} testimonials_count={testimonials_count} />
        </div>
      </div>
    </>
  );
}