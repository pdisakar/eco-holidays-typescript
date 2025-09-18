"use client";
import { BASE_URL, IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

function TripModule({ tripData }) {
  let {
    banner,
    discount,
    package_duration_type,
    package_duration,
    package_grade,
    package_price,
    rating,
    alt,
    grade,
    package_title,
    urlinfo,
    featured,
    group_default_price,
  } = tripData;

  const total_testimonials = 10;
  const slug = urlinfo.url_slug;
  const activity = "Trekking and Tour";
  const difficulty = "Moderate to Hard";
  const title = package_title;

  const renderImage = (className, fill = false) => (
    <Link
      href={BASE_URL + slug}
      className={`rounded image-slot before:pt-[42%] ${className} `}
    >
      {featured && (
        <Image
          src={`${IMAGE_URL}${banner.full_path}`}
          alt={featured.alt ? featured.alt_text : package_title}
          //fill={fill}
          width={306}
          height={310}
          sizes="(min-width: 400px) 50vw, 100vw"
          className="object-cover"
          loading="lazy"
        />
      )}
    </Link>
  );

  return (
    <div className="item bg-white text-white shadow-base p-0.5 rounded">
      <figure className="intro-img relative ">
        {renderImage("")}
        <figcaption className=" bg-gradient-to-t from-black/50 to-black/0 absolute inset-x-0 bottom-0 z-10 p-6 lg:p-8">
          <ul className="package-meta flex gap-6 items-center lg:pt-6 leading-[1.4] text-sm md:text-md">
            <li className="duration relative pl-10">
              <i className="icon h-8 w-8 text-white top-1 absolute left-0">
                <svg>
                  <use xlinkHref="/icons.svg#duration" />
                </svg>
              </i>
              <span className="block text-xs text-white font-medium">
                Duration
              </span>
              <span className="font-bold text-md capitalize">
                {package_duration_type === "days"
                  ? `${package_duration - 1} Nights ${package_duration} Days`
                  : `${package_duration} ${package_duration_type}`}
              </span>
            </li>
              <li className="duration relative pl-10">
              <i className="icon h-8 w-8 text-white top-1 absolute left-0">
                <svg>
                  <use xlinkHref="/icons.svg#best-price" />
                </svg>
              </i>
              <span className="block text-xs text-white font-medium">
                Price Starts From
              </span>
              <span className="font-bold text-lg">
                US ${group_default_price}
              </span>
            </li>
          </ul>
      
        </figcaption>
      </figure>
    </div>
  );
}

export default function TripOftheMonth({ renderData, title, subTitle }) {
  const { total_testimonials, package_title } = renderData;
  const package_total_testimonials = total_testimonials || 10;
  return (
    <section className="trip-of-the-month common-box pt-0">
      <div className="title text-center">
        <span className="subtitle">Trip Of the Month</span>
        <h2>{package_title}</h2>
        <span className="review-rating text-sm font-medium text-muted">
          <i className="ratings__5"></i> 5.0 from{" "}
          {`${
            package_total_testimonials <= 9 ? "0" : " "
          }${package_total_testimonials} reviews`}
        </span>
      </div>
      <div className="container">
        <TripModule tripData={renderData} />
      </div>
    </section>
  );
}
