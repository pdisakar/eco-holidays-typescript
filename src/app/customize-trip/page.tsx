import PageBanner from "@/components/Banners/PageBanner";
import EnquireUs from "@/components/EnquireUsForm/EnquireUs";
import { IMAGE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import { getCostomizePage, getOptionsData } from "@/services/network_requests";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import { Media, Meta, UrlInfo } from "@/types";

interface PageContent {
  page_description?: string;
  meta: Meta;
  page_title: string;
  urlinfo: UrlInfo;
  banner?: Media;
}

interface CustomizePageData {
  content: PageContent;
}

interface OptionsData {
  package: any[];
}

interface CustomizeFormProps {
  searchParams: Promise<{
    _trip?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const data: CustomizePageData | null = await getCostomizePage();
  if (!data) {
    return {};
  }
  const { content } = data;
  const canonicalUrl = `${process.env.CANONICAL_BASE}${content.urlinfo.url_slug}`;

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
      images: content.banner
        ? [
            {
              url: IMAGE_URL + content.banner.full_path,
              width: 1650,
              height: 600,
              alt: content.meta.meta_title,
            },
          ]
        : [],
    },
  };
}

export default async function CustomizeForm(props: CustomizeFormProps) {
  const searchParams = await props.searchParams;
  const [data, optionsData]: [CustomizePageData | null, OptionsData | null] = await Promise.all([
    getCostomizePage(),
    getOptionsData(),
  ]);

  if (!data || !optionsData) {
    return notFound();
  }

  const { page_description, page_title, banner } = data.content;
  const packages = optionsData.package;

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={page_title} />}
      <div className="common-box pt-0 pb-0" role="main">
        <div className="container">
          <div className="w-9/12 mx-auto">
            <div className="page-title mb-6">
              <Breadcrumb data={[]} currentPage={page_title} classes="py-3 mb-3" />
              <h1>{page_title}</h1>
            </div>

            {page_description && (
              <article
                className="common-module"
                dangerouslySetInnerHTML={{ __html: page_description }}
              ></article>
            )}

            <EnquireUs
              hasTripName
              horizontalLayout
              haslabel
              packages={packages}
              defaultPackage={searchParams._trip}
              type="Customize Trip"
              classes="flm-form bg-white shadow-base p-6 lg:p-8 rounded [&>.module-title>h3]:text-xl  [&>.module-title>h3]:mb-3  [&>.module-title>h3]:lg:text-2xl [&>.module-title>h3]:font-black [&>form>div>div>.form-control]:border-headings/30 [&>form>div>div>.form-control]:rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}