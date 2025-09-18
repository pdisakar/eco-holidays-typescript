"use client";
import { IMAGE_URL } from "@/lib/constants";
import SmartSearch from "../SmartSearch/SmartSearch";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { ReactNode } from "react";
import { Media } from "@/types";
import { useGlobalData } from "@/context/globalContext";

interface BannerProps {
  video?: boolean;
  single?: boolean;
  children?: ReactNode;
  renderData?: Media;
  className?: string;
}

export default function Banner({
  video,
  single,
  children,
  renderData,
  className,
}: BannerProps) {
  const {globalData} = useGlobalData()
  return (
    <section
      className={cn(
        "banner relative after:absolute after:inset-0 after:bg-black/15 after:z-10",
        className
      )}
    >
      {single && renderData && (
        <figure className="image-slot before:pt-[52.45833333%] sm:before:pt-[46.45833333%] md:before:pt-[42.45833333%] lg:before:pt-[39.0625%]">
          <Image
            src={IMAGE_URL + renderData.full_path}
            alt={renderData.alt_text ? renderData.alt_text : "Eco Holidays Nepal"}
            height={700}
            width={1920}
            priority
            sizes="100vw"
          />
        </figure>
      )}
      {video && (
        <div className="w-full h-[85vh] overflow-hidden hidden lg:block relative">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/branding.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30 z-10" />
        </div>
      )}
      <div className="banner-caption absolute bottom-[15%] inset-x-0 z-20 text-left flex items-center justify-center flex-col">
        <div className="container">
          <div className="inner-wrap leading-[1.25] max-w-[750px] mx-auto">
            <span className="subtitle hidden mb-3 sm:block tex-xs text-white drop-shadow font-medium pb-2.5">
                  4.5<i className="ratings__5"></i>
                  {globalData?.ta_review_count} Google reviews
            </span>
            <h2 className="brand-heading uppercase font-extrabold text-white text-[1.5rem] md:text-[1.75rem] lg:text-4xl xl:text-[52px] drop-shadow leading-[1]">
              {renderData?.caption}
            </h2>
            <SmartSearch className="mt-6 max-w-[85%]" />
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}