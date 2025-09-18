"use client";

import { Suspense, useEffect, useState, useTransition, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../../public/loading.svg";

import {
  PACKAGE_BASE_URL,
  IMAGE_URL,
  PRODUCTION_SERVER,
  SITE_KEY,
} from "@/lib/constants";

// Types for the props
interface KeySearchProps {
  isActive: boolean;
  discardSearch: () => void;
}

// Types for the filter input
interface FilterData {
  title: string;
}

// Types for the package items returned by API
interface PackageItem {
  package_title: string;
  featured: {
    full_path: string;
    alt_text?: string;
  } | null;
  package_discount: number;
  package_duration: number;
  package_duration_type: string;
  urlinfo: {
    url_slug: string;
    url_title: string;
  };
  testimonials: any[];
  additional_field_1: string;
  group_default_price: number;
  total_testimonials: number;
}

export default function KeySearch({ isActive, discardSearch }: KeySearchProps) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [filterData, setFilterData] = useState<FilterData>({ title: "" });

  const fetchData = async (offset?: number) => {
    try {
      let filterString = "";
      if (filterData.title)
        filterString += `&_name=${filterData.title}`;

      const response = await fetch(`${PRODUCTION_SERVER}/filterpackages?${filterString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sitekey: SITE_KEY
          },
        });

      const data = await response.json();
      const newData: PackageItem[] = data.data.content;
      
      setPackages([...newData]);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterData.title.trim() !== "") {
        startTransition(() => fetchData());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filterData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, title: e.target.value });
  };

  return (
    <div className={`keysearch_module ${isActive ? "search_active" : ""}`}>
      <span className="discard backdrop-blur-md" onClick={discardSearch}></span>
      <div className="inner-wrapper">
        <form noValidate>
          <div className="form-group">
            <label htmlFor="location" hidden>Location</label>
            <input
              type="text"
              className="form-control outline-none shadow-none"
              placeholder="Find your trip.."
              onChange={handleInputChange}
            />
          </div>

          <button type="button">
            {isPending ? (
              <i className="icon h-5 w-5" role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 animate-spin text-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539..."
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </i>
            ) : (
              <i className="icon h-5 w-5">
                <svg>
                  <use xlinkHref={`/icons.svg#search`} />
                </svg>
              </i>
            )}
          </button>

          <div className="serach-result max-h-[500px] custom-scroll-bar overflow-x-hidden overflow-y-auto">
            {isPending && (
              <div className="loading text-center">
                <i className="icon text-secondary h-[50px] w-[50px]">
                  <Image src={Loading} height={50} width={50} alt="loading" />
                </i>
              </div>
            )}

            {!isPending && filterData.title && (
              <div className="custom-scroll-bar">
                <ul className="[&>li+li]:mt-0.5">
                  {packages.map((itm, idx) => {
                    const {
                      package_title,
                      featured,
                      package_duration,
                      package_duration_type,
                      urlinfo,
                      total_testimonials,
                    } = itm;

                    return (
                      <li key={idx}>
                        <Link
                          href={`${PACKAGE_BASE_URL}${urlinfo.url_slug}`}
                          className="item flex items-center gap-5 p-2 -m-2 hover:bg-light hover:shadow-sm rounded"
                          onClick={discardSearch}
                        >
                          <figure className="intro-img relative flex-[0_0_120px] max-w-[70px]">
                            <span className="rounded relative overflow-hidden block image-slot before:pt-[101.307%]">
                              {featured && (
                                <Image
                                  src={`${IMAGE_URL}${featured.full_path}`}
                                  alt={featured.alt_text || package_title}
                                  height={121}
                                  width={120}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              )}
                            </span>
                          </figure>
                          <figcaption className="flex-[0_0_calc(100%_-_70px)]">
                            <div className="caption-header pb-1">
                              <h3 className="line-clamp-2 font-bold text-[1.125rem]">
                                {urlinfo.url_title}
                              </h3>
                            </div>
                            <ul className="package-meta flex items-center text-xs gap-1">
                              <li className="duration">
                                {`${package_duration < 10 ? "0" : ""}${package_duration} ${package_duration_type}`}
                              </li>
                              {total_testimonials > 0 && (
                                <>
                                  <li className="divider text-muted font-normal opacity-50 hidden md:block">
                                    |
                                  </li>
                                  <li className="review-rating">
                                    <i className="ratings__5" style={{ zoom: 0.85 }}></i>
                                    {`${total_testimonials < 10 ? "0" : ""}${total_testimonials} reviews`}
                                  </li>
                                </>
                              )}
                            </ul>
                          </figcaption>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
