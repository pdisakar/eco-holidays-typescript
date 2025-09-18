// Optimized and converted to TypeScript (TSX)
"use client";

import { Suspense, useEffect, useMemo, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "@/styles/react-date-picker.scss";
import useWindowSize from "@/hooks/useWindowSize";
import Incrementer from "@/components/Incrementer";
import { addDays } from "date-fns";
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";
import { Groupprice, Tierdata } from "@/types";
const BookingPopup = dynamic(() => import('./bookingPopup'))

interface Props {
  tierdata: Tierdata[];
  pricegroup: Groupprice[];
  package_duration: number;
  package_duration_type: string;
  additional_field_1?: string;
  package_title: string;
  featured: string;
  tripId: number;
  urlinfo: { url_slug: string };
  departure_note: string;
}

export default function Tier({
  tierdata,
  pricegroup,
  package_duration,
  package_duration_type,
  additional_field_1,
  featured,
  package_title,
  tripId,
  urlinfo,
  departure_note,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [traveller, setTraveller] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookingModule, setBookingModule] = useState(false);
  const { width } = useWindowSize();
  const isPrivateTrip = additional_field_1?.toLowerCase() === "private trip";

  const goldPackage = useMemo(() => tierdata.find((a) => a.package_tier === "silver"), [tierdata]);
  const [packageData, setPackageData] = useState<TierData | undefined>(goldPackage);
  const [groupPrice, setGroupPrice] = useState<PriceGroup[]>([]);

  useEffect(() => {
    const selectedTier = tierdata[activeIndex]?.package_tier.toLowerCase() || "silver";
    setGroupPrice(pricegroup.filter((a) => a.package_tier?.toLowerCase() === selectedTier));
  }, [activeIndex, pricegroup, tierdata]);

  const minPeople = useMemo(() => groupPrice[0]?.min_people || 1, [groupPrice]);
  const maxPeople = useMemo(() => groupPrice[groupPrice.length - 1]?.max_people || 15, [groupPrice]);

  useEffect(() => {
    if (traveller < minPeople) setTraveller(minPeople);
  }, [minPeople, traveller]);

  const pricePP = useMemo(() => {
    return (
      groupPrice.find(
        (group) => traveller >= group.min_people && traveller <= group.max_people
      )?.unit_price || 0
    );
  }, [groupPrice, traveller]);

  const increment = useCallback(() => setTraveller((prev) => Math.min(prev + 1, maxPeople)), [maxPeople]);
  const decrement = useCallback(() => setTraveller((prev) => Math.max(prev - 1, minPeople)), [minPeople]);

  const handleClick = useCallback((index: number, key: string) => {
    setLoading(true);
    setActiveIndex(index);
    setTimeout(() => {
      const selected = tierdata.find((a) => a.package_tier === key);
      setPackageData(selected);
      setLoading(false);
    }, 500);
  }, [tierdata]);

  const handleDateChange = useCallback(
    (date: Date) => {
      setStartDate(date);
      if (package_duration_type.toLowerCase() === "days") {
        setEndDate(addDays(date, package_duration - 1));
      } else {
        setEndDate(date);
      }
    },
    [package_duration, package_duration_type]
  );

  const handleBookingPopup = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setBookingModule(true);
      setLoading(false);
    }, 500);
  }, []);

  const tier_data = tierdata.map(tier => {
    const relevantPrices = pricegroup.filter(p => p.package_tier?.toLowerCase() === tier.package_tier);
    const lowest = Math.min(...relevantPrices.map(p => p.unit_price));
    return { ...tier, lowest_unit_price: lowest };
  });




  return (
    <>
      <div className="pt-10 package-section" id="availability">
        <div className="common-module">
          {tierdata?.length > 0 && (
            <>
              <div className="module-title">
                <h2 className="text-lg md:text-xl lg:text-[1.675rem] font-secondary font-normal text-headings">
                  Availability
                </h2>
              </div>
            </>
          )}
          <div
            className="box -mx-3 md:mx-auto"
            id="tier-container"
          >
            {tier_data?.length > 0 && (
              <aside className="sticky bg-white z-50 top-0 ">
                <div className="button-group lg:mx-auto [&>button+button]:ml-[-1px] relative z-10 items-end flex flex-wrap gap-0 before:absolute before:inset-x-0 before:h-[2px] before:bg-primary/50 before:bottom-[-2px] before:-z-10">
                  {tier_data.map((itm, index) => (
                    <button
                      className={` rounded-t-lg capitalize leading-[1.2] border-b-0 px-2  lg:px-4 py-2 inline-flex flex-col items-center justify-center relative  ${activeIndex === index
                        ? " border-2 bg-white pt-4 pb-2 mb-[-2px] px-4 lg:px-6 xl:px-10  border-[#77a1b9] opacity-100 [&>.options]:text-[1.125rem] lg:[&>.options]:text-[1.25rem] [&>.price]:text-xs"
                        : " border hover:border-[#77a1b9] border-primary/40 border-[#dae6ed]  bg-primary/[0.025] opacity-85   [&>.price]:text-xxs [&>.options]:text-md  md:[&>.options]:text-base"
                        }`}
                      key={index}
                      onClick={() => handleClick(index, itm.package_tier)}
                    >
                      <span className="price font-semibold block uppercase text-primary">From ${itm.lowest_unit_price}</span>
                      <span className="options font-bold tracking-wide ">{itm.package_tier_alias}</span>
                    </button>
                  ))}
                </div>
              </aside>
            )}

            <div
              className={`${tier_data?.length > 0
                ? "drop-shadow-base border-2 border-[#77a1b9] relative p-3 lg:p-8 rounded-b-lg lg:bg-white"
                : ""
                }`}
            >
              {loading && (
                <div className="loading absolute p-20 inset-0 bg-white/80 z-20 text-center">
                  <i className="icon text-primary h-[70px] w-[70px]">
                    <Loading title="Loading" titleId="loading" />
                  </i>
                </div>
              )}
              {tierdata?.length > 0 && (
                <>
                  <div className="mb-10 lg:grid lg:grid-cols-2 bg-light p-6 rounded-lg border border-border border-dashed shadow">

                    <div
                      className="text-headings  text-md mb-8 font-medium"
                      dangerouslySetInnerHTML={{
                        __html: packageData?.package_tier_description ? packageData?.package_tier_description : '',
                      }}
                    />
                    {groupPrice.length > 1 && (
                      <div className="box lg:pl-6 max-w-[350px] text-primary font-bold  mb-6">
                        <div className="lg:pl-3 text-md">
                          <ul className="[&>li+li]:mt-1">
                            <li className="flex items-center text-headings justify-between font-bold border-b border-b-primary pb-1 mb-3">
                              <span>No. of Persons</span>
                              <span>Price per Person</span>
                            </li>
                            {groupPrice.map((itm) => {
                              return (
                                <li
                                  key={itm.id}
                                  className="flex z-10 items-center justify-between relative before:-z-10 before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-[1px] before:border-t before:border-dashed before:border-t-primary/50"
                                >
                                  <span className=" bg-[#F6F8FA] relative z-20 inline-block pr-3">
                                    {itm.min_people === itm.max_people
                                      ? itm.min_people
                                      : itm.min_people +
                                      " - " +
                                      itm.max_people}{" "}
                                    Pax
                                  </span>
                                  <span className=" bg-[#F6F8FA] inline-block pl-3">
                                    US$ {itm.unit_price}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="common-module lg:border-t lg:border-t-border lg:[&>div]:pt-8 grid  lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8 gap-y-8">
                    {packageData?.package_cost_includes && (
                      <div className="lg:col-span-4 order-2 lg:order-1">
                        <div className="box">
                          <h2 className="text-[1.25rem] md:text-xl font-bold flex items-center text-headings">
                            Book your own private small group trip
                          </h2>
                          <p className="text-muted text-sm pt-2.5 mb-6">**Discounts are determined exclusively by the size of your group. We do not add additional members to your group.</p>
                          <label htmlFor="datepicker" className="leading-[1.25] text-pretty  mb-2 block"><span className="block text-body/80 font-bold">Select Departure Date</span></label>
                          <DatePicker
                            name="date_of_birth"
                            selected={startDate}
                            id="datepicker"
                            onChange={handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            className="form-control"
                            monthsShown={width && width > 1229 ? 2 : 1}
                            // includeDates={departures?.map(
                            //   (a) => new Date(a.departure_date)
                            // )}
                            inline
                          />


                        </div>

                        <span className="lg:-mb-12 text-md mt-6 text-muted flex items-center gap-x-2">
                          <i className="h-3 w-3 bg-muted/50 rounded-full inline-block"></i>
                          Sold out dates
                        </span>

                        <div className="form-group mt-6 flex items-center gap-x-6 guest justify-end">
                          <label htmlFor="people" className="leading-[1.25] mb-2 block">
                            <span className="block text-body/80 font-bold">No Of Participants</span>
                          </label>
                          <Incrementer
                            number={traveller}
                            increment={increment}
                            decrement={decrement}
                            min={1}
                            max={15}
                          />
                        </div>

                        <div className="form-group mt-6 flex justify-end text-right items-center guest">
                          <div className="w-1/2 leading-[1.25]">
                            <span className="price text-primary font-bold text-2xl">
                              US ${pricePP * traveller}
                            </span>
                            <span className="text-xs text-body/80 block">
                              <b className="font-bold text-headings">US ${pricePP}</b> per person (based on {traveller} people)
                            </span>
                          </div>
                        </div>

                        <div className="form-group text-right mt-6">
                          <button
                            type="button"
                            className={`btn shadow-lg text-sm lg:text-md px-6 lg:px-10 py-1.5 lg:py-2.5 z-10 font-bold tracking-wide rounded-full text-white ${!startDate || !traveller ? "opacity-70 cursor-not-allowed bg-headings/80" : "bg-primary"
                              }`}
                            disabled={!startDate || !traveller}
                            onClick={handleBookingPopup}
                          >
                            Continue Booking
                          </button>
                        </div>

                      </div>
                    )}
                    {packageData?.package_cost_excludes && packageData?.package_cost_includes && (
                      <div className="order-1 lg:order-2 lg:col-span-3 lg:border-l lg:border-l-border lg:pl-6 xl:pl-8 custom-scroll-bar max-h-[720px]">
                        <h2 className="text-[1.125rem] sticky md:text-xl font-bold mb-4 flex items-center text-headings">
                          Cost Includes
                        </h2>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: packageData.package_cost_includes,
                          }}
                          className="text-md font-normal leading-[1.5] mb-1.5 [&>ul>li+li]:mt-2 [&>ul>li]:relative [&>ul>li]:pl-7 [&>ul>li]:before:h-3.5 [&>ul>li]:before:w-3.5 [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-1.5 [&>ul>li]:before:content-[''] [&>ul>li]:before:bg-checkmark [&>ul>li]:before:bg-no-repeat [&>ul>li]:before:bg-contain [&>ul>li]:before:bg-center"
                        ></div>
                        <h2 className="text-[1.125rem] mt-6  mb-4 md:text-xl font-bold flex items-center text-headings">
                          Cost Excludes
                        </h2>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: packageData.package_cost_excludes,
                          }}
                          className="text-md font-normal leading-[1.5] [&>ul>li+li]:mt-2 [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:before:h-3 [&>ul>li]:before:w-3 [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-1.5 [&>ul>li]:before:content-[''] [&>ul>li]:before:bg-uncheckmark [&>ul>li]:before:bg-no-repeat [&>ul>li]:before:bg-contain [&>ul>li]:before:bg-center"
                        ></div>
                      </div>

                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
      {bookingModule && (
        <Suspense fallback={<p>Loading...</p>}>
          <BookingPopup
            setBookingModule={setBookingModule}
            package_title={package_title}
            startDate={startDate}
            traveller={traveller}
            endDate={endDate}
            package_duration={package_duration}
            package_duration_type={package_duration_type}
            featured={featured}
            pricePP={pricePP}
            tripId={tripId}
          />
        </Suspense>
      )}
    </>
  );
}
