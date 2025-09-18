
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BASE_URL } from "../lib/constants";
import { MenuItem, GlobalData } from "@/types";
import CertificatesnPartners from "@/components/CertificatesnPartners";
import Destination from "./Footer/Destinations";

const Newsletter = dynamic(() => import("./Footer/Newsletter"));

const NavItem: React.FC<{ data: MenuItem }> = ({ data }) => {
  return (
    <>
      <h3 className="uppercase mb-7 font-semibold text-headings text-[1.25rem] font-secondary">
        {data.item_title}
      </h3>
      <ul className="grid grid-cols-2 gap-x-6 [&>li+li]:mt-2 [&>li>a]:text-pretty [&>li>a]:inline-block [&>li>a]:text-headings [&>li>a]:text-md hover:[&>li>a]:text-secondary font-secondary hover:[&>li>a]:underline">
        {data.children?.map((item) => (
          <li key={item.id}>
            <Link href={BASE_URL + item.item_slug}>{item.item_title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};


const Footer: React.FC<{ globalData: GlobalData }> = ({ globalData }) => {
  const data = globalData;

  const social_links = [
    {
      brand: "facebook",
      icon: (<svg>
        <use xlinkHref="/icons.svg#facebook" />
      </svg>),
      url: data.facebook,
    },
    {
      brand: "twitter",
      icon: (
        <svg>
          <use xlinkHref="/icons.svg#twitter" />
        </svg>
      ),
      url: data.twitter,
    },
    {
      brand: "instagram",
      icon: (<svg>
        <use xlinkHref="/icons.svg#instagram" />
      </svg>),
      url: data.instagram,
    },
    {
      brand: "linkedin",
      icon: (<svg>
        <use xlinkHref="/icons.svg#linkedin" />
      </svg>),
      url: data.linkedin,
    },
    {
      brand: "youtube",
      icon: (
        (<svg>
          <use xlinkHref="/icons.svg#youtube" />
        </svg>)
      ),
      url: data.youtube,
    },
    {
      brand: "pinterest",
      icon: (<svg>
        <use xlinkHref="/icons.svg#pinterest" />
      </svg>
      ),
      url: data.pinterest,
    },
  ];
  return (
    <footer className="relative z-10" id="footer">
      <div className="background absolute inset-0 -z-10">
        <Image
          src="/background-image.jpg"
          alt={data.company_name ? data.company_name : "Eco Holidays"}
          fill
          objectFit="cover"
        />
      </div>
      <div className="container">
        <Newsletter
          title="Subscribe <b>Newsletter</b>"
          subTitle="To receive travel news, updates and offers via email."
          btnLabel="SUBSCRIBE"
        />
        <div className="common-box">
          <div className="grid md:grid-cols-6 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="footer-contact">
                <h3 className="uppercase mb-7 font-semibold text-headings text-[1.25rem] font-secondary">{data?.company_name}</h3>
                <ul className="[&>li+li]:mt-3.5">
                  <li className="pl-[45px] reqative leading-[1.5] text-headings font-semibold">
                    <svg height={22} width={22} className="text-secondary absolute left-0"><use xlinkHref="/icons.svg#map-marker" /></svg>
                    {data?.address}
                    <span className="block text-muted text-xs font-medium">Head Office</span>
                  </li>
                  <li className="pl-[45px] reqative leading-[1.5] text-headings font-semibold">
                    <svg height={22} width={22} className="text-secondary absolute left-0"><use xlinkHref="/icons.svg#phone" /></svg>
                    <a href={`tel:+977${data?.phone}`}>+977 {data?.phone}</a>

                    <span className="block text-muted text-xs font-medium">Call Us</span>
                  </li>

                  <li className="pl-[45px] reqative leading-[1.5] text-headings font-semibold">
                    <svg height={22} width={22} className="text-secondary absolute left-0"><use xlinkHref="/icons.svg#envelope-open" /></svg>
                    <Link href={`mailto:${data?.email}`}>
                      {data?.email}
                    </Link>
                    <span className="block text-muted text-xs font-medium">Mail Us</span>
                  </li>
                  <li className="pl-[45px] reqative leading-[1.5] text-headings font-semibold">
                    <div className="social-media flex items-center brand-color-bg [&>a]:h-8 [&>a]:w-8 [&>a]:rounded [&>a]:flex
                     [&>a]:text-white [&>a]:items-center [&>a]:justify-center [&>a]:mr-2.5 last:[&>a]:mr-0 [&>a>.icon]:h-4 [&>a>.icon]:w-4
                     [&>.facebook]:bg-[#3b5998] [&>.twitter]:bg-twitter [&>.instagram]:bg-instagram [&>.pinterest]:bg-pinterest [&>.youtube]:bg-youtube [&>.linkedin]:bg-linkedin
                     [&>a]:hover:translateY[-5px] [&>a]:transition-all">
                      {social_links?.map((itm, idx) => {
                        return (
                          <a
                            href={itm.url}
                            rel="nofollow noreferrer"
                            target="_blank"
                            key={idx}
                            className={`${itm.brand}`}
                          >
                            <span className="icon">{itm.icon}</span>
                          </a>
                        );
                      })}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-span-3 md:px-4">
              <h3 className="uppercase mb-7 font-semibold text-headings text-[1.25rem] font-secondary">Destinations</h3>
              <Destination />
            </div>
            <div className="lg:col-span-5 md:col-span-3">
              {data?.footer_menu?.menu?.slice(0, 2).map((itm) => {
                const { id, item_title, item_slug, children } = itm;
                return (
                  <NavItem key={id} data={itm} />
                );
              })}
            </div>
          </div>
        </div>
        <CertificatesnPartners title="CERTIFICATES & PARTNERS" className="common-box pt-0" />

        <div className="footer-bottom py-8 text-white/70 text-center relative before:inset-x-[-9999px] before:inset-y-0 before:bg-[#001114] before:absolute  before:-z-10">
          <div className="copy-right">
            All content and photography within our website is copyright
            &amp; may not be reproduced without our permission. Most of the
            photographs of this website are provided by Professional
            Photographers. &copy; {new Date().getFullYear()},{" "}
            <b>{data?.company_name} Pvt. Ltd</b>.
          </div>
          <Link className="icon w-[180px] mt-5 lg:w-[250px]" href="/custom-booking"><Image src="/payment.png" alt="We Accept" width="302" height="33" /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
