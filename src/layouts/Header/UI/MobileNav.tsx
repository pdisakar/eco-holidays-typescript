import { BASE_URL } from "@/lib/constants";
import { MailIcon, MapPin, PhoneIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

const Collapse = dynamic(() => import("@/components/Collapse/Collapse"));

interface MenuItem {
  item_slug: string;
  item_title: string;
  children?: MenuItem[];
}

interface GlobalData {
  main_menu?: {
    menu?: MenuItem[];
  };
  mobile?: string;
  email?: string;
  address?: string;
}

interface MobileNavProps {
  globalData: GlobalData;
  mobileNavigationActive: boolean;
  handleRouteChange: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  globalData,
  mobileNavigationActive,
  handleRouteChange,
}) => {
  const url = BASE_URL;
  return (
    <>
      <div
        className={
          mobileNavigationActive
            ? "mobile-navigation mobile-navigation-active"
            : "mobile-navigation"
        }
      >
        <div className="navigation-inner">
          <ul>
            {globalData?.main_menu?.menu?.map((itm, idx) => {
              const { item_slug, item_title, children } = itm;
              return (
                <Collapse href={url + item_slug} title={item_title} key={idx}>
                  {children && children.length >= 1 && (
                    <ul>
                      {children.map((itm, idx) => {
                        const { item_slug, item_title, children } = itm;
                        return (
                          <Collapse
                            href={url + item_slug}
                            title={item_title}
                            key={idx}
                          >
                            {children && children.length >= 1 && (
                              <ul>
                                {children.slice(0, 11).map((itm, idx) => {
                                  const { item_slug, item_title } = itm;
                                  return (
                                    <Collapse
                                      href={url + item_slug}
                                      title={item_title}
                                      key={idx}
                                    />
                                  );
                                })}
                              </ul>
                            )}
                          </Collapse>
                        );
                      })}
                    </ul>
                  )}
                </Collapse>
              );
            })}
          </ul>
        </div>
        <div className="px-4">
          <Link
            className="text-white block text-center bg-primary text-md my-6 font-bold px-6 py-2 w-full rounded-full"
            href={BASE_URL + "contact-us"}
          >
            Contact Us
            <i className="icon h-5 w-5 ml-1">
              <svg>
                <use
                  href="./icons.svg#arrow-up-right-circle"
                  fill="currentColor"
                ></use>
              </svg>
            </i>
          </Link>
          <ul className="pb-6 text-headings font-medium leading-[1] text-xs">
            <li className="relative pl-6">
              <span className="icon h-4 w-4 absolute left-0 text-primary">
                <PhoneIcon />
              </span>
              +977 {globalData.mobile}
            </li>
            <li className="relative pl-6 mt-3">
              <span className="icon h-4 w-4 absolute left-0 text-primary">
                <MailIcon />
              </span>
              {globalData.email}
            </li>
            <li className="relative pl-6 mt-3">
              <span className="icon h-4 w-4 absolute left-0  text-primary">
                <MapPin />
              </span>
              {globalData.address}
            </li>
          </ul>
        </div>
      </div>
      <span
        className={mobileNavigationActive ? "navbarcloser in" : "navbarcloser"}
        onClick={handleRouteChange}
      ></span>
    </>
  );
};

export default MobileNav;