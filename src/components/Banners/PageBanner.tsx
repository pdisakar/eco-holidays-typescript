import { IMAGE_URL } from "@/lib/constants";
import { Media } from "@/types";
import Image from "next/image";
import React, { ReactNode } from "react";

interface PageBannerProps {
  children?: ReactNode; 
  renderData: Media; 
  pageTitle: string; 
  subTitle?: string;
  defaultBanner?: string; 
  bannerImage?: string; 
}

export default function PageBanner({
  children,
  renderData,
  pageTitle,
}: PageBannerProps) {
  return (
    <section className="banner relative after:absolute after:inset-0 after:bg-black/25 after:z-10">
     
      <figure className="image-slot before:pt-[52.458333%] md:before:pt-[42.458333%] lg:before:pt-[39.0625%]">
        <Image
          src={IMAGE_URL + renderData.full_path}
          alt={renderData.alt_text ? renderData.alt_text : pageTitle}
          height={625}
          width={1600}
          quality={100}
          priority
          sizes="100vw"
        />
      </figure>

      {children}
    </section>
  );
}