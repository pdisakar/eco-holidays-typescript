"use client";

import { useGlobalData } from "@/context/globalContext";
import { X } from "lucide-react";
import { useState } from "react";

export default function Notification() {
  const [active, setActive] = useState(true)
  const { globalData } = useGlobalData();

  return (
    active && globalData.notification && (
      <div className="bg-headings leading-[1.3] tracking-wide font-secondary gap-x-1 text-xs py-2.5 px-[.9375rem]  text-white/90 flex items-center justify-center">
        <svg className="h-5 w-5 hidden md:inline-block"><use xlinkHref="/icons.svg#zap" /></svg>
        <div
          className="notification text-center  [&>a]:text-primary [&>a]:underline [&>a]:ml-1"
          dangerouslySetInnerHTML={{ __html: globalData.notification }}
        ></div>
        <i onClick={() => setActive(false)} className="close bg-secondary h-6 w-6 rounded-full text-white inline-flex items-center justify-center absolute right-[5%] p-1 cursor-pointer hover:bg-warning transition-all"><X  height="16px" width="16px"/></i>
      </div>
    )
  );
}
