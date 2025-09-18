"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Link from "next/link";
import { addDays } from "date-fns";
import moment from "moment";
import Script from "next/script";
import dynamic from "next/dynamic";
import countryCode from "@/lib/country-code.json";
import defaultBanner from "@/assets/images/default-banner.jpg";
import "react-datepicker/dist/react-datepicker.css";
import { QuestionCircleFill, X } from "react-bootstrap-icons";


import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { BASE_URL, PRODUCTION_SERVER, RECAPTCHA_SITE_KEY, SITE_KEY } from "@/lib/constants";
import axios from "axios";
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));

const DatePicker = dynamic(() => import("react-datepicker"));

const Incrementer = dynamic(() => import("@/components/Incrementer"), {
  ssr: false,
});
const PageBanner = dynamic(() => import("@/components/Banners/PageBanner"));

export default function TripBooking({ ip, optionsData, eDate, sDate, min_people, default_trip_id }) {
  const router = useRouter();
  const start_date = sDate
    ? moment(sDate).toDate()
    : null;
  const end_date = eDate
    ? moment(eDate).toDate()
    : null;
  //const min_people = router.query.people && router.query.people;
  let number_of_traveller = router?.query?.traveller
    ? router.query.traveller
    : 1;
  //const default_trip_id = router.query._trip;

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      travellers: [],
    },
    mode: "onChange",
  });
  let { fields, append, remove } = useFieldArray({
    control,
    name: "travellers",
  });

  const [arrival_date, setArrivalDate] = useState(null);
  const [departure_date, setDepartureDate] = useState(null);
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);
  const [traveller, setTraveller] = useState(
    number_of_traveller ? Number(number_of_traveller) : 1
  );
  const [packages] = useState(optionsData?.package);
  const [terms, setTerms] = useState(true);
  const [findus, setFindUs] = useState();
  const [customFindus, setCustomFindUs] = useState();
  const [uiLoading, setUiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState();
  const [minPeople] = useState(min_people);

  const object = {
    full_name: "",
    email: "",
    month: "",
    year: "",
    day: "",
    nationality: "",
    country_code: "",
    mobile_number: "",
    passport_image: null,
    passport_no: "",
  };

  fields = new Array(traveller).fill(object);

  const increment = () => {
    if (traveller < 20) {
      setTraveller(traveller + 1);
    }
  };

  const decrement = () => {
    if (traveller > (minPeople ? minPeople : 1)) {
      setTraveller(traveller - 1);
      watch("travellers").pop();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setUiLoading(false);
    }, 1000);

    if (watch("trip_id") && startDate && traveller) {
      setUiLoading(true);
    }
  }, [traveller, startDate]);

  const resetForm = () => {
    const form = document.getElementById("booking-form");
    form.reset();
  };

  const date = new Date();
  const currentYear = date.getFullYear();
  const nextYear = moment(new Date()).add(5, "Year").format("YYYY");
  const yearList = [];
  for (let year = 1945; year <= currentYear; year++) {
    yearList.push(year);
  }
  const nearestYear = [];
  for (let nyear = 2023; nyear <= nextYear; nyear++) {
    nearestYear.push(nyear);
  }

  const hourList = ["00"];
  for (let hour = 1; hour <= 23; hour++) {
    hourList.push(hour < 10 ? 0 + "" + hour : hour.toString());
  }

  const dayList = [];
  for (let day = 1; day <= 31; day++) {
    dayList.push(day < 10 ? 0 + "" + day : day.toString());
  }

  const minuteList = ["00"];
  for (let minute = 1; minute <= 59; minute++) {
    minuteList.push(minute < 10 ? "0" + minute : minute.toString());
  }

  const countryNameList = countryCode.map((itm) => {
    return {
      label: itm.name,
      value: itm.name,
    };
  });

  const countryCodeList = countryCode.map((itm) => {
    return {
      label: itm.name,
      value: itm.dial_code,
    };
  });

  const packageName = packages.filter(
    (a) => a.id == parseFloat(watch("trip_id"))
  )[0]?.title;

  const onSubmit = async (formData) => {
    let data = {
      start_date: startDate && moment(startDate).format("YYYY-MM-DD"),
      //end_date: endDate && moment(endDate).format("YYYY-MM-DD"),
      trip_id: parseFloat(formData.trip_id),
      number_of_traveller: traveller && traveller,
      airport_pickup: formData.airport_pickup == "Yes" ? true : false,
      airport_dropoff: formData.airport_dropoff == "Yes" ? true : false,
      special_requirement: formData.special_requirement,
      ip_address: ip,
      travel_insurance:
        formData.travel_insurance == "I have full coverage of Insurance"
          ? true
          : false,
      arrival_flight_no: formData.arrival_flight_no,
      departure_flight_no: formData.departure_flight_no,
      arrival_date:
        formData.a_year &&
          formData.a_month &&
          formData.a_day &&
          formData.a_hour &&
          formData.a_minute
          ? moment(
            formData.a_year +
            "-" +
            formData.a_month +
            "-" +
            formData.a_day +
            " " +
            formData.a_hour +
            ":" +
            formData.a_minute
          ).format("YYYY-MM-DD HH:mm")
          : "",
      departure_date:
        formData.d_year &&
          formData.d_month &&
          formData.d_day &&
          formData.d_hour &&
          formData.d_minute
          ? moment(
            formData.d_year +
            "-" +
            formData.d_month +
            "-" +
            formData.d_day +
            " " +
            formData.d_hour +
            ":" +
            formData.d_minute
          ).format("YYYY-MM-DD HH:mm")
          : "",
      finding_us: findus === "Others" ? customFindus : findus,
      travellers: formData.travellers.map((itm, idx) => {
        return {
          country_code: itm.country_code,
          gender: itm.gender,
          passport_no: itm.passport_no,
          email: itm.email,
          full_name: itm.full_name,
          mobile_number: itm.mobile_number,
          nationality: itm.nationality,
          is_lead: idx === 0 ? 1 : 0,
          date_of_birth: moment(itm.year + itm.month + itm.day).format(
            "YYYY-MM-DD"
          ),
          passport_image: itm.passport_image,
        };
      }),
    };
    setLoading(true);
    await grecaptcha
      .execute(RECAPTCHA_SITE_KEY, {
        action: "booking_form",
      })
      .then((token) => {
        data.captcha_response = token;
        axios
          .post(`${PRODUCTION_SERVER}/custombooking`, data, {
            headers: {
              Accept: "application/json",
              sitekey: SITE_KEY
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setMessage(res.message);
              setMessageType("success");
              resetForm();
              router.push(
                `/thank-you?trip=${packageName}&name=${data.travellers[0].full_name}&date=${data.start_date}`
              );
            } else {
              setMessage("Some error occured");
            }
            setLoading(false);
          })
          .catch((err) => {
            setMessage(err.message);
            setMessageType("danger");
            setLoading(false);
          });
      });
  };

  //console.log(errors.travellers[0].full_name);
  function unslugify(slug) {
    return slug
      .split('-') // Split the string into an array by hyphens
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a single string with spaces
  }
  return (
    (<div className="bg-light">
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      ></Script>
      <PageBanner
        bannerImage={defaultBanner}
        defaultBanner
        pageTitle="Trip Booking"
      />
      <div className="common-box booking-form pt-0 relative before:bg-gradient-to-b before:from-white before:to-white/0 before:h-24 before:absolute before:inset-x-0 before:top-0">
        <div className="container">
          <div className="lg:w-9/12 lg:mx-auto">
            <div className="page-title-area booking">
              <div className="container">
                <div className="title mb-0">
                  <div>
                    <h1>Trip Booking</h1>
                    <Breadcrumb currentPage="Trip Booking" />
                  </div>
                </div>
              </div>
            </div>
            <div className="common-module mb-0">
              <div className="row" id="booking-form-wrapper">
                <div className="col-lg-12 mx-auto">
                  {message ? (
                    <div className={`alert ${messageType}`}>
                      {message}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage("")}
                      >
                        <i className="icon">
                          <X fill="currentColor" />
                        </i>
                      </button>
                    </div>
                  ) : null}
                  <form
                    id="booking-form"
                    className="needs-validation"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    {loading ? <div className="loading h-[60px] w-[60px] text-secondary inline-block"><Loading /></div> : null}
                    <div className="common-module bg-white shadow">
                      <div className="module-title">
                        <span className="number">1</span>
                        <div className="text">
                          <h3>Trip Info</h3>
                        </div>
                      </div>

                      <div className="module-body">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-12 lg:col-span-7">
                            <label
                              htmlFor="departure"
                              className="col-form-label"
                            >
                              <b>Trip Name*</b>
                            </label>

                            <div className="custom_select">
                              <span className="select_indicator"></span>
                              <select
                                className="form-control"
                                required
                                name="trip_id"
                                defaultValue={
                                  default_trip_id ? default_trip_id : null
                                }
                                {...register("trip_id", { required: true })}
                                aria-invalid={
                                  errors.trip_id ? "true" : "false"
                                }
                              >
                               
                                <option value="" selected disabled>
                                  Select a Package*
                                </option>
                                {packages?.map((itm, idx) => {
                                  return (
                                    <option value={itm.id} key={idx}>
                                      {unslugify(itm.slug)}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <div className="col-span-12 lg:col-span-7">
                            <label
                              htmlFor="departure"
                              className="col-form-label"
                            >
                              <b>Trip Start Date*</b>
                            </label>
                            <div className="depature-date">
                              <div
                                id="datepicker"
                                className="custom-date-picker"
                              >
                                <DatePicker
                                  selected={startDate}
                                  onChange={(date) => {
                                    setStartDate(date);
                                  }}
                                  selectsStart
                                  startDate={startDate}
                                  dateFormat="dd MMM yyyy"
                                  minDate={addDays(new Date(), 1)}
                                  className="form-control"
                                  shouldCloseOnSelect
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12 lg:col-span-7">
                            <label
                              htmlFor="traveller"
                              className="col-sm-6 col-form-label"
                            >
                              <b>No of Traveller*</b>
                            </label>
                            <Incrementer
                              id="traveller"
                              name="traveller"
                              number={traveller}
                              increment={increment}
                              decrement={decrement}
                              min={minPeople ? minPeople : 1}
                              max={20}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  traveller: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        {uiLoading && (
                          <div className="loading">
                            <i className="icon h-14 w-14 text-secondary">
                              <Loading fill="currentColor" />
                            </i>
                          </div>
                        )}
                      </div>
                    </div>

                    {watch("trip_id") &&
                      startDate &&
                      traveller &&
                      !uiLoading ? (
                      <>
                        {fields?.map((field, index) => {
                          return (
                            (<div
                              className="common-module bg-white shadow"
                              key={index}
                            >
                              <div className="module-title">
                                <span className="number">{index + 2}</span>
                                <div className="text">
                                  {index === 0 ? (
                                    <>
                                      <h3>Lead Traveller #{index + 1}</h3>
                                      <span className="subtitle">
                                        This traveller will serve as the contact
                                        person for the booking.
                                      </span>
                                    </>
                                  ) : (
                                    <h3>Traveller #{index + 1}</h3>
                                  )}
                                </div>
                              </div>
                              <div className="module-body">
                                <div className="grid lg:grid-cols-12 items-end gap-3">
                                  <div className="lg:col-span-8">
                                    <label
                                      className="col-form-label"
                                      htmlFor={field.id}
                                    >
                                      Full Name*
                                      <p className="help-text">
                                        Per your passport details.
                                      </p>
                                    </label>
                                    <input
                                      type="text"
                                      id={field.id}
                                      placeholder="Full Name*"
                                      className="form-control"
                                      {...register(
                                        `travellers.${index}.full_name`,
                                        {
                                          required: true,
                                        }
                                      )}
                                      aria-invalid={
                                        !!errors.travellers &&
                                          errors.travellers[index] &&
                                          typeof errors.travellers[index]
                                            .full_name !== "undefined"
                                          ? "true"
                                          : "false"
                                      }
                                    />
                  
                                  </div>
                                  <div className="lg:col-span-4">
                                    <div className="custom_select">
                                      <span className="select_indicator"></span>
                                      <select
                                        name="gender"
                                        className="form-control"
                                        {...register(
                                          `travellers.${index}.gender`,
                                          {
                                            required: true,
                                          }
                                        )}
                                        aria-invalid={
                                          !!errors.travellers &&
                                            errors.travellers[index] &&
                                            typeof errors.travellers[index]
                                              .gender !== "undefined"
                                            ? "true"
                                            : "false"
                                        }
                                      // {...register("nationality", {
                                      //   required: true,
                                      // })}
                                      // aria-invalid={
                                      //   errors.nationality ? "true" : "false"
                                      // }
                                      >
                                        <option selected disabled value="">
                                          Gender*
                                        </option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="lg:col-span-6">
                                    <label
                                      className="col-form-label"
                                      htmlFor="email"
                                    >
                                      Email / Nationality *
                                      <p className="help-text">
                                        Per your passport details.
                                      </p>
                                    </label>

                                    <input
                                      name="email"
                                      type="email"
                                      placeholder="E-mail ID*"
                                      className="form-control"
                                      {...register(
                                        `travellers.${index}.email`,
                                        {
                                          required: true,
                                          pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message:
                                              "Entered value does not match email format",
                                          },
                                        }
                                      )}
                                      aria-invalid={
                                        !!errors.travellers &&
                                          errors.travellers[index] &&
                                          typeof errors.travellers[index]
                                            .email !== "undefined"
                                          ? "true"
                                          : "false"
                                      }

                                    />
                                  </div>
                                  <div className="lg:col-span-6">
                                    <div className="custom_select">
                                      <span className="select_indicator"></span>
                                      <select
                                        name="nationality"
                                        className="form-control"
                                        {...register(
                                          `travellers.${index}.nationality`,
                                          {
                                            required: true,
                                          }
                                        )}
                                        aria-invalid={
                                          !!errors.travellers &&
                                            errors.travellers[index] &&
                                            typeof errors.travellers[index]
                                              .nationality !== "undefined"
                                            ? "true"
                                            : "false"
                                        }
                                      >
                                        <option value="">
                                          Select Nationality*
                                        </option>
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

                                  <div className="lg:col-span-8">
                                    <label
                                      className="col-form-label"
                                      htmlFor="year"
                                    >
                                      Date of Birth / Passport no*{" "}
                                      {index === 0 && (
                                        <p className="help-text">
                                          The lead traveller should be 18 years
                                          or above.
                                        </p>
                                      )}
                                    </label>
                                    <div className="grid grid-cols-12 gap-1">
                                      <div className="col-span-4">
                                        <div className="custom_select">
                                          <span className="select_indicator"></span>
                                          <select
                                            name="year"
                                            id="year"
                                            className="form-control"
                                            {...register(
                                              `travellers.${index}.year`,
                                              {
                                                required: true,
                                              }
                                            )}
                                            aria-invalid={
                                              !!errors.travellers &&
                                                errors.travellers[index] &&
                                                typeof errors.travellers[index]
                                                  .year !== "undefined"
                                                ? "true"
                                                : "false"
                                            }
                                          >
                                            <option value="" selected disabled>
                                              Year
                                            </option>
                                            {yearList?.map((itm, idx) => {
                                              return (
                                                <option key={idx} value={itm}>
                                                  {itm}
                                                </option>
                                              );
                                            })}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-span-4">
                                        <div className="custom_select">
                                          <span className="select_indicator"></span>
                                          <select
                                            name="month"
                                            id="month"
                                            className="form-control"
                                            {...register(
                                              `travellers.${index}.month`,
                                              {
                                                required: true,
                                              }
                                            )}
                                            aria-invalid={
                                              !!errors.travellers &&
                                                errors.travellers[index] &&
                                                typeof errors.travellers[index]
                                                  .month !== "undefined"
                                                ? "true"
                                                : "false"
                                            }
                                          >
                                            <option value="" selected disabled>
                                              Month
                                            </option>
                                            <option value="01">Jan</option>
                                            <option value="02">Feb</option>
                                            <option value="03">Mar</option>
                                            <option value="04">Apr</option>
                                            <option value="05">May</option>
                                            <option value="06">Jun</option>
                                            <option value="07">Jul</option>
                                            <option value="08">Aug</option>
                                            <option value="09">Sep</option>
                                            <option value="10">Oct</option>
                                            <option value="11">Nov</option>
                                            <option value="12">Dec</option>
                                          </select>
                                        </div>
                                      </div>

                                      <div className="col-span-4">
                                        <div className="custom_select">
                                          <span className="select_indicator"></span>
                                          <select
                                            name="day"
                                            id="day"
                                            className="form-control"
                                            {...register(
                                              `travellers.${index}.day`,
                                              {
                                                required: true,
                                              }
                                            )}
                                            aria-invalid={
                                              !!errors.travellers &&
                                                errors.travellers[index] &&
                                                typeof errors.travellers[index]
                                                  .day !== "undefined"
                                                ? "true"
                                                : "false"
                                            }
                                          >
                                            <option value="" selected disabled>
                                              Day
                                            </option>
                                            <option value="01">1</option>
                                            <option value="02">2</option>
                                            <option value="03">3</option>
                                            <option value="04">4</option>
                                            <option value="05">5</option>
                                            <option value="06">6</option>
                                            <option value="07">7</option>
                                            <option value="08">8</option>
                                            <option value="09">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                            <option value="22">22</option>
                                            <option value="23">23</option>
                                            <option value="24">24</option>
                                            <option value="25">25</option>
                                            <option value="26">26</option>
                                            <option value="27">27</option>
                                            <option value="28">28</option>
                                            <option value="29">29</option>
                                            <option value="30">30</option>
                                            <option value="31">31</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="lg:col-span-4">
                                    <input
                                      name="passport_no"
                                      placeholder="Passport no*"
                                      className="form-control"
                                      {...register(
                                        `travellers.${index}.passport_no`,
                                        {
                                          required: true,
                                        }
                                      )}
                                      aria-invalid={
                                        !!errors.travellers &&
                                          errors.travellers[index] &&
                                          typeof errors.travellers[index]
                                            .passport_no !== "undefined"
                                          ? "true"
                                          : "false"
                                      }
                                    />
                                  </div>

                                  <div className="lg:col-span-12">
                                    <label
                                      className="col-form-label"
                                      htmlFor="country_code"
                                    >
                                      Mobile Number*
                                      <p className="help-text">
                                        This is how we will get in touch with
                                        you, if we need to reach you at your
                                        destination
                                      </p>
                                    </label>
                                    <div className="grid lg:grid-cols-12 gap-2">
                                      <div className="lg:col-span-3">
                                        <div className="custom_select">
                                          <span className="select_indicator"></span>
                                          <select
                                            name="country_code"
                                            className="form-control"
                                            {...register(
                                              `travellers.${index}.country_code`,
                                              {
                                                required: true,
                                              }
                                            )}

                                            aria-invalid={
                                              !!errors.travellers &&
                                                errors.travellers[index] &&
                                                typeof errors.travellers[index]
                                                  .country_code !== "undefined"
                                                ? "true"
                                                : "false"
                                            }
                                          >
                                            <option value="">
                                              Select Country Code*
                                            </option>
                                            {countryCodeList.map((itm, idx) => {
                                              return (
                                                <option
                                                  value={itm.value}
                                                  key={idx}
                                                >
                                                  {itm.label} {itm.value}
                                                </option>
                                              );
                                            })}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="lg:col-span-9">
                                        <input
                                          type="tel"
                                          className="form-control"
                                          placeholder="Mobile number*"
                                          {...register(
                                            `travellers.${index}.mobile_number`,
                                            {
                                              required: true,
                                            }
                                          )}

                                          aria-invalid={
                                            !!errors.travellers &&
                                              errors.travellers[index] &&
                                              typeof errors.travellers[index]
                                                .mobile_number !== "undefined"
                                              ? "true"
                                              : "false"
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>)
                          );
                        })}
                        <div className="common-module bg-white shadow">
                          <div className="module-title">
                            <span className="number">{traveller + 2}</span>
                            <div className="text">
                              <h3>Flight Details</h3>
                              <span className="subtitle">Lead Traveller</span>
                            </div>
                          </div>

                          <div className="module-body">
                            <div className="travel-alert trip_none">
                              <p>
                                Don’t have a flight itinerary? Leave the field
                                blank and provide us with details later via
                                email.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 gap-x-3 gap-y-6">
                              <div>
                                <label
                                  className="col-form-label"
                                  htmlFor="flight_no"
                                >
                                  Arrival Date / Flight
                                  <p className="help-text">
                                    Arrival date, time and flight number
                                  </p>
                                </label>
                                <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-2">
                                  <div>
                                    <select
                                      name="a_year"
                                      id="a_year"
                                      className="form-control"
                                      {...register("a_year")}
                                    >
                                      <option value="" selected disabled>
                                        Year
                                      </option>
                                      {nearestYear?.map((itm, idx) => {
                                        return (
                                          <option
                                            key={idx}
                                            value={parseFloat(itm)}
                                          >
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="a_month"
                                      id="a_month"
                                      className="form-control"
                                      {...register("a_month")}
                                    // {...register("month", {
                                    //   required: true,
                                    // })}
                                    // aria-invalid={
                                    //   errors.month ? "true" : "false"
                                    // }
                                    // onChange={(e) => {
                                    //   setBirthDate({
                                    //     ...birthDate,
                                    //     month: e.target.value,
                                    //   });
                                    // }}
                                    >
                                      <option value="" selected disabled>
                                        Month
                                      </option>
                                      <option value="01">Jan</option>
                                      <option value="02">Feb</option>
                                      <option value="03">Mar</option>
                                      <option value="04">Apr</option>
                                      <option value="05">May</option>
                                      <option value="06">Jun</option>
                                      <option value="07">Jul</option>
                                      <option value="08">Aug</option>
                                      <option value="09">Sep</option>
                                      <option value="10">Oct</option>
                                      <option value="11">Nov</option>
                                      <option value="12">Dec</option>
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="a_day"
                                      id="a_day"
                                      className="form-control"
                                      {...register("a_day")}
                                    >
                                      <option value="" selected disabled>
                                        Day
                                      </option>
                                      {dayList.map((itm, idx) => {
                                        return (
                                          <option value={itm} key={idx}>
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="a_hour"
                                      id="a_hour"
                                      className="form-control"
                                      {...register("a_hour")}
                                    >
                                      <option value="" selected disabled>
                                        Hour
                                      </option>
                                      {hourList.map((itm, idx) => {
                                        return (
                                          <option value={itm} key={idx}>
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="a_minute"
                                      id="a_minute"
                                      className="form-control"
                                      {...register("a_minute")}
                                    >
                                      <option value="" selected disabled>
                                        Minute
                                      </option>
                                      {minuteList.map((itm, idx) => {
                                        return (
                                          <option value={itm} key={idx}>
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      name="arrival_flight_no"
                                      className="form-control"
                                      placeholder="Flight number"
                                      {...register("arrival_flight_no")}
                                    // aria-invalid={
                                    //   errors.arrival_date ? "true" : "false"
                                    // }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div >
                                <label
                                  className="col-form-label"
                                  htmlFor="airport_pickup_yes"
                                >
                                  Airport Pickup
                                </label>

                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value="Yes"
                                    name="airport_pickup"
                                    {...register("airport_pickup")}
                                    // aria-invalid={
                                    //   errors.arrival_date ? "true" : "false"
                                    // }
                                    id="airport_pickup_yes"
                                  //value={bookingData.travel_insurance}
                                  // onChange={(e) =>
                                  //   setBookingData({
                                  //     ...bookingData,
                                  //     travel_insurance: e.target.value,
                                  //   })
                                  // }
                                  />
                                  <label
                                    className="form-check-label col-form-label"
                                    htmlFor="airport_pickup_yes"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value="No"
                                    name="airport_pickup"
                                    {...register("airport_pickup")}
                                    // aria-invalid={
                                    //   errors.arrival_date ? "true" : "false"
                                    // }
                                    id="airport_pickup_no"
                                  />
                                  <label
                                    className="form-check-label col-form-label"
                                    htmlFor="airport_pickup_no"
                                  >
                                    No
                                  </label>
                                </div>
                              </div>
                              <div>
                                <label
                                  className="col-form-label"
                                  htmlFor="d_year"
                                >
                                  Departure Date / Flight
                                  <p className="help-text">
                                    Departure date, time and flight number
                                  </p>
                                </label>
                                <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-1">
                                  <div>
                                    <select
                                      name="d_year"
                                      id="d_year"
                                      className="form-control"
                                      {...register("d_year")}
                                    // {...register("year", {
                                    //   required: true,
                                    // })}
                                    // aria-invalid={
                                    //   errors.year ? "true" : "false"
                                    // }
                                    // onChange={(e) => {
                                    //   setBirthDate({
                                    //     ...birthDate,
                                    //     year: e.target.value,
                                    //   });
                                    // }}
                                    >
                                      <option value="" selected disabled>
                                        Year
                                      </option>
                                      {nearestYear?.map((itm, idx) => {
                                        return (
                                          <option key={idx} value={itm}>
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="d_month"
                                      id="d_month"
                                      className="form-control"
                                      {...register("d_month")}
                                    // {...register("month", {
                                    //   required: true,
                                    // })}
                                    // aria-invalid={
                                    //   errors.month ? "true" : "false"
                                    // }
                                    // onChange={(e) => {
                                    //   setBirthDate({
                                    //     ...birthDate,
                                    //     month: e.target.value,
                                    //   });
                                    // }}
                                    >
                                      <option value="" selected disabled>
                                        Month
                                      </option>
                                      <option value="01">Jan</option>
                                      <option value="02">Feb</option>
                                      <option value="03">Mar</option>
                                      <option value="04">Apr</option>
                                      <option value="05">May</option>
                                      <option value="06">Jun</option>
                                      <option value="07">Jul</option>
                                      <option value="08">Aug</option>
                                      <option value="09">Sep</option>
                                      <option value="10">Oct</option>
                                      <option value="11">Nov</option>
                                      <option value="12">Dec</option>
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="d_day"
                                      id="d_day"
                                      className="form-control"
                                      {...register("d_day")}
                                    >
                                      <option value="" selected disabled>
                                        Day
                                      </option>
                                      {dayList.map((itm, idx) => {
                                        return (
                                          <option value={itm} key={idx}>
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="d_hour"
                                      id="d_hour"
                                      className="form-control"
                                      {...register("d_hour")}
                                    >
                                      <option value="" selected disabled>
                                        Hour
                                      </option>
                                      {hourList.map((itm, idx) => {
                                        return (
                                          <option value={itm} key={idx}>
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <select
                                      name="d_minute"
                                      id="d_minute"
                                      className="form-control"
                                      {...register("d_minute")}
                                    >
                                      <option value="" selected disabled>
                                        Minute
                                      </option>
                                      {minuteList.map((itm, idx) => {
                                        return (
                                          <option value={itm} key={idx}>
                                            {itm}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      name="departure_flight_no"
                                      className="form-control"
                                      placeholder="Flight number"
                                      {...register("departure_flight_no")}
                                    // aria-invalid={
                                    //   errors.departure_flight_no
                                    //     ? "true"
                                    //     : "false"
                                    // }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label
                                  className="col-form-label"
                                  htmlFor="full_name"
                                >
                                  Airport Dropoff
                                </label>

                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="airport_dropoff_yes"
                                    name="airport_dropoff"
                                    value="Yes"
                                    {...register("airport_dropoff", {
                                      required: false,
                                    })}
                                  // aria-invalid={
                                  //   errors.airport_dropoff ? "true" : "false"
                                  // }
                                  />
                                  <label
                                    className="form-check-label col-form-label"
                                    htmlFor="airport_dropoff_yes"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="airport_dropoff"
                                    value="No"
                                    {...register("airport_dropoff", {
                                      required: false,
                                    })}
                                    // aria-invalid={
                                    //   errors.airport_dropoff ? "true" : "false"
                                    // }
                                    id="airport_dropoff_no"
                                  />
                                  <label
                                    className="form-check-label col-form-label"
                                    htmlFor="airport_dropoff_no"
                                  >
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="common-module bg-white shadow">
                          <div className="module-title">
                            <span className="number">{traveller + 3}</span>
                            <div className="text">
                              <h3>Other Information</h3>
                            </div>
                          </div>
                          <div className="module-body">
                            <div className="grid lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-3">
                                <h5
                                  className="font-semibold text-xl text-primary mb-1"
                                >
                                  Travel Insurance*
                                  
                                </h5>
                                  <p className="help-text text-sm text-muted">
                                    Please be advised that travel Insurance is
                                    mandatory when traveling with us. It is
                                    imperative that your policy covers both
                                    medical and emergency evacuation.
                                    Additionally, it is essential to ensure that
                                    your insurance policy covers the highest
                                    elevation of your travel destination. This
                                    is crucial to ensure your safety and
                                    well-being during your trip.
                                  </p>

                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="full_coverage"
                                    value="I have full coverage of Insurance"
                                    name="travel_insurance"
                                    {...register("travel_insurance", {
                                      required: true,
                                    })}
                                    aria-invalid={
                                      errors.travel_insurance ? "true" : "false"
                                    }

                                  />
                                  <label
                                    className="form-check-label col-form-label"
                                    htmlFor="full_coverage"
                                  >
                                    I have full coverage of Insurance
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value="Not yet bought (I will buy insurance later)"
                                    name="travel_insurance"
                                    id="not_yet_bought"
                                    {...register("travel_insurance", {
                                      required: true,
                                    })}
                                    aria-invalid={
                                      errors.travel_insurance ? "true" : "false"
                                    }

                                  />
                                  <label
                                    className="form-check-label col-form-label"
                                    htmlFor="not_yet_bought"
                                  >
                                    Not yet bought (I will buy insurance later)
                                  </label>
                                </div>
                                <br />
                                <div className="travel-alert trip_none">
                                  <p>
                                    <b>Important Note:</b>
                                    <br /> A copy of your travel insurance must
                                    be provided before you proceed with the
                                    adventure.
                                  </p>
                                </div>
                              </div>
                              <div className="lg:col-span-3">
                                <h5
                                  className="font-semibold text-xl text-primary"
                                >
                                  Special Requirment* </h5>
                                  <p className="help-text text-muted text-sm">
                                    Please tell us more about yourself to help
                                    you better.
                                  </p>

                                <textarea
                                  name="special_requirement"
                                  id="pickup-detail"
                                  rows="6"
                                  className="form-control"
                                  {...register("special_requirement", {
                                    required: true,
                                  })}
                                  aria-invalid={
                                    errors.special_requirement
                                      ? "true"
                                      : "false"
                                  }
                                ></textarea>
                              </div>
                              <div className="lg:col-span-2">
                                <h5
                                  className="font-semibold text-xl text-primary mb-2.5"
                                >
                                  How did you find Us?
                                </h5>
                                <div className="custom_select">
                                  <span className="select_indicator"></span>
                                  <select
                                    name="finding_us"
                                    id="find_us"
                                    className="form-control"
                                    onChange={(e) => setFindUs(e.target.value)}
                                  >
                                    <option value="" disabled selected>
                                      Select an option
                                    </option>
                                    <option value="Google">Google</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Yahoo">Yahoo</option>
                                    <option value="Bing">Bing</option>
                                    <option value="Trip Advisor">
                                      Trip Advisor
                                    </option>
                                    <option value="Friend">Friend</option>
                                    <option value="Client Reference">
                                      Client Reference
                                    </option>
                                    <option value="I am regular client">
                                      I am regular client
                                    </option>
                                    <option value="Others">Others</option>
                                  </select>
                                </div>
                              </div>

                              {findus === "Others" && (
                                <div className="lg:col-span-2">
                                  <input
                                    type="text"
                                    placeholder="Please Specify"
                                    className="form-control"
                                    onChange={(e) =>
                                      setCustomFindUs(e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={terms}
                              id="terms"
                              onChange={(e) => setTerms(!e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="terms">
                              I accept terms and conditions &nbsp;
                              <Link
                                href={
                                  BASE_URL + "terms-and-conditions"
                                }
                                target="_blank"
                              >
                                <i className="icon text-secondary">
                                  <QuestionCircleFill fill="currentColor" />
                                </i>
                              </Link>
                            </label>
                          </div>
                        </div>
                        <div className="lg:col-span-3">
                          <button
                            className="btn btn-primary btn-lg mt-6"
                            type="submit"
                            disabled={terms || loading}
                          >
                            {loading ? "Submitting" : "Book Now"}
                          </button>
                          {loading && (
                            <div className="loading">
                              <i className="icon h-14 w-14 text-secondary">
                                <Loading fill="currentColor" />
                              </i>
                            </div>
                          )}
                        </div>
                      </>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  );
}