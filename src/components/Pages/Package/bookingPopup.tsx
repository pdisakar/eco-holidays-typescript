"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Check, CheckCheck, BadgeInfo, CircleHelp, CreditCard, HandCoins } from "lucide-react";

import countryCode from "@/lib/country-code.json";
import { formatDate } from "@/lib/dateFormatter";
import { useToast } from "@/hooks/use-toast";
import { useGlobalData } from "@/context/globalContext";
import Loading from "@/components/Loading";

import {
  PRODUCTION_SERVER,
  IMAGE_URL,
  RECAPTCHA_SITE_KEY,
  SITE_KEY,
} from "@/lib/constants";

// --- Interfaces for type safety ---

interface BookingPopupProps {
  startDate: Date;
  endDate: Date;
  traveller: number;
  featured: {
    full_path: string;
    alt_text?: string;
  };
  package_duration: number;
  package_duration_type: string;
  package_title: string;
  setBookingModule: (isOpen: boolean) => void;
  pricePP: number;
  tripId: string;
}

interface FormData {
  full_name: string;
  email: string;
  nationality: string;
  country_code: string;
  mobile_number: string;
  pickup_details: string;
}

interface ApiCallBody {
  [key: string]: any;
}


const errorToast = (msg: string) => (
  <div className="flex items-center gap-x-2 font-bold">
    <i className="icon h-5 w-5 bg-danger text-white rounded-full p-1">
      <BadgeInfoIcon />
    </i>
    <span>{msg}</span>
  </div>
);


export default function BookingPopup({
  startDate,
  endDate,
  traveller,
  featured,
  package_duration,
  package_duration_type,
  package_title,
  setBookingModule,
  pricePP,
  tripId,
}: BookingPopupProps) {
  const [payment_options, setPaymentOptions] = useState<"pay_later" | "partial_payment" | "fully_payment">("pay_later");
  const [terms, setTerms] = useState(false);
  const { globalData } = useGlobalData();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // Use useMemo to cache expensive calculations
  const totalTripPrice = useMemo(() => pricePP * traveller, [pricePP, traveller]);

  const bank_charge = useMemo(() => {
    const rate = 3.5 / 100;
    const depositAmount = payment_options === "partial_payment" ? totalTripPrice * 0.2 : totalTripPrice;
    const charge = depositAmount * rate;
    return Math.round((charge + Number.EPSILON) * 100) / 100;
  }, [payment_options, totalTripPrice]);

  const payableNow = useMemo(() => {
    const depositAmount = payment_options === "partial_payment" ? totalTripPrice * 0.2 : totalTripPrice;
    return Math.round(depositAmount) + bank_charge;
  }, [payment_options, totalTripPrice, bank_charge]);

  // Consolidate country data processing
  const countryOptions = useMemo(() => {
    return countryCode.map((item) => ({
      label: item.name,
      value: item.name,
      dial_code: item.dial_code,
    }));
  }, []);

  const apiCall = useCallback(
    async (url: string, body: ApiCallBody) =>
      fetch(`${PRODUCTION_SERVER}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          sitekey: SITE_KEY,
        },
        body: JSON.stringify(body),
      }),
    []
  );

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const bookingData = {
        ...formData,
        date_of_birth: formatDate(new Date(), "YYYY-mm-dd"),
        trip_id: tripId,
        start_date: formatDate(startDate, "YYYY-mm-dd"),
        end_date: formatDate(endDate, "YYYY-mm-dd"),
        number_of_traveller: traveller,
        payment_options,
        total_price: totalTripPrice,
        payable_percentage: payment_options === "partial_payment" ? 20 : 100,
        captcha_response: await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
          action: "booking_form",
        }),
      };

      const paymentData = {
        customer_name: formData.full_name,
        customer_email: formData.email,
        package_id: tripId,
        percent: 100,
        customer_total: totalTripPrice.toFixed(2),
        trip_id: tripId,
        payment_options,
        bank_charge,
      };

      const bookingResponse = await apiCall("/bookpackage", bookingData);

      if (!bookingResponse.ok) {
        toast({ description: errorToast("Booking form submission failed.") });
        return;
      }

      toast({
        description: (
          <div className="flex gap-x-2 font-bold">
            <i className="icon text-white h-5 w-5 rounded-full flex-[0_0_20px] p-0.5 shadow-md bg-success ">
              <Check />
            </i>
           <div>
             <span className="font-bold text-headings text-md">Booking Confirmed</span>
            <p className="text-xs text-muted">
              Thank you for booking with us! We'll contact you shortly.
            </p>
           </div>
          </div>
        ),
        
      });

      reset();
      setBookingModule(false);

      if (payment_options === "pay_later") return;

      const paymentResponse = await apiCall("/payment/hbl", paymentData);
      const paymentResult = await paymentResponse.json();

      if (paymentResponse.ok && paymentResult?.payment_url) {
        router.push(paymentResult.payment_url);
      } else {
        toast({
          description: errorToast(
            "Payment processing failed. Please contact support."
          ),
        });
      }
    } catch (error: any) {
      toast({
        description: errorToast(
          error?.message || "An unexpected error occurred."
        ),
      });
    }
  };


  const countryNameList = countryCode.map((itm) => {
    return {
      label: itm.name,
      value: itm.name,
    };
  });

  const countryCodeList = countryCode.map((itm) => {
    return {
      label: itm.name + " (" + itm.dial_code + ")",
      value: itm.dial_code,
    };
  });

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      ></Script>
      <div className="popup-module show">
        <div
          className="closer cursor-pointer"
          onClick={() => setBookingModule(false)}
        ></div>
        <div className="bg-white relative inline-block rounded-xl max-w-[1024px] mt-20">
          <div className="module-header rounded-lg pb-8 -mt-20 z-10 before:rounded-xl text-center relative before:absolute before:-inset-x-0 before:bottom-0 before:top-10 before:bg-headings before:-z-10">
            <figure className="image-slot rounded-full overflow-hidden inline-block h-24 w-24 before:pt-[100%]">
              <Image
                src={IMAGE_URL + featured.full_path}
                alt={featured.alt_text ? featured.alt_text : package_title}
                height={96}
                width={96}
                objectFit
              />
            </figure>
            <h3 className="font-semibold mt-3 text-white text-[1.25rem] md:text-2xl">{`${package_title} - ${package_duration} ${package_duration_type}`}</h3>
            <ul className="flex text-white/30 items-center gap-x-2 pt-1 justify-center">
              <li>
                <span className="text-white/60 text-xs font-medium">
                  {formatDate(startDate, "dd MMM")} to{" "}
                  {formatDate(endDate, "dd MMM, YYYY")}
                </span>
              </li>
              <li>|</li>
              <li>
                <span className="text-white/60 text-xs font-medium">
                  {traveller} People
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:grid-cols-6 lg:grid custom-scroll-bar max-h-[72vh] lg:max-h-[80vh]">
            <div className="lg:col-span-4 p-6 lg:py-10 lg:px-8">

              <form
                id="booking-form"
                className="needs-validation relative flm-form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                {isSubmitting ? <span className="absolute z-10 inset-0 bg-white/90 text-secondary flex items-center justify-center pt-16 "><Loading height="100" width="100" title="loading" titleId="loading" /> </span> : null}
                <div className="common-module mb0">
                  <h3 className="mb-4 text-headings font-extrabold text-xl">
                    Lead <span className="text-secondary">Traveller</span>{" "}
                    Detail
                  </h3>

                  <div className="grid grid-cols-12 gap-x-2 lg:gap-x-3 gap-y-6">
                    <label
                      className="col-form-label leading-[1.5] col-span-12 -mb-3"
                      htmlFor="full_name"
                    >
                      <span className="block font-semibold">
                        Name & Email <i className="text-danger not-italic">*</i>
                      </span>
                      <span className="help-text text-xxs block text-muted">
                        Per your passport details.
                      </span>
                    </label>
                    <div className="form-group col-span-6">
                      <input
                        type="text"
                        placeholder="Full Name*"
                        className="form-control border border-headings/70"
                        {...register("full_name", { required: true })}
                        aria-invalid={errors.full_name ? "true" : "false"}
                      />
                    </div>

                    <div className="form-group col-span-6">
                      <input
                        name="email"
                        type="email"
                        placeholder="E-mail ID*"
                        className="form-control"
                        required
                        {...register("email", {
                          required: true,
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message:
                              "Entered value does not match email format",
                          },
                        })}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                    </div>
                    <div className="col-span-12">
                      <label
                        className="col-form-label col-span-12 -mb-3"
                        htmlFor="nationality"
                      >
                        <span className="block font-medium">
                          Nationality / Phone{" "}
                          <i className="text-danger not-italic">*</i>
                        </span>
                        <span className="help-text text-xs block text-muted">
                          {" "}
                          The lead traveller should be 18 years or above.
                        </span>
                      </label>
                    </div>

                    <div className="form-group col-span-5">
                      <div className="custom_select">
                        <span className="select_indicator"></span>
                        <select
                          name="nationality"
                          className="form-control"
                          {...register("nationality", {
                            required: true,
                          })}
                          aria-invalid={errors.nationality ? "true" : "false"}
                        >
                          <option value="">Select Nationality*</option>
                          {countryNameList.map((itm, idx) => {
                            return (
                              <option value={itm.value} key={idx}>
                                {itm.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="custom_select">
                        <span className="select_indicator"></span>
                        <select
                          name="country_code"
                          id="country_code"
                          className="form-control"
                          {...register("country_code", {
                            required: true,
                          })}
                          aria-invalid={errors.country_code ? "true" : "false"}
                        >
                          <option value="">Country Code*</option>
                          {countryCodeList.map((itm, idx) => {
                            return (
                              <option value={itm.value} key={idx}>
                                {itm.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Mobile number*"
                        {...register("mobile_number", {
                          required: true,
                        })}
                        aria-invalid={errors.mobile_number ? "true" : "false"}
                      />
                    </div>

                    <label
                      className="col-form-label col-span-12 -mb-3"
                      htmlFor="nationality"
                    >
                      <span className="block font-medium">
                        Special Requirment
                        <i className="text-danger not-italic ml-1">*</i>
                      </span>
                      <span className="help-text text-xs block text-muted">
                        Please tell us more about yourself to help you better.
                      </span>
                    </label>

                    <div className="col-span-12">
                      <textarea
                        name="pickup_details"
                        id="pickup-detail"
                        rows="6"
                        className="form-control"
                        {...register("pickup_details", {
                          required: true,
                        })}
                        aria-invalid={errors.pickup_details ? "true" : "false"}
                      ></textarea>
                    </div>

                    <label
                      className="col-form-label col-span-12 -mb-3"
                      htmlFor="partial_payment"
                    >
                      <span className="block font-medium">
                        Payment
                        <i className="text-danger not-italic ml-1">*</i>
                      </span>
                      <span className="help-text text-xs block text-muted">
                        Please Select the payment options
                      </span>
                    </label>

                    {/* <div className="col-span-12">
                          <div className="radio-inputs flex-wrap flex items-center gap-3">
                            <div className="radio custom-input-radio">
                              <input
                                type="radio"
                                name="radio"
                                id="partial_payment"
                                value="partial_payment"
                                onChange={(e) => setPaymentOptions(e.target.value)}
                                checked={payment_options === "partial_payment"}
                              />
                              <label
                                className="relative cursor-pointer bg-white/70  pl-16 py-5 pr-12 flex rounded-md border border-border transition-all hover:border-headings/50 hover:shadow-lg"
                                htmlFor="partial_payment"
                              >
                                <i className="icon h-8 w-8 mr-3 absolute left-6 top-6">
                                  <CreditCard />
                                </i>
                                <i className="icon transition-all invisible opacity-0 translate-y-2 checked-icon absolute top-5 right-4 h-6 w-6 p-1 border border-success text-white shadow-lg shadow-success rounded-full bg-success">
                                  <CheckCheck />
                                </i>
                                <span className="font-medium text-muted text-sm leading-[1.25]">
                                  <b className="block text-base text-headings">
                                    20% Deposit
                                  </b>
                                  to confirm your booking.
                                </span>
                              </label>
                            </div>
                            <div className="radio custom-input-radio">
                              <input
                                type="radio"
                                name="radio"
                                id="fully_payment"
                                value="fully_payment"
                                onChange={(e) => setPaymentOptions(e.target.value)}
                                checked={payment_options === "fully_payment"}
                              />
                              <label
                                className="relative cursor-pointer bg-white/70  pl-16 py-5 pr-12 flex  rounded-md border border-border transition-all hover:border-headings/50 hover:shadow-lg"
                                htmlFor="fully_payment"
                              >
                                <i className="icon h-8 w-8 mr-3 absolute left-6 top-6">
                                  <HandCoins />
                                </i>
                                <i className="icon transition-all invisible opacity-0 translate-y-2 checked-icon absolute top-5 right-4 h-6 w-6 p-1 border border-success text-white shadow-lg shadow-success rounded-full bg-success">
                                  <CheckCheck />
                                </i>
                                <span className="font-medium text-muted text-sm leading-[1.25]">
                                  <b className="block text-base text-headings">
                                    100% Deposit
                                  </b>
                                  Settle everything at once.
                                </span>
                              </label>
                            </div>
                          </div>
                        </div> */}

                    <div className="col-span-12">
                      <div className="form-check flex items-center gap-x-1 leading-none mb-5">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={terms}
                          id="terms"
                          onChange={(e) => setTerms(!e.target.checked)}
                        />
                        <label
                          className="form-check-label text-sm mb-0 pl-2 cursor-pointer"
                          htmlFor="terms"
                        >
                          <b>I accept terms and conditions</b> &nbsp;
                          <Link
                            href={"/terms-and-conditions"}
                            target="_blank"
                          >
                            <i className="icon text-secondary h-6 w-6 align-middle">
                              <CircleHelp />
                            </i>
                          </Link>
                        </label>
                      </div>
                      <div className="col-span-12">
                        <button
                          className="bg-primary font-semibold text-base text-white py-2 px-5 md:py-2.5 md:px-8 rounded-lg w-full disabled:opacity-80"
                          type="submit"
                          disabled={terms || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <i className="icon h-5 w-5" role="status">
                                <svg
                                  aria-hidden="true"
                                  className="w-6 h-6 animate-spin text-primary/50"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </i>{" "}
                              Processing
                            </>
                          ) : payment_options === "pay_later" ? (
                            "Confirm Booking"
                          ) : (
                            "Proceed to Payment"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="lg:col-span-2 bg-primary/5">
              <div className="sidebar-module p-6 lg:py-10 lg:px-8">
                {/* <h3 className="mb-4 text-headings font-secondary font-bold text-lg">
                      Summary
                    </h3> */}
                <div className="trip-info">
                  <ul
                    className=" leading-[1.2] [&>li]:flex [&>li+li]:border-t [&>li+li]:mt-3 [&>li+li]:pt-3 [&>li+li]:border-t-headings/15 [&>li]:justify-between [&>li]:gap-x-3 
                    [&>li>div>b]:block
                    [&>li>div>b]:text-md
                    [&>li>div>b]:text-headings
                    [&>li>div>span]:text-xs
                    [&>li>div>span]:font-medium
                    [&>li>div>span]:text-muted
                    [&>li>div:nth-child(2)]:text-primary
                    [&>li>div:nth-child(2)]:font-bold
                    [&>li>div:nth-child(2)]:text-base
                    [&>li>div:nth-child(2)]:min-w-[92px]
                    [&>li>div:nth-child(2)]:text-right
                    "
                  >
                    <li>
                      <div>
                        <b>Brochure Price</b>
                        <span>US ${pricePP + " x " + traveller}</span>
                      </div>
                      <div> US ${pricePP * traveller}</div>
                    </li>
                    <li>
                      <div>
                        <b>Deposit Amount:</b>
                        <span>
                          {payment_options === "partial_payment"
                            ? "20% of total price"
                            : "total price"}{" "}
                        </span>
                      </div>
                      <div>
                        US $
                        {payment_options === "partial_payment"
                          ? pricePP * traveller * (1 / 5)
                          : pricePP * traveller}
                      </div>
                    </li>
                    {payment_options === "partial_payment" ? (
                      <>
                        <li>
                          <div>
                            <b>Bank Charge</b>
                            <span>3.5% Card Processing Fee</span>
                          </div>
                          <div>
                            US $
                            {Math.round(
                              ((20 / 100) * pricePP * traveller * (3.5 / 100) +
                                Number.EPSILON) *
                              100
                            ) / 100}
                          </div>
                        </li>
                        <li>
                          <div>
                            <b>Deposit Payable Now:</b>
                          </div>
                          <div>
                            US $
                            {Math.round((20 / 100) * pricePP * traveller) +
                              bank_charge}
                          </div>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <div>
                            <b>Bank Charge</b>
                            <span>3.5% Card Processing Fee</span>
                          </div>
                          <div>
                            US $
                            {Math.round(
                              (pricePP * traveller * (3.5 / 100) +
                                Number.EPSILON) *
                              100
                            ) / 100}
                          </div>
                        </li>
                        <li>
                          <div>
                            <b>Deposit Payable Now:</b>
                          </div>
                          <div>
                            US ${Math.round(pricePP * traveller) + bank_charge}
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="associates mt-7 text-right">
                  <div className="content-list cards">
                    <p className="text-muted text-sm leading-[1.4] font-medium mb-1">
                      This is a secure and SSL encrypted payment. Your card
                      details are safe!
                    </p>
                    <Image
                      src="/cards.svg"
                      height={30}
                      width={176}
                      alt={globalData?.company_name + " Payment"}
                      className="inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span
            className="close-icon absolute top-0 text-lg right-10 z-10 cursor-pointer text-white/80 hover:text-white leading-[1]"
            onClick={() => setBookingModule(false)}
          >
            ✕
          </span>
        </div>
      </div>
    </>

  );
}