import { BASE_URL, IMAGE_URL } from "@/lib/constants";
import { getContentByKeyType } from "@/services/network_requests";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import dynamic from "next/dynamic";
import { Media, Meta, TeamItem, UrlInfo } from "@/types";

const PageBanner = dynamic(() => import('@/components/Banners/PageBanner'));
const TeamCard = dynamic(() => import('@/components/Card/TeamCard'));
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));



interface PageContent {
  page_title: string;
  page_description?: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
}


interface ListContentItem {
  title: string;
  members: TeamItem[];
}

interface TeamPageData {
  pagecontent: PageContent;
  listcontent: ListContentItem[];
}

export async function generateMetadata(): Promise<Metadata> {
  const data: TeamPageData | null = await getContentByKeyType("teampage");
  if (!data) {
    return {};
  }
  const { pagecontent } = data;
  const canonicalUrl = `${process.env.CANONICAL_BASE}our-team`;

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

export default async function Team() {
  const data: TeamPageData | null = await getContentByKeyType("teampage");
  if (!data) {
    return notFound();
  }

  const { listcontent, pagecontent } = data;
  const { page_title, page_description, banner } = pagecontent;

  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const filteredListContent = listcontent.filter(a => a.members.length > 0);

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={page_title} />}
      <div className=" common-box pt-0" role="main">
        <div className="container">
          <div className="page-title">
            <Breadcrumb currentPage={page_title} classes="py-3 mb-3" />
            <h1>{page_title}</h1>
          </div>

          {page_description && (
            <article
              className="common-module"
              dangerouslySetInnerHTML={{ __html: page_description }}
            ></article>
          )}

          <Tabs
            defaultValue={
              filteredListContent.length > 0 ? createSlug(filteredListContent[0].title) : undefined
            }
            className="mt-6"
          >
            <TabsList className="gap-x-2 bg-transparent mb-6">
              {filteredListContent.map((itm, idx) => {
                const { title } = itm;
                return (
                  <TabsTrigger
                    value={createSlug(title)}
                    key={idx}
                    className="px-6 text-headings/90 block rounded-md font-bold py-2 bg-primary/10 border-primary/20 text-sm uppercase data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    {title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {filteredListContent.map((itm, idx) => {
              const { title, members } = itm;
              return (
                <TabsContent value={createSlug(title)} key={idx}>
                  <ul className="grid xl:grid-cols-4 gap-6 md:grid-cols-3 sm:grid-cols-2 justify-center">
                    {members
                      .sort((a, b) => a.position_order - b.position_order)
                      .map((member) => (
                        <li key={member.id}>
                          <TeamCard data={member} />
                        </li>
                      ))}
                  </ul>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
}