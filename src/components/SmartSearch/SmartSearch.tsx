"use client";
import {
  IMAGE_URL,
  PACKAGE_BASE_URL,
  PRODUCTION_SERVER,
  SITE_KEY,
} from "@/lib/constants";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import Loading from "../../../public/loading.svg";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SmartSearchProps {
  className?: string;
}

const SmartSearch = ({ className }: SmartSearchProps) => {
  const [packages, setPackages] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [filterData, setFilterData] = useState({
    title: "",
  });

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

    return () => {
      clearTimeout(timer);
    };
  }, [filterData]);

  return (
    <>
      <div className={cn('trip-search relative hidden md:block', className)} id="trip_search">
        <form className="z-20 flm-form bg-white shadow p-1 rounded-full relative">
          <div className="form-group">
            <label htmlFor="trip_search_input" hidden>
              Location
            </label>{" "}
            <input
              type="text"
              className="form-control border-transparent rounded-full"
              placeholder="Where are you going?"
              id="trip_search_input"
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  title: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            className="absolute right-1 top-1 w-[42px] rounded-full inline-flex justify-center items-center text-center min-h-[42px] bg-secondary text-white"
          >
            {isPending ? (
              <i className="icon h-5 w-5" role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 animate-spin text-white"
                  viewBox="0 0 100 101"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" />
                </svg>
                <span className="sr-only">Loading...</span>
              </i>
            ) : (
              <i className="icon h-5 w-5">
                <svg>
                  <use xlinkHref={"/icons.svg#search"} />
                </svg>
              </i>
            )}
          </button>
          
        </form>
        {filterData.title &&
          <div className="serach-result top-[calc(100%_-_30px)] pt-[60px] text-left max-h-[500px] custom-scroll-bar  overflow-x-hidden overflow-y-auto">
            {isPending && (
              <div className="loading text-center">
                <i className="icon text-secondary h-[50px] w-[50px]">
                  <Image src={Loading} height={50} width={50} alt="loading" />
                </i>
              </div>
            )}

            {!isPending && filterData.title && (
              <div className="">
                <ul className="[&>li+li]:mt-0.5">
                  {packages?.map((itm, idx) => {
                    const {
                      package_title,
                      featured,
                      package_discount,
                      package_duration,
                      package_duration_type,
                      urlinfo,
                      testimonials,
                      additional_field_1,
                      group_default_price,
                      total_testimonials,
                    } = itm;
                    return (
                      <li key={idx}>
                        <Link
                          href={`${PACKAGE_BASE_URL}${urlinfo.url_slug}`}
                          className="item flex items-center gap-5 p-2 -m-2 hover:bg-light hover:shadow-sm rounded"
                          //onClick={discardSearch}
                        >
                          <figure className="intro-img relative flex-[0_0_120px] max-w-[70px]">
                            <span className="rounded relative overflow-hidden block image-slot before:pt-[101.307%]">
                              {featured && (
                                <Image
                                  src={IMAGE_URL + featured?.full_path}
                                  alt={
                                    featured.alt_text
                                      ? featured.alt_text
                                      : package_title
                                  }
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
                                {package_title}
                              </h3>
                            </div>
                            <ul className="package-meta flex items-center text-xs gap-1">
                              <li className="duration">
                                {package_duration < 10
                                  ? "0" +
                                    package_duration +
                                    " " +
                                    package_duration_type
                                  : package_duration +
                                    " " +
                                    package_duration_type}
                              </li>
                              {total_testimonials > 0 && (
                                <li className="divider text-muted font-normal opacity-50 hidden md:block">
                                  |
                                </li>
                              )}
                              {total_testimonials > 0 && (
                                <li className="review-rating">
                                  <i
                                    className="ratings__5"
                                    style={{ zoom: 0.85 }}
                                  ></i>
                                  {total_testimonials <= 9
                                    ? "0" + total_testimonials + " " + "reviews"
                                    : total_testimonials + " " + "reviews"}
                                </li>
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
          </div> }
      </div>
    </>
  );
};

export default SmartSearch;
