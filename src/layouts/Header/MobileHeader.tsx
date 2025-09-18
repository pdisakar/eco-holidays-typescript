"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

//Import Images
import { BASE_URL } from "@/lib/constants";
import { Search } from "lucide-react";
const MobileNav = dynamic(() => import("./UI/MobileNav"), { ssr: false });

// Define types for the globalData prop
interface GlobalData {
  company_name: string;
  mobile: string;
}

// Define types for the component's props
interface MobileHeaderProps {
  setSearchActive: () => void;
  globalData: GlobalData;
}

function MobileHeader({ setSearchActive, globalData }: MobileHeaderProps) {
  const [mobileNavigationActive, setMobileNavigationActive] = useState<boolean>(false);
  const pathname = usePathname();

  const handleRouteChange = (): void => {
    setMobileNavigationActive(!mobileNavigationActive);
  };

  useEffect(() => {
    setMobileNavigationActive(false); // Close the mobile menu on route change
  }, [pathname]);

  return (
    <>
      <div className="header-sm relative z-50">
        <nav className="navbar">
          <Link
            href={BASE_URL}
            className="brand-logo text-[0] w-[165px]"
          >
            <Image
              src="/logo.png"
              alt={globalData.company_name}
              height={42}
              width={165}
            />
          </Link>
          <Link
            className="inline-block relative items-center leading-[1] ml-auto pl-10"
            href={`tel:${globalData.mobile}`}
          >
            <span className="hidden sm:block text text-headings font-bold text-base">
              {globalData.mobile}
            </span>
            <span className="hidden sm:block  font-semibold text-xs text-headings/70">
              Whatsapp, Viber
            </span>
          </Link>

          <span
            className=" text-primary ml-3 sm:ml-6 leading-3"
            onClick={setSearchActive}
          >
            <i className="icon icon h-5 w-5 sm:h-6 sm:w-6 inline-block">
              <Search />
            </i>
          </span>

          <button
            className={
              mobileNavigationActive ? "navbar-toggler in" : "navbar-toggler"
            }
            type="button"
            data-toggle="collapse"
            data-target="#nav"
            aria-controls="nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setMobileNavigationActive(!mobileNavigationActive)}
          >
            {mobileNavigationActive ? "Close" : "Menu"}
            <i className="icon h-5 w-5 ml-1 text-primary">
              <svg>
                <use href={`${BASE_URL}icons.svg#menu`} fill="currentColor" />
              </svg>
            </i>
          </button>
        </nav>

        <MobileNav
          globalData={globalData}
          handleRouteChange={handleRouteChange}
          mobileNavigationActive={mobileNavigationActive}
        />
      </div>
    </>
  );
}

export default MobileHeader;