import Image from "next/image";
import Link from "next/link";
import FancyBox from "@/components/FancyBox";
import { getTeamMember } from "@/services/network_requests";
import { IMAGE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Media, Meta, Testimonial, UrlInfo } from "@/types";

// Define interfaces for type-checking the data from the API


interface CarouselItem {
  full_path: string;
  alttext: string;
  title: string;
  caption: string;
  short_description?: string;
}

interface Carousel {
  content: CarouselItem[];
}

interface TeamMemberDataContent {
  name: string;
  slug: string;
  avatar?: Media;
  urlinfo: UrlInfo;
  salutation?: string;
  full_name: string;
  member_address?: string;
  position: string;
  description: string;
  meta: Meta;
  carousel?: Carousel;
  banner?: Media;
  testimonials?: Testimonial[];
}

interface TeamMemberData {
  content: TeamMemberDataContent;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const data: TeamMemberData | null = await getTeamMember(params.slug);
  if (!data) {
    return {};
  }
  const { content } = data;
  const canonicalUrl = `${process.env.CANONICAL_BASE}our-team/${content.urlinfo.url_slug}`;

  return {
    title: content.meta.meta_title,
    description: content.meta.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: content.meta.meta_title,
      description: content.meta.meta_description,
      url: canonicalUrl,
      images: content.avatar
        ? [
            {
              url: IMAGE_URL + content.avatar.full_path,
              width: 250,
              height: 250,
              alt: content.avatar.alt_text || content.full_name,
            },
          ]
        : [],
    },
  };
}

export default async function Slug(props: PageProps) {
  const params = await props.params;
  const response: TeamMemberData | null = await getTeamMember(params.slug);
  const data = response?.content;
  if (!data) {
    return notFound();
  }

  const { full_name, avatar, position, description, carousel } = data;

  return (
    <>
      <div className="pt-0 common-box" role="main">
        <div className="container">
          <div className="lg:w-9/12 lg:mx-auto">
            <div className="title pt-8">
              <p className="text-primary mb-0 font-medium">{position}</p>
              <div className="title">
                <h1 className="text-4xl">{full_name}</h1>
              </div>
            </div>
            <div className="team-list common-module mb-0 text-left">
              <div className="item">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3">
                    <div className="image-slot rounded-full before:pt-[100%] shadow shadow-primary/20">
                      {avatar && (
                        <Image
                          src={IMAGE_URL + avatar.full_path}
                          alt={avatar.alt_text || full_name}
                          width={250}
                          height={250}
                          className="rounded"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="intro-text">
                      <div className="item-body">
                        <article
                          className={
                            carousel ? "common-module" : "common-module mb-0"
                          }
                          dangerouslySetInnerHTML={{ __html: description }}
                        ></article>

                        {carousel && (
                          <div className="gallery">
                            <h2 className="module-title">
                              Awards and Certificates
                            </h2>
                            <ul className="row">
                              {carousel.content.map((itm, idx) => (
                                <li key={idx} className="col-lg-4 col-sm-6">
                                  <FancyBox>
                                    <div className="item">
                                      <figure
                                        data-src={IMAGE_URL + itm.full_path}
                                        data-fancybox="images"
                                        data-caption={itm.title}
                                      >
                                        <Image
                                          className="fill"
                                          src={IMAGE_URL + itm.full_path}
                                          alt={itm.alttext}
                                          layout="responsive"
                                          height={300}
                                          width={300}
                                        />
                                        <figcaption>
                                          <h3>{itm.caption}</h3>
                                          {itm.short_description && (
                                            <p>{itm.short_description}</p>
                                          )}
                                        </figcaption>
                                      </figure>
                                    </div>
                                  </FancyBox>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="load-more-btn">
                      <Link
                        href="/our-team"
                        className="btn text-base border-0 font-bold rounded-lg px-5 py-2.5 btn-primary"
                      >
                        Back to Team
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}