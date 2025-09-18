"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import EnquireUs from "@/components/EnquireUsForm/EnquireUs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalData } from "@/context/globalContext";

// --- Type Definitions ---
interface GroupPriceItem {
  min_people: number;
  max_people: number;
  unit_price: number;
  id: number;
}

interface Testimonial {
  // Assuming a structure for testimonials, add properties as needed
  id: number;
  text: string;
}

interface GlobalData {
  mobile: string;
  email: string;
  avatar: string;
  tripadvisor_review_count: number;
}

interface BookingModuleProps {
  price: number;
  groupPrice: GroupPriceItem[];
  duration: number;
  durationType: string;
  hasDepatures: boolean;
  status: string | null;
  package_title: string;
  setIsPopupsActive: (isActive: boolean) => void;
  testimonials: Testimonial[];
  avrage_rating: number;
  total_rating: number;
  all_testimonials: Testimonial[];
  no_of_package?: number
}



// --- Main Component ---
export default function BookingModule({
  price,
  groupPrice,
  duration,
  durationType,
  hasDepatures,
  status,
  no_of_package
}: BookingModuleProps) {
  const [traveller, setTraveller] = useState(1);
  const { globalData } = useGlobalData();

  // Optimized logic with useMemo
  const minPeople = useMemo(() => groupPrice?.[0]?.min_people, [groupPrice]);
  const maxPeople = useMemo(
    () => groupPrice?.[groupPrice.length - 1]?.max_people,
    [groupPrice]
  );

  const selectedPricePP = useMemo(() => {
    const result = groupPrice.find((obj) => obj.min_people === traveller);
    return result ? result.unit_price : price;
  }, [groupPrice, traveller, price]);

  // Use useEffect for side effects, not for state setting based on props
  useEffect(() => {
    if (minPeople) {
      setTraveller(minPeople);
    }
  }, [minPeople]);

  // Handle mobile bottom navbar behavior
  useEffect(() => {
    const el = document.querySelector(".bottom-navbar");
    if (!el) return;

    let lastScrollTop = 0;
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        el.classList.remove("active");
      } else {
        el.classList.add("active");
      }
      lastScrollTop = st <= 0 ? 0 : st;
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    const handleScroll = () => {
      const availability = document.getElementById("availability");
      if (!availability) return;

      const rect = availability.getBoundingClientRect();
      const scrolledPast = rect.top <= 0; // when the top of availability crosses viewport top

      setPosition(scrolledPast ? "top" : "bottom");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const bookingModule = document.querySelector(".booking-module");
    const stickyTop = document.querySelector(".booking-module-sticky-top");
    const stickyBottom = document.querySelector(".booking-module-sticky-bottom");

    if (!bookingModule || !stickyTop || !stickyBottom) return;

    if (position === "top") {
      stickyBottom.appendChild(bookingModule);
    } else {
      stickyTop.appendChild(bookingModule);
    }
  }, [position]);

  return (
    <>
      <div className="sticky booking-module top-[60px]">
        <div className="p-6 relative bg-[#e3e8e5]/60 z-10 package-booking-module border border-white rounded-xl shadow-lg">
          {status && (
            <span className="absolute top-3  right-3  font-bold py-0.5 px-2.5 on-sales text-xxs  border border-warning bg-white text-warning rounded-full">
              {status}
            </span>
          )}
          <div className={`inner-wrapper ${status ? 'pt-1' : ''}`}>

            <div className="package-price font-secondary">
              <div className="cost relative leading-[1.2] pl-[50px]">
                <svg className=" absolute left-0 top-0 text-primary" height={40} width={40}><use xlinkHref="/icons.svg#price_tag" /></svg>

                <span className="text-md font-medium text-headings block">Price from</span>
                <span className="normal text-primary inline-flex items-center font-bold text-lg lg:text-xl">
                  {"US $" + price} <sup className="inline-block text-base font-normal text-headings/70 ml-1 -top-1">pp</sup>
                </span>
                <span className="text-xxs tracking-wide font-medium text-headings/70 block">
                  {durationType === 'days' ? `${duration - 1} Nights, ${duration} Days` : `${duration} ${durationType}`}
                </span>
              </div>
            </div>

            {groupPrice.length > 1 && (
              <div className="group_price bg-white -mx-6 px-5 py-4 mt-3">
                <h3 className="font-secondary text-base mb-2.5 relative pb-1  text-headings font-medium before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-6 before:bg-primary before:rounded-full">
                  Group size and price
                </h3>

                <div className="item-body text-secondary">
                  <table className="group_price_table">
                    <tbody>
                      {groupPrice.map((itm) => {
                        return (
                          <tr key={itm.id}>
                            <td>
                              <span>
                                {itm.min_people === itm.max_people
                                  ? itm.min_people
                                  : itm.min_people +
                                  " - " +
                                  itm.max_people}{" "}
                                Pax
                              </span>
                            </td>
                            <td>
                              <span>US ${itm.unit_price}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="button-group mt-5">
              <Link
                href="#availability"
                className="btn btn-secondary rounded-full px-6 py-2 border-secondary/20 font-semibold text-md md:text-base w-full hover:bg-primary/90 transition-all"
              >
                Check Availability
              </Link>
              <Dialog>
                <DialogTrigger className="btn mt-2 bg-white border-headings/50 text-primary rounded-full px-6 py-2 font-bold text-sm w-full hover:bg-primary hover:border-primary hover:text-white transition-all">
                  Send Inquiry
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="mb-3 font-bold text-xl">
                      Send Inquiry
                    </DialogTitle>
                  </DialogHeader>
                  <EnquireUs
                    enablePhone={true}
                    type="Package"
                    horizontalLayout={true}
                    classes="flm-form [&>form>div>div>.form-control]:border-headings/30 [&>form>div>div>.form-control]:rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-4 features text-secondary text-xs [&>ul>li+li]:mt-1 [&>ul>li]:leading-[20px]">
              <ul>
                <li>No-hassle best price guarantee</li>
                <li>Customer care available 24/7</li>
                <li>Hand-picked Tours & Activities</li>
              </ul>
            </div>

          </div>
        </div>
         <div className="mt-3 border shadow-lg leading-[1.3] border-secondary bg-white rounded-md p-6">
        <h3 className="text-[1.125rem] text-headings font-bold">Need Help?</h3>
        <ul className="pt-4">
          <li className="relative pl-8">
            <svg className="h-5 w-5 absolute left-0 top-1 text-secondary" height={16} width={16}><use xlinkHref="/icons.svg#phone" /></svg>
            <a className="text-secondary text-md font-secondary font-semibold" href={`tel:977${globalData.mobile}`}>+977-{globalData.mobile}</a>
            <span className="block text-xs text-headings/80 tracking-wide">Call Us (Viber/Whatsapp)</span>
          </li>
          <li className="mt-3 relative pl-8">
            <svg className="h-5 w-5 absolute left-0 top-0.5 text-secondary" height={16} width={16}><use xlinkHref="/icons.svg#envelope-open" /></svg>
            <a className="text-secondary text-md font-secondary font-semibold" href={`mailto:${globalData.email}`}>{globalData.email}</a>
            <span className="block text-xs text-headings/80 tracking-wide">Mail Us</span></li>
        </ul>
      </div>
      </div>

     

      <div className="bottom-navbar lg:hidden rounded-lg border border-border min-w-[360px] max-w-[500px] fixed bottom-0.5 left-1/2 translate-x-[-50%] bg-white shadow-[0_0_10px] shadow-black/20 z-[99999999999] p-3">
        <div className="flex items-center gap-3">
          <div className="price leading-[1.3]">
            <span className="block text-muted text-xxs">Start From</span>
            <span className="text-headings font-bold">US ${price}</span>
          </div>

          <div className="button-group gap-x-1 flex items-center">
            <Link
              href="#departure-dates"
              className="btn btn-secondary rounded-full px-4 py-0.5 border-secondary/20 font-extrabold text-xxs md:text-xs hover:bg-primary/90 transition-all"
            >
              Book Now
            </Link>
            <Dialog>
              <DialogTrigger className="btn rounded-full px-4 py-0.5 border-headings/80 bg-white text-primary font-bold text-xxs md:text-xs hover:bg-primary/90 transition-all">
                Inquire
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="mb-3 font-bold text-xl">
                    Send Inquiry
                  </DialogTitle>
                </DialogHeader>
                <EnquireUs
                  enablePhone={true}
                  type="Package"
                  horizontalLayout={true}
                  classes="flm-form [&>form>div>div>.form-control]:border-headings/30 [&>form>div>div>.form-control]:rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </div>

          {globalData?.mobile && (
            <Link
              href={`https://api.whatsapp.com/send?phone=${globalData.mobile.replace(/[^a-zA-Z0-9]/g, "")}`}
              className="item h-8 w-8 ml-auto rounded-full inline-flex items-center justify-center bg-whatsapp text-white leading-[1.35]"
            >
              <svg className="h-5 w-5">
                <use xlinkHref="/icons.svg#whatsapp" />
              </svg>
            </Link>
          )}
        </div>
        {globalData?.tripadvisor_review_count && (
          <div className="review-ratings border-t pt-1.5 mt-0.5 text-xxs gap-x-1 flex items-center text-headings/70 leading-[1.2]">
            <i className="ratings__5 scale-[0.85] -ml-1"></i>
            <Link
              href="#reviews"
              className="text-primary -ml-1 font-medium underline"
            >
              {globalData.tripadvisor_review_count + " reviews"}
            </Link>
            on TripAdvisor
          </div>
        )}
      </div>
    </>
  );
}