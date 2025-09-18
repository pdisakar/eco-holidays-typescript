"use client";
import { IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
export default function ImageTripMap({ renderData, package_title }) {
  return (
    <div className="package-section" id="map">
      <div className="common-module !mb-0">
        <div className="module-title flex-wrap two-col">
          <div>
            <h2 className="text-lg md:text-xl lg:text-[1.675rem] font-secondary font-normal ">Route Map</h2>
          </div>
          <div>
            <button
              onClick={() => {
                const imageUrl = `/api/download?url=${encodeURIComponent(
                  IMAGE_URL + renderData
                )}&filename=${encodeURIComponent(
                  package_title + "-route-map.jpg"
                )}`;
                window.location.href = imageUrl; // Triggers the download
              }}
              type="button"
              //target="_blank"

              className="border-2 inline-flex gap-x-1 border-secondary text-secondary font-semibold rounded text-md px-5 py-2 hover:bg-secondary hover:text-white cursor-pointer"
            >
              <svg
                className="inline-block"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              Download
            </button>
          </div>
        </div>
        <div className="custom-scroll-bar shadow-base rounded-md max-h-[500px] overflow-y-auto">
          <figure className="shadow-base image-slot rounded before:pt-[141.47368421%]">
          <Image
            loading="lazy"
            decoding="async"
            src={IMAGE_URL + renderData}
            height={1194}
            width={860}
            alt={package_title + " Map"}
            //className="mt-[-110px]"
          />
        </figure>
        </div>
      </div>
    </div>
  );
}
