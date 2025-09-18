"use client";

import { useState, useMemo, useCallback } from "react";
import { IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import FancyBox from "../../FancyBox";
import Script from "next/script";
import { Banner, ItineraryItem as ItineraryItemContent } from "@/types";

interface ItineraryMetaProps {
  elevation: string | null;
  duration: string | null;
  distance: string | null;
}

interface ItineraryGalleryProps {
  gallery: Banner[] | null;
  id: number;
}

interface ItineraryItemProps {
  item: ItineraryItemData;
  idx: number;
  onToggle: (itemValue: string) => void;
}

interface TripItineraryProps {
  renderData: ItineraryItemContent[];
  title: string;
  duration_type: string
}


const ItineraryMeta = ({ elevation, duration, distance }: ItineraryMetaProps) => {
  if (!elevation && !duration && !distance) {
    return null;
  }

  const isValid = (value: string | null | undefined) =>
    value && value !== "undefined" && value !== "null";

  return (
    <div className="itinerary-meta text-secondary mt-3 rounded w-full text-boldy">
      <ol className="[&>li+li]:mt-2 [&>li]:flex [&>li]:items-center [&>li]:gap-x-1 [&>li>.meta-title]:text-sm [&>li>.meta-content]:text-md [&>li>.icon]:text-secondary [&>li>.icon]:mr-1 [&>li>.meta-content]:font-bold">
        {isValid(elevation) && (
          <li>
            <i className="icon h-5 w-5">
              <svg><use xlinkHref="/icons.svg#elevation" fill="currentColor" /></svg>
            </i>
            <span className="meta-title">Max. Elevation:</span>
            <span className="meta-content">{elevation}</span>
          </li>
        )}
        {isValid(duration) && (
          <li>
            <i className="icon h-6 w-6">
              <svg><use xlinkHref="/icons.svg#durations" fill="currentColor" /></svg>
            </i>
            <span className="meta-title">Duration:</span>
            <span className="meta-content">{duration}</span>
          </li>
        )}
        {isValid(distance) && (
          <li>
            <i className="icon h-6 w-6">
              <svg><use xlinkHref="/icons.svg#distance" fill="currentColor" /></svg>
            </i>
            <span className="meta-title">Distance:</span>
            <span className="meta-content">{distance}</span>
          </li>
        )}
      </ol>
    </div>
  );
};

const ItineraryGallery = ({ gallery, id }: ItineraryGalleryProps) => {
  if (!gallery?.length) {
    return null;
  }
  const cols =
    gallery.length > 3
      ? "grid-cols-4"
      : gallery.length > 2
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <div className="itinerary-gallery my-6 lightbox">
      <FancyBox>
        <div className={`grid gap-2 lg:gap-3 ${cols}`}>
          {gallery.slice(0, 4).map((item, idx) => (
            <div className="gallery-item" key={idx}>
              <figure>
                <span
                  data-src={`${IMAGE_URL}${item.media.full_path}`}
                  data-fancybox={`itinerary${id}`}
                  data-caption={item.title}
                  className="image-slot rounded-xl before:pt-[75%]"
                >
                  <Image
                    className="fill"
                    src={`${IMAGE_URL}${item.media.full_path}`}
                    alt={item.media.alt_text ? item.media.alt_text : ''}
                    height={129}
                    width={173}
                    loading="lazy"
                  />
                </span>
              </figure>
            </div>
          ))}
        </div>
      </FancyBox>
    </div>
  );
};

const ItineraryItem = ({ item, idx, onToggle }: ItineraryItemProps) => {
  const {
    id,
    itinerary_title,
    itinerary_description,
    gallery,
    itinerary_day,
    destination_elevation,
    duration,
    distance,
  } = item;

  const value = `item-${idx + 1}`;
  const hasDescription =
    itinerary_description &&
    itinerary_description !== "null" &&
    itinerary_description !== "<p>null</p>";

  return (

    <div className="item flex items-start mb-10" key={id}>
      <div className="day-count w-[50px] leading-[1] sticky top-[70px] flex-[0_0_50px z-10">
        <span className="uppercase relative font-bold text-xs text-primary border-b-2 pb-1 mb-1 block before:absolute before:bg-primary before:-bottom-0.5 before:w-5 before:h-0.5">Day</span>
        <span className="font-bold text-2xl text-secondary"> {itinerary_day < 10 ? `0${itinerary_day}` : itinerary_day}</span>
      </div>
      <div className="item-body pl-3 flex-[0_0_calc(100%-50px)]">
        <h3 className="text-[1.25rem] leading-[1.3] mb-4 text-secondary font-semibold">{itinerary_title}</h3>
        {hasDescription && (
          <>
            <article
              dangerouslySetInnerHTML={{ __html: itinerary_description }}
              className="[&>h3]:text-[1.125rem] [&>h3]:leading-[1.4]"
            />
            <ItineraryGallery gallery={gallery ? gallery : []} id={id} />
            <ItineraryMeta
              elevation={destination_elevation ? destination_elevation : null}
              duration={duration ? duration : null}
              distance={distance ? distance : null}
            />
          </>
        )}

      </div>
    </div>
  );
};

// --- Main Component ---

export default function TripItinerary({ renderData, title }: TripItineraryProps) {
  const sortedItinerary = useMemo(() => {
    return (renderData || [])
      .slice()
      .sort((a, b) => (a.itinerary_day || 0) - (b.itinerary_day || 0));
  }, [renderData]);

  const [openItems, setOpenItems] = useState(
    sortedItinerary.map((_, i) => `item-${i + 1}`)
  );

  const toggleAll = useCallback(() => {
    setOpenItems((prev) =>
      prev.length === sortedItinerary.length ? [] : sortedItinerary.map((_, i) => `item-${i + 1}`)
    );
  }, [sortedItinerary]);

  const handleItemToggle = useCallback((itemValue: string) => {
    setOpenItems((prev) =>
      prev.includes(itemValue) ? prev.filter((i) => i !== itemValue) : [...prev, itemValue]
    );
  }, []);

  if (sortedItinerary.length < 2) {
    const singleItinerary = sortedItinerary[0];
    if (!singleItinerary || !singleItinerary.itinerary_description) {
      return null;
    }
    return (
      <>
        <h2 className="text-xl md:text-2xl text-headings font-extrabold">Itinerary</h2>
        <article
          className="common-module mb0"
          dangerouslySetInnerHTML={{ __html: singleItinerary.itinerary_description }}
        />
      </>
    );
  }

  const touristTripStructuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: sortedItinerary[0]?.itinerary_description?.replace(/<[^>]+>/g, "") || "",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: sortedItinerary.length,
      itemListElement: sortedItinerary.map((item, idx) => ({
        "@type": "ListItem",
        position: item.itinerary_day || idx + 1,
        item: {
          "@type": "TouristAttraction",
          name: item.itinerary_title,
          description: item.itinerary_description?.replace(/<[^>]+>/g, ""),
          ...(item.destination_elevation && item.destination_elevation !== "null" && {
            elevation: { "@type": "QuantitativeValue", value: item.destination_elevation, unitCode: "MTR" },
          }),
          ...(item.duration && item.duration !== "null" && { duration: item.duration }),
          ...(item.distance && item.distance !== "null" && {
            distance: { "@type": "QuantitativeValue", value: item.distance, unitCode: "KMT" },
          }),
          ...(item.gallery?.length && {
            image: item.gallery.map((g) => `${IMAGE_URL}${g.media.full_path}`),
          }),
        },
      })),
    },
  };

  return (
    <>
      <Script
        id="tourist-trip-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripStructuredData) }}
        strategy="afterInteractive"
      />
      <h2 className="section-title">{title}</h2>

      <div className="itinerary-list">
        {sortedItinerary.map((item, idx) => (
          <ItineraryItem
            key={item.id}
            item={item}
            idx={idx}
            onToggle={handleItemToggle}
          />
        ))}

      </div>
    </>
  );
}