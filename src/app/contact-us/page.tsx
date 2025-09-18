import dynamic from "next/dynamic";
import { getContactPage, getGlobalData } from "@/services/network_requests";
import { IMAGE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  MailOpen,
  MapPin,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { GlobalData, Media, Meta, UrlInfo } from "@/types";

const EnquireUs = dynamic(() => import("@/components/EnquireUsForm/EnquireUs"));
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));



interface PageContent {
  page_title: string;
  page_description?: string;
  meta: Meta;
  urlinfo: UrlInfo;
  banner?: Media;
}

interface ContactPageData {
  pagecontent: PageContent;
}


// Define social link structure
interface SocialLink {
  brand?: string;
  icon: JSX.Element;
  url?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const data: ContactPageData | null = await getContactPage();
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

export default async function ContactPage() {
  const [pageData, globalData]: [ContactPageData, GlobalData | null] = await Promise.all([
    getContactPage(),
    getGlobalData(),
  ]);

  if (!pageData || !globalData) {
    return notFound();
  }

  const { page_title, page_description, banner } = pageData.pagecontent;

  const social_links: SocialLink[] = [
    {
      brand: "facebook",
      icon: (<svg>
        <use xlinkHref="/icons.svg#facebook" />
      </svg>),
      url: globalData.facebook,
    },
    {
      brand: "twitter",
      icon: (
        <svg>
          <use xlinkHref="/icons.svg#twitter" />
        </svg>
      ),
      url: globalData.twitter,
    },
    {
      brand: "instagram",
      icon: (<svg>
        <use xlinkHref="/icons.svg#instagram" />
      </svg>),
      url: globalData.instagram,
    },
    {
      brand: "linkedin",
      icon: (<svg>
        <use xlinkHref="/icons.svg#linkedin" />
      </svg>),
      url: globalData.linkedin,
    },
    {
      brand: "youtube",
      icon: (
        (<svg>
          <use xlinkHref="/icons.svg#youtube" />
        </svg>)
      ),
      url: globalData.youtube,
    },
    {
      brand: "pinterest",
      icon: (<svg>
        <use xlinkHref="/icons.svg#pinterest" />
      </svg>
      ),
      url: globalData.pinterest,
    },

  ].filter(link => link.url); // Filter out links with no URL

  return (
    <>
      <div className="common-box pt-0" role="main">
        <div className="container">
          <div className="page-title mb-6">
            <Breadcrumb currentPage={page_title} classes="py-3 mb-3" />
            <h1>{page_title}</h1>
          </div>
          {page_description && (
            <article
              className="common-module"
              dangerouslySetInnerHTML={{ __html: page_description }}
            ></article>
          )}

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="contact-us lg:col-span-2">
              <div className="common-module mb0">
                <ul className="[&>li+li]:mt-4">
                  <li>
                    <div className="item flex flex-wrap leading-6">
                      <i className="icon flex-[0_0_24px] h-6 w-6 text-primary"><MapPin /></i>
                      <div className="text flex-[0_0_calc(100%_-_24px)] pl-3">
                        <span className="block font-bold text-[1.125rem]">{globalData.address}</span>
                        <span className="text-sm text-headings/70 font-bold">P.O. Box: {globalData.pobox}</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item flex flex-wrap leading-6">
                      <i className="icon flex-[0_0_24px] h-6 w-6 text-primary"><MailOpen /></i>
                      <div className="text flex-[0_0_calc(100%_-_24px)] pl-4">
                        <Link className="block font-bold text-[1.125rem] hover:text-primary" href={`mailto:${globalData.email}`}>{globalData.email}</Link>
                        <span className="text-sm text-headings/70 font-medium">Mail Us</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item flex flex-wrap leading-6">
                      <i className="icon flex-[0_0_24px] h-6 w-6 text-primary"><svg>
                        <use xlinkHref="/icons.svg#whatsapp" />
                      </svg>
                      </i>
                      <div className="text flex-[0_0_calc(100%_-_24px)] pl-4">
                        <Link className="block font-bold text-[1.125rem] hover:text-primary" href={`https://api.whatsapp.com/send?phone=${globalData.mobile}`} target="_blank">{globalData.mobile}</Link>
                        <span className="text-sm text-headings/70 font-medium">Whatsapp/Viber</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item flex flex-wrap leading-6">
                      <i className="icon flex-[0_0_24px] h-6 w-6 text-primary"><PhoneCall /></i>
                      <div className="text flex-[0_0_calc(100%_-_24px)] pl-4">
                        <Link className="block font-bold text-[1.125rem] hover:text-primary" href={`tel:${globalData.phone}`} target="_blank">{globalData.phone}</Link>
                        <span className="text-sm text-headings/70 font-medium">Call Us On</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item flex flex-wrap leading-6 pt-3">
                      <div className="text flex-[0_0_calc(100%_-_24px)] pl-4">
                        <h3 className="font-bold text-[1.125rem] mb-2">Follow us on</h3>
                        <div className={`social-media  flex items-center gap-x-1 brand-color justify-content-center [&>.facebook]:bg-facebook [&>a.facebook]:bg-facebook [&>a.twitter]:bg-twitter [&>a.pinterest]:bg-pinterest [&>a.linkedin]:bg-linkedin [&>a.youtube]:bg-youtube [&>a.tiktok]:bg-tiktok [&>a.instagram]:bg-instagram hover:[&>a]:bg-primary`}>
                          {social_links.map((link, index) => (
                            <Link href={link.url || '#'} rel="noopener noreferrer nofollow" target="_blank" key={index} aria-label={link.brand} className={`h-8 w-8 rounded inline-flex justify-center items-center text-white ${link.brand}`}>

                              <span className="icon inline-block h-5 w-5">
                                {link.icon}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-3">
              <EnquireUs
                horizontalLayout={true}
                type="Contact us"
                classes="flm-form common-module [&>.module-title>h3]:text-xl  [&>.module-title>h3]:mb-3  [&>.module-title>h3]:lg:text-2xl [&>.module-title>h3]:font-black [&>form>div>div>.form-control]:border-headings/30 [&>form>div>div>.form-control]:rounded-lg"
              />
            </div>
          </div>
          <div className="banner mt-3 relative after:absolute after:inset-0 after:bg-black/15 after:z-10 map">
            <iframe
              src={`${process.env.MAP_URL}`}
              width="100%"
              height="600"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}