import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
const MainNav = dynamic(() => import("./UI/MainNav"));

import { BASE_URL } from "@/lib/constants";
import Info from "./UI/Info";
import { GlobalData } from "@/types";


interface DesktopHeaderProps {
  setSearchActive: (active: boolean) => void;
  globalData: GlobalData;
}
const DesktopHeader: React.FC<DesktopHeaderProps> = ({ setSearchActive, globalData }) => {
  return (
    <>
      <div className="" id="desktop-header" data-sticky="true">
        <div className="middle-bar py-3">
          <div className="container">
            <div className="flex  justify-between items-center">
              <Link
                href={BASE_URL}
                className="navbar-brand text-[0] max-w-[233px]"
              >
                <Image
                  src="/logo.png"
                  alt={globalData.company_name}
                  height={60}
                  width={233}
                />
              </Link>
              <div className="header-middle-bar-right px-3">
                <Info
                  taLink={globalData.trip_advisor}
                  phone={globalData.phone}
                  email={globalData.email}
                  avatar={globalData.avatar}
                  avatarAlt={globalData.contact_persion}
                />
              </div>
            </div>
          </div>
        </div>
        <nav className="navbar border-t border-t-border flex items-center relative" id="main-menu">
          <div className="container">

            <ul className="navbar-nav relative lg:flex lg:items-center justify-center w-full" id="mainnav">
              <MainNav menuData={globalData?.main_menu?.menu ?? []} />
              <li className="nav-item text-0 leading-[0] ">
                <button
                  type="button"
                  onClick={() => setSearchActive(true)}
                  className="text-0 pl-1.5 lg:pl-2 xl:pl-2.5 leading-[0]  text-navbar"
                >
                  <i className="icon h-5 w-5 inline-block">
                    <svg><use xlinkHref="/icons.svg#search" /></svg>
                  </i>
                </button>
              </li>
            </ul>
          </div>

        </nav>
      </div>
    </>
  );
};


export default DesktopHeader;
