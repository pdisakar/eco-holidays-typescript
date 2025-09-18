import "react-datepicker/dist/react-datepicker.css";

import PageBanner from "@/components/Banners/PageBanner";
import EnquireUs from "@/components/EnquireUsForm/EnquireUs";
import { notFound } from "next/navigation";
import { getOptionsData, getContentByKeyType } from "@/services/network_requests";
import Breadcrumb from "@/components/Breadcrumb";

type CustomizeFormProps = {
  searchParams?: {
    _trip?: string;
  };
};

type PageContent = {
  page_description?: string;
  meta?: Record<string, unknown>;
  page_title: string;
  urlinfo?: string;
  banner?: unknown; // adjust type if banner has a shape
};

type BookingPageResponse = {
  pagecontent: PageContent;
};

type OptionsData = {
  package: unknown[]; // replace `unknown[]` with your actual package type if available
};

export async function generateMetadata() {
  return {
    title: "Book Your Customized Trip | Tailor Your Adventure",
    description:
      "Create your perfect travel experience. Customize your trip to suit your preferences and explore the himalayas on your terms.",
    openGraph: {
      title: "Book Your Customized Trip | Tailor Your Adventure",
      description:
        "Create your perfect travel experience. Customize your trip to suit your preferences and explore the himalayas on your terms.",
    },
    robots: {
      index: false,
      follow: false,
      nocache: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: false,
      },
    },
  };
}

export default async function CustomizeForm({ searchParams }: CustomizeFormProps) {
  const data = (await getContentByKeyType("bookingpage")) as BookingPageResponse | null;
  const optionsData = (await getOptionsData()) as OptionsData;
  if (!data) {
    return notFound();
  }

  const packages = optionsData.package;
  const { page_description, page_title, banner } = data.pagecontent;

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={page_title} />}
      <div className="common-box pt-0 pb-0" role="main">
        <div className="container">
          <div className="w-9/12 mx-auto">
            <div className="page-title pt-10 mb-6">
              <Breadcrumb currentPage={page_title} />
              <h1>{page_title}</h1>
            </div>

            {page_description && (
              <article
                className="common-module"
                dangerouslySetInnerHTML={{ __html: page_description }}
              />
            )}

            <EnquireUs
              hasTripName
              horizontalLayout
              haslabel
              packages={packages}
              defaultPackage={searchParams?._trip}
              type="Customize Trip"
              classes="flm-form bg-white shadow-base p-6 lg:p-8 rounded [&>.module-title>h3]:text-xl  [&>.module-title>h3]:mb-3  [&>.module-title>h3]:lg:text-2xl [&>.module-title>h3]:font-black [&>form>div>div>.form-control]:border-headings/30 [&>form>div>div>.form-control]:rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
