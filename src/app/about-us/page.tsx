import dynamic from "next/dynamic";
import { getContentByKeyType } from "@/services/network_requests";
import { notFound } from "next/navigation";
import { IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Media, Meta, TeamItem, UrlInfo } from "@/types";

const TeamCard = dynamic(() => import("@/components/Card/TeamCard"));
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));
const PageBanner = dynamic(() => import("@/components/Banners/PageBanner"));
const FeaturedReview = dynamic(() =>
  import("@/components/FeaturedReview/FeaturedReview")
);

interface PageContent {
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
  page_title: string;
  page_description: string;
    children?: ReactNode;
}

interface ContentData {
  pagecontent: PageContent;
  featured_reviews: any[];
  featured_members: TeamItem[];
}

export async function generateMetadata(): Promise<Metadata> {
  const data: ContentData | null = await getContentByKeyType("aboutpage");

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

export default async function About() {
  const data: ContentData | null = await getContentByKeyType("aboutpage");

  if (!data) {
    return notFound();
  }

  const { pagecontent, featured_reviews, featured_members } = data;
  const { page_title, page_description, banner } = pagecontent;

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={page_title} />}

      <section className="common-box pt-0 ">
        <div className="container">
          <div className="lg:w-9/12 mx-auto">
            <div className="page-title mt-10 mb-6">
              <Breadcrumb data={[]} currentPage={page_title} classes="mb-1.5" />
              <h1>{page_title}</h1>
            </div>

            <article
              className="common-module"
              dangerouslySetInnerHTML={{
                __html: page_description,
              }}
            ></article>
          </div>
        </div>
      </section>
      <FeaturedReview
        renderData={featured_reviews}
        title="Traveller Feedback"classes="common-box featured-testimonial bg-secondary before:-z-10 before:inset-0 before:absolute before:bg-[url('/path-pattern.png')] before:bg-repeat before:opacity-10 z-10"
      />

      <section className="common-box bg-white">
        <div className="container">
          <div className="title text-center">
            <h2>Get Expert Advice</h2>
          </div>
          <div className="lg:w-8/12 mx-auto">
            <div className="team-list about">
              <ul className="grid items-center justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                {featured_members &&
                  featured_members
                    .sort((a, b) => a.position_order - b.position_order)
                    ?.map((itm) => {
                      return (
                        <li
                          key={itm.id}
                          className="[&>.item]:items-center [&>.item]:text-center"
                        >
                          <TeamCard data={itm} isAbout={true} />
                        </li>
                      );
                    })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}