import Image from "next/image";
import { getAuthorBySlug } from "@/services/network_requests";
import { IMAGE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import BlogCard from "@/components/Card/BlogCard";
import type { Metadata, ResolvingMetadata } from "next";
import { BlogItem, Media, Meta, Testimonial, UrlInfo } from "@/types";


interface AuthorDataContent {
  name: string;
  slug: string;
  avatar?: Media;
  urlinfo: UrlInfo;
  salutation?: string;
  member_address?: string;
  position?: string;
  description: string;
  meta: Meta;
  banner: Media;
  blogs: BlogItem[];
  testimonials: Testimonial[];
}

interface AuthorData {
  content: AuthorDataContent;
}

interface GenerateMetadataProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: GenerateMetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const data: AuthorData | null = await getAuthorBySlug(params.slug);
  if (!data) {
    return {};
  }
  const { content } = data;
  const canonicalUrl = `${process.env.CANONICAL_BASE}author/${content.urlinfo.url_slug}`;

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
      type: "profile",
      images: content.avatar
        ? [
            {
              url: IMAGE_URL + content.avatar.full_path,
              width: 250,
              height: 250,
              alt: content.avatar.alt_text || content.name,
            },
          ]
        : [],
    },
  };
}

export default async function Slug(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const response: AuthorData | null = await getAuthorBySlug(params.slug);

  if (!response || !response.content) {
    return notFound();
  }

  const { content: data } = response;

  const {
    name,
    avatar,
    description,
    blogs,
  } = data;

  return (
    <>
      <div
        className="pt-0 pb-0 common-box"
        role="main"
      >
        <div className="container">
          <div className="lg:w-9/12 lg:mx-auto">
            <div className="page-title pt-8 pb-6">
              <h1>{name}</h1>
            </div>
            <div className="team-list common-module mb-0 text-left">
              <div className="item">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3">
                    <div className="image-slot rounded-full before:pt-[100%] shadow shadow-primary/20">
                      {avatar ? (
                        <Image
                          src={IMAGE_URL + avatar.full_path}
                          alt={avatar.alt_text || name}
                          width={300}
                          height={300}
                          className="rounded"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="intro-text">
                      <div className="item-body">
                        <article
                          className="common-module"
                          dangerouslySetInnerHTML={{ __html: description }}
                        ></article>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {blogs?.length !== 0 && (
            <div className="common-module mb-0">
              <div className="lg:w-9/12 lg:mx-auto">
                <div className="title">
                  <h2>
                    Recent Blog by <i>{name}</i>
                  </h2>
                </div>
              </div>
              <div className="common-module mb-0">
                <div className="blog-list">
                  <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs?.map((itm, idx) => (
                      <li key={idx}>
                        <BlogCard blogData={itm} autherPage={true} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}