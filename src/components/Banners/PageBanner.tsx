import { IMAGE_URL } from "@/lib/constants";
import { Media } from "@/types";
import Image from "next/image";
import React, { ReactNode } from "react";

// Define the props interface for the PageBanner component.
interface PageBannerProps {
  children?: ReactNode; // 'children' can be any valid React node.
  renderData: Media; // 'renderData' is a required prop of type RenderData.
  pageTitle: string; // 'pageTitle' is a required string.
  subTitle?: string; // 'subTitle' is an optional string.
  defaultBanner?: string; // 'defaultBanner' is an optional string.
  bannerImage?: string; // 'bannerImage' is an optional string.
}

// Convert the component to TSX by adding the props interface.
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