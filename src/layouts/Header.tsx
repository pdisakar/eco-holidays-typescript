"use client";
import { useState } from "react";
import KeySearch from "@/components/KeySearch/KeySearch";
import DesktopHeader from "./Header/DesktopHeader";
import MobileHeader from "./Header/MobileHeader";
import Notification from "@/components/Notification";
import { GlobalData } from "@/types";


type HeaderProps = {
  globalData: GlobalData;
};

function Header({ globalData }: HeaderProps) {
  const [isActive, setActive] = useState(false);

  const setSearchActive = () => {
    setActive(true);
  };

  const discardSearch = () => {
    setActive(false);
  };


  return (
    <header id="header">
      <Notification />
      {isActive && <KeySearch {...{ discardSearch, isActive }} />}
      <DesktopHeader {...{ globalData, setSearchActive }} />
      <MobileHeader {...{ globalData, setSearchActive }} />
    </header>
  );
}

export default Header;
