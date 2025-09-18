"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { ArrowRight, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "@/styles/react-date-picker.scss";
import { addDays } from "date-fns";
import Incrementer from "@/components/Incrementer";
import { formatDate, adjustDate } from "@/lib/dateFormatter";
import { DepartureItem, Groupprice } from "@/types";

const MONTHS_MAP = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];






type TripDepartureProps = {
  renderData: DepartureItem[];
  slug: string;
  package_duration: number;
  groupPrice: Groupprice[];
  group_default_price: number | 0;
  title: string;
  durationType: string;
};

const groupDatesByYear = (dates: string[]) => {
  const yearMonthMap: Record<string, Set<string>> = {};
  dates.forEach((date) => {
    const [year, month] = date.split("T")[0].split("-");
    if (!yearMonthMap[year]) yearMonthMap[year] = new Set();
    yearMonthMap[year].add(MONTHS_MAP[parseInt(month, 10) - 1]);
  });
  return Object.entries(yearMonthMap).map(([year, months]) => ({
    year,
    months: [...months],
  }));
};

export default function TripDeparture({
  renderData,
  slug,
  package_duration,
  groupPrice,
  group_default_price,
  title,
}: TripDepartureProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [filteredData, setFilteredData] = useState<DepartureItem[]>([]);
  const [traveller, setTraveller] = useState<number>(
    groupPrice[0]?.min_people || 1
  );
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 1));
  const [pricePP, setPricePP] = useState<number>(group_default_price);

  const dates = useMemo(
    () => [...new Set(renderData?.map((item) => item.departure_date))],
    [renderData]
  );

  const groupedDates = useMemo(() => groupDatesByYear(dates), [dates]);
  const [selectedYear, setSelectedYear] = useState<string>(
    groupedDates[0]?.year || ""
  );

  useEffect(() => {
    const initialMonth = groupedDates.find(
      ({ year }) => year === selectedYear
    )?.months[0];
    if (initialMonth) {
      setFilteredData(
        renderData.filter(
          (item) =>
            formatDate(new Date(item.departure_date), "MMM, YYYY") ===
            `${initialMonth}, ${selectedYear}`
        )
      );
    }
  }, [renderData, dates, selectedYear, groupedDates]);

  useEffect(() => {
    const matchingPrice = groupPrice.find(
      (grp) => grp.min_people === traveller
    )?.unit_price;
    setPricePP(matchingPrice || group_default_price);
  }, [traveller, groupPrice, group_default_price]);

  const handleSortByMonth = (month: string, index: number) => {
    setActiveTab(index);
    setFilteredData(
      renderData.filter(
        (item) =>
          formatDate(new Date(item.departure_date), "MMM, YYYY") ===
          `${month}, ${selectedYear}`
      )
    );
  };

  const maxPeople = groupPrice[groupPrice.length - 1]?.max_people ?? 15;
  const minPeople = groupPrice[0]?.min_people ?? 1;

  useEffect(() => {
    if (minPeople) {
      setTraveller(minPeople);
    }
  }, [minPeople]);

  const increment = () => {
    if (traveller < maxPeople) setTraveller(traveller + 1);
  };
  const decrement = () => {
    if (traveller > minPeople) setTraveller(traveller - 1);
  };

  const start_date = startDate ? formatDate(startDate, "YYYY-MM-DD") : null;
  const end_date = startDate
    ? formatDate(
      new Date(startDate.getTime() + (package_duration - 1) * 86400000),
      "YYYY-MM-DD"
    )
    : null;

  return (
    <div className="common-module">
      <h2 className="section-title">
        {title}
      </h2>

      {filteredData?.length > 0 ? (
        <>
          <div className="sorting overflow-x-auto mb-6">
            <h3 className="mb-3">Sort By Date</h3>
            <div className="flex flex-wrap gap-x-3 mb-3">
              {groupedDates.map(({ year }) => (
                <button
                  key={year}
                  className={`uppercase text-xs font-extrabold relative border p-1 px-3 rounded-md ${selectedYear === year
                      ? "bg-secondary text-white shadow-secondary/20 after:absolute after:border-x-[6px] after:border-t-[6px] after:border-t-secondary after:top-full after:left-1/2 after:border-x-transparent after:translate-x-[-50%]"
                      : "text-secondary border-secondary/5 bg-secondary/10 hover:border-primary hover:text-primary"
                    }`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {groupedDates
                .find(({ year }) => year === selectedYear)
                ?.months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleSortByMonth(month, index)}
                    className={`uppercase text-xs font-extrabold border border-secondary p-1 px-4 rounded-md ${index === activeTab
                        ? "bg-secondary  text-white shadow-secondary/20"
                        : "text-secondary bg-secondary/5 hover:border-primary hover:text-primary"
                      }`}
                  >
                    {month}
                  </button>
                ))}
            </div>
          </div>


          {/* Departure list */}
          <div className="departure-list [&>ul>li+li]:mt-3">
            <ul>
              {filteredData.map((item, index) => {
                const { departure_date, departure_status, departure_note } =
                  item;
                const start_date = formatDate(
                  new Date(departure_date),
                  "YYYY-mm-dd"
                );
                const end_date = formatDate(adjustDate(new Date(departure_date), (package_duration - 1)),
                  "YYYY-mm-dd"
                );

                console.log(package_duration)

                return (
                  <li key={index}>
                    <div className="item md:grid md:grid-cols-3 gap-3 bg-[#edf0f5]/50 p-3 lg:p-6 rounded-md shadow border border-white leading-5">
                      <div className="col flex text-md md:text-base items-center gap-x-6 col-span-2">
                        <div className="date">
                          <span className="text-headings font-semibold">
                            {formatDate(new Date(start_date), "Do MMM YYYY")}
                          </span>
                          <span className="text-sm block">Start Date</span>
                        </div>
                        <i className="icon h-6 w-6 p-0.5 border-2 border-muted text-primary bg-white rounded-full">
                          <ArrowRight />
                        </i>
                        <div className="date">
                          <span className="text-headings font-semibold">
                            {formatDate(new Date(end_date), "Do MMM YYYY")}
                          </span>
                          <span className="text-sm block">End Date</span>
                        </div>
                      </div>

                      <div className="col py-3 md:py-0">
                        <span className="price text-secondary font-secondary font-bold text-lg">
                         US ${group_default_price?.toFixed(0)}
                        </span>
                        <span className="text-headings font-medium text-xs block">
                          Per person
                        </span>
                      </div>
                      <div className="col">
                        {departure_status === "closed" ? (
                          <Link
                            href={`${BASE_URL}contact-us`}
                            className="btn btn-md btn-primary"
                          >
                            Enquire Now
                          </Link>
                        ) : (
                          <Link
                            href={`./booking?_trip=${slug}&startDate=${start_date}&endDate=${end_date}&traveller=${minPeople}`}
                            className="btn text-md border-0 font-semibold rounded-md px-5 py-2 block btn-primary"
                          >
                            Book Now
                          </Link>
                        )}
                      </div>
                      <div className="col-span-4">
                        <div className="availability w-full border-t border-t-border pt-3 text-center relative pl-6">
                          <span className="capitalize flex items-center space-x-1 justify-center text-muted text-sm font-medium">
                            <i className="h-4 w-4 bg-[#FAAA39] text-white rounded-full mr-1">
                              <svg>
                                <use
                                  xlinkHref="/icons.svg#info-i"
                                  fill="currentColor"
                                ></use>
                              </svg>
                            </i>
                            {departure_status && `${departure_status},`}{" "}
                            {departure_note === "undefined"
                              ? `2 Left`
                              : departure_note}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <div className="common-module bg-white shadow-base mb0">
          {groupPrice.length > 1 && (
            <div className="group_price mb-6 max-w-[300px]">
              <h3 className="font-secondary text-primary text-xl font-normal mb-2.5">
                Group Discount Available
              </h3>
              <div className="item-body">
                <table className="group_price_table">
                  <tbody>
                    {groupPrice.map((itm) => (
                      <tr key={itm.id}>
                        <td>
                          <span>
                            {itm.min_people === itm.max_people
                              ? itm.min_people
                              : `${itm.min_people} - ${itm.max_people}`}{" "}
                            Person
                          </span>
                        </td>
                        <td>
                          <span>US$ {itm.unit_price}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <form className="flm-form">
            <div className="form-group mb-4 depature">
              <label htmlFor="when" className="leading-[1.25] mb-2 block">
                <span className="block font-extrabold">When?</span>{" "}
                <span className="text-sm text-headings/80 font-medium">
                  Pick a Date (Private Date)
                </span>
              </label>
              <div className="depature-date relative max-w-[500px]">
                <div id="datepicker" className="custom-date-picker z-10">
                  <DatePicker
                    name="date_of_birth"
                    selected={startDate}
                    onChange={(update: Date) => setStartDate(update)}
                    dateFormat="dd/MM/yyyy"
                    minDate={addDays(new Date(), 1)}
                    className="form-control w-full border border-border px-4 py-1.5 rounded-md font-medium text-sm"
                    monthsShown={1}
                  />
                </div>
                <i className="icon text-primary/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="h-4 w-4" />
                </i>
              </div>
            </div>
            <div className="form-group guest mb-4">
              <label htmlFor="people" className="leading-[1.25] mb-2 block">
                <span className="block font-extrabold">Travellers?</span>{" "}
                <span className="text-sm text-headings/80 font-medium">
                  Number of pax
                </span>
              </label>
              <Incrementer
                number={traveller}
                increment={increment}
                decrement={decrement}
                min={1}
                max={15}
              />
            </div>
            <div className="form-group flex items-center mb-4 guest">
              <label htmlFor="people" className="leading-[1.3] w-1/2">
                <span className="block font-extrabold">Total Price</span>
                <span className="text-sm text-headings/80 font-medium">
                  {traveller} x {pricePP}
                </span>
              </label>
              <div className="price text-primary font-extrabold text-xl w-1/2">
                US ${pricePP * traveller}
              </div>
            </div>
            <div className="form-group">
              <Link
                href={`${BASE_URL}booking?_trip=${slug}&traveller=${traveller}&startDate=${start_date}&endDate=${end_date}`}
                className="btn btn-primary px-6 py-2 text-[1.06275rem] rounded-lg w-full capitalize"
              >
                Book this Trip
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
