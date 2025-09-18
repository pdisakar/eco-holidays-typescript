"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { PACKAGE_BASE_URL, PRODUCTION_SERVER, SITE_KEY } from "@/lib/constants";
import { Check, X } from "lucide-react";

import { formatDate, adjustDate } from "@/lib/dateFormatter";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { cn } from "@/lib/utils";

interface DepartureTripsProps {
  title: string;
  lead?: string;
  subTitle?: string;
  limit?: number;
  classes?: string;
  containerClass?: string;
}

interface UrlInfo {
  url_slug: string;
  url_title: string;
}

interface Package {
  id: number;
  package_title: string;
  package_duration: number;
  package_duration_type: string;
  group_default_price: number;
  urlinfo: UrlInfo;
}

interface DepartureItem {
  package: Package;
  departure_cost: number;
  price?: number;
  departure_date: string;
  departure_status: string;
  departure_note?: string;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('w-full  rounded-xl shadow-sm animate-pulse', className)}>
      <div className="h-6 w-2/3 bg-gray-300 rounded-md mb-2.5"></div>
      <div className="grid rounded-xl p-6 bg-white grid-cols-6 items-center gap-6">
        <div>
          <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>

        <div>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>

        <div>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>

        <div>
          <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>

        <div>
          <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>

        <div className="flex justify-end">
          <div className="h-9 w-24 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default function DepartureTrips({
  title,
  lead,
  subTitle,
  limit = 5,
  classes = "",
  containerClass = "",
}: DepartureTripsProps) {
  const [dates, setDates] = useState<DepartureItem[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  const currentMonthYear = new Date();
  const monthYearList: Date[] = [];
  for (let i = 0; i < 24; i++) {
    const next = new Date(currentMonthYear);
    next.setMonth(currentMonthYear.getMonth() + i);
    monthYearList.push(next);
  }

  const handleDateChanged = async (date: string) => {
    setIsPending(true);
    try {
      const response = await fetch(
        `${PRODUCTION_SERVER}/departures?_limit=200&_offset=0&_date=${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            sitekey: SITE_KEY,
          },
          //cache: "force-cache",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      setDates(result.data as DepartureItem[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsPending(false);
    }
  };

  const fetchDataOnScroll = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isDataFetched) {
        const firstMonth = formatDate(new Date(), "YYYY-mm");
        handleDateChanged(firstMonth);
        setIsDataFetched(true);
      }
    },
    [isDataFetched]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(fetchDataOnScroll, {
      rootMargin: "0px",
      threshold: 0.1,
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [fetchDataOnScroll]);

  return (
    <section className={classes} ref={sectionRef}>
      <div className={containerClass}>

        <div className="title">
          <h2
            dangerouslySetInnerHTML={{ __html: title }} />
          {lead && <p className="lead">{lead}</p>}
        </div>

        <div className="filterer mb-6">
          <Carousel className="overflow-hidden [&>.overflow-hidden]:pb-3 [&>.overflow-hidden]:-mx-1.5">

            <CarouselContent>
              {monthYearList?.map((itm, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <CarouselItem key={idx} className=" basis-auto px-1.5">

                    <button className={`bg-white shadow-[0_0_3px_#0000001a_inset] relative max-w-[70px] px-4 py-2 font-semibold text-sm font-secondary leading-[1.2] rounded-[10px] uppercase
                  ${isActive ? "border border-secondary text-secondary before:absolute before:bottom-[-1px] before:left-[calc(45%+1px)] before:w-[9px] before:h-[2px] before:bg-white before:z-[2] after:absolute after:block after:bottom-[-5px] after:left-[45%] after:w-[11px] after:h-[11px] after:bg-white after:rotate-45 after:border after:border-headings after:z-[-1]" : "text-secondary"}`} onClick={() => { setActiveIdx(idx); handleDateChanged(formatDate(itm, "YYYY-mm")) }}>{formatDate(itm, "MMM YYYY")}</button>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <div className="navigation absolute pointer-events-none left-0 right-0 top-[11px] flex flex-wrap justify-between  gap-x-2.5 items-center text-center [&>button]:text-white [&>button]:border-0  [&>button]:bg-primary [&>button]:h-7 [&>button]:w-7 [&>button]:rounded-full [&>button]:shadow-[0_0_6px_12px_#f2ecdc] [&>button>svg]:h-3 [&>button>svg]:w-3">
              <CarouselPrevious className="gap-0.5 items-center pointer-events-auto disabled:opacity-0 disabled:pointer-events-none disabled:cursor-not-allowed backdrop-blur-md">
                <svg
                  className="rotate-180 h-3 w-3"
                >
                  <use xlinkHref={`/icons.svg#chevron`} fill="currentColor" />
                </svg>
              </CarouselPrevious>
              <CarouselNext className="gap-0.5 pointer-events-auto disabled:opacity-0 disabled:pointer-events-none disabled:cursor-not-allowed ">
                <svg
                  className="h-3 w-3"
                >
                  <use xlinkHref={`/icons.svg#chevron`} fill="currentColor" />
                </svg>
              </CarouselNext>


            </div>

          </Carousel>

        </div>

        <div className="package-availability-table featured">
          {isPending ? (
            Array.from({ length: limit }).map((_, idx) => <Skeleton key={idx} className="item [&+.item]:mt-7 leading-[1.2] font-secondary" />)
          ) : (

            dates.slice(0, limit).map((itm, index) => {
              const {
                package: packages,
                departure_cost,
                price = packages.group_default_price,
                departure_date,
                departure_status,
                departure_note,
              } = itm;
              const { urlinfo, package_duration, package_duration_type, package_title } =
                packages;
              const start_date = formatDate(departure_date, "YYYY-mm-dd");
              const end_date = formatDate(adjustDate(new Date(start_date), (package_duration - 1)), "YYYY-mm-dd")
              const discount = (price * 1.05).toFixed(0);

              return (
                <div className="item [&+.item]:mt-7 leading-[1.2] font-secondary" key={index}>
                  <h3 className="mb-2.5 text-[1.375rem] font-semibold text-secondary"><Link href={`${PACKAGE_BASE_URL}${urlinfo.url_slug}`}>{package_title}</Link></h3>
                  <ul className="flex flex-wrap flex-[0_0_1] md:[&>li]:flex-[1_0_0] bg-white p-6 shadow-sm rounded-[10px] items-center gap-3 justify-between">
                    <li>
                      <span className="text-headings font-medium font-secondary capitalize">{package_duration} {package_duration_type}</span>
                      <span className="block text-xs text-muted">Trip Days</span>
                    </li>
                    <li>
                      <span className="text-headings font-medium font-secondary capitalize">{formatDate(start_date, "Do MMM,  YYYY")}</span>
                      <span className="block text-xs text-muted">Starts</span>
                    </li>
                    <li>
                      <span className="text-headings font-medium font-secondary capitalize">{formatDate(end_date, "Do MMM, YYYY")}</span>
                      <span className="block text-xs text-muted">Ends</span>
                    </li>
                    <li>
                      <div className="status pl-6 relative inline-block">
                        <i
                          className={` absolute left-0 top-0 rounded-full p-0.5 h-4 w-4 border ${departure_status === "closed"
                            ? "icon bg-danger text-white"
                            : departure_status === "guaranteed"
                              ? "icon text-white bg-primary border-primary"
                              : "icon bg-success text-white"}`

                          }
                        >
                          {departure_status === "closed" ? (
                            <X />
                          ) : (
                            <Check strokeWidth={4} />
                          )}
                        </i>
                        <span className="text-headings font-medium font-secondary capitalize">{departure_status}</span>
                        <span className="block text-xs text-muted">
                          {departure_note && departure_note !== "undefined"
                            ? departure_note
                            : "2 seat left"}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="price">
                        <span className="text-secondary font-secondary  font-semibold capitalize">
                          US$ {price > 0 ? price : departure_cost}
                        </span>
                        <span className="block text-xs text-muted">
                          was{" "}
                          <i className="strike not-italic font-medium line-through">
                            $
                            {discount}
                          </i>
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="button-group md:text-right">
                        {departure_status === "closed" ? (
                          <Link
                            href="/contact-us"
                            className="text-primary px-5 py-1.5 text-sm text-center bg-primary/5 w-full lg:w-auto font-medium font-secondary rounded border border-primary hover:bg-primary hover:text-white"
                          >
                            Enquire Now
                          </Link>
                        ) : (
                          <Link
                            className=" px-5 py-2 text-sm text-center bg-primary text-white w-full lg:w-auto font-medium font-secondary rounded-md border border-primary hover:bg-primary hover:text-white"
                            href={`/booking?_trip=${urlinfo.url_slug}&startDate=${start_date}&endDate=${end_date}`}
                          >
                            Join this trip
                          </Link>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
