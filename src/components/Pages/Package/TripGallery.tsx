import { IMAGE_URL } from "@/lib/constants";
import FancyBox from "../../FancyBox";
import Image from "next/image";
import { Images } from "lucide-react";
import { Media } from "@/types";

interface TripGalleryProps {
  renderData: Media[];
}

const getGalleryClass = (dataLength: number): string => {
  if (dataLength > 2) {
    return "grid grid-cols-4 gap-0.5 md:grid-cols-10 [&>div]:col-span-2 md:[&>div]:col-span-3 [&>div:nth-child(1)]:col-span-4 md:[&>div:nth-child(1)]:col-span-7 md:[&>div:nth-child(1)]:row-span-2 [&>div:nth-child(n+4)]:hidden";
  }
  if (dataLength === 2) {
    return "grid grid-cols-2 gap-0.5 [&>div:nth-child(n+3)]:hidden";
  }
  return "";
};

export default function TripGallery({ renderData }: TripGalleryProps) {
  const galleryData = renderData;
  const galleryClass = getGalleryClass(galleryData?.length || 0);

  return (
    <div className="drop-shadow-base mt-6 rounded-xl  overflow-hidden relative">

      <FancyBox>
        <div className={galleryClass}>
          {galleryData?.map((itm, idx) => (
            <div className="grid-item item" key={idx}>
              <figure className="h-full relative">
                <span
                  className="image-slot max-h-[550px] h-full before:pt-[57.25%]"
                  data-fancybox="gallery"
                  data-src={IMAGE_URL + itm.full_path}
                  data-caption={itm.caption}
                >
                  <Image
                    src={IMAGE_URL + itm.full_path}
                    height={idx === 0 ? 506 : 225}
                    width={idx === 0 ? 900 : 500}
                    priority
                    alt={itm.alt_text?itm.alt_text:''}
                    sizes={`(max-width: ${idx === 0 ? 900 : 500}px) 100vw, ${idx === 0 ? 900 : 500
                      }px`}
                  />
                </span>
                {/* <figcaption className="absolute inset-x-0 bottom-0 text-white z-10 font-bold p-6 text-[1.125rem] drop-shadow-md">
                  {itm.caption}
                </figcaption> */}
              </figure>
            </div>
          ))}
        </div>
      </FancyBox>
      {galleryData && galleryData.length > 1 && (
        <button
          type="button"
          className="btn mt-3 bg-white absolute bg-white/80 py-1 rounded-full text-primary border-0 px-1.5 md:px-3 z-10 right-3 bottom-3 md:right-6 md:bottom-6 text-[10px] md:text-xs decoration-primary"
          data-fancybox-trigger="gallery"
          data-fancybox-index="1"
        >
          <i className="icon h-4 w-4 inline-block mr-1 align-middle">
            <Images />
          </i>
          View All ({galleryData.length})
        </button>
      )}
    </div>
  );
}