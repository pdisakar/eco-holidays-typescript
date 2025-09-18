"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
const PageBanner = dynamic(() => import("@/components/Banners/PageBanner"));
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));
import defaultBanner from "@/assets/images/default-banner.jpg";
import Loading from "../../Loading";
const Cards = dynamic(() => import("@/layouts/Footer/Cards"));
import { Lock, X } from "react-bootstrap-icons";
import Script from "next/script";
import axios from "axios";
import {
  PRODUCTION_SERVER,
  RECAPTCHA_SITE_KEY,
  SITE_KEY,
} from "@/lib/constants";

export default function OnlinePayment({ optionsData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const packages = useMemo(() => optionsData?.package || [], [optionsData]);
  const charge = useMemo(() => Number(watch("total_price")) * (3.5 / 100), [watch("total_price")]);

  const resetForm = () => {
    document.getElementById("booking-form").reset();
  };

  const onSubmit = async (formData) => {
    const data = {
      ...formData,
      percent: 100,
      customer_total: Number(Number(formData.total_price) + charge).toFixed(2),
    };

    setLoading(true);

    try {
      const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "booking_form" });
      data.captcha_response = token;

      const res = await axios.post(`${PRODUCTION_SERVER}/payment/nabil`, data, {
        headers: {
          Accept: "application/json",
          sitekey: SITE_KEY,
        },
      });

      if (res.status === 200) {
        router.push(res.data.payment_url);
        resetForm();
        setMessage("Your information has been submitted.");
        setMessageType("success");
      } else {
        setMessage("Some error occurred");
        setMessageType("danger");
      }
    } catch (err) {
      setMessage(err.message);
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      strategy="lazyOnload"
    ></Script>
    <PageBanner
      bannerImage={defaultBanner}
      defaultBanner
      pageTitle="Online Payment"
    />
    <div className="container booking-form common-box pt-0" role="main">
      <div className="container">
        <div className="lg:w-5/6 lg:mx-auto">
          <div className="page-title-area">
            <div className="title mb-0">
              <h1>Payment</h1>
            </div>
            <Breadcrumb currentPage="Online Payment" />
          </div>

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
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <form
                id="booking-form"
                className="needs-validation"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* {loading ? (
                  <div className="loading">
                    <i className="icon h-14 w-14 text-secondary">
                      <Loading fill="CurrentColor" />
                    </i>
                  </div>
                ) : null} */}
                <div className="common-module bg-white shadow mb0">
                  <div className="grid grid-cols-1 gap-x-3 gap-y-6">
                    <div>
                      <label htmlFor="departure" className="col-form-label">
                        <b>Select a package*</b>
                      </label>
                      <div className="custom_select">
                        <span className="select_indicator"></span>
                        <select
                          className="form-control"
                          id="package_id"
                          name="package_id"
                          {...register("package_id", {
                            required: true,
                          })}
                          aria-invalid={errors.package_id ? "true" : "false"}
                        >
                          <option value="">Select a Package*</option>
                          <option value="0">Custom Package</option>
                          {packages?.map((itm, idx) => {
                            return (
                              <option value={itm.id} key={idx}>
                                {itm.title}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {errors.package_id && (
                        <p>{errors.package_id.message}</p>
                      )}
                    </div>
                    {watch("package_id") === "0" && (
                      <div className="col-12">
                        <label
                          className="col-form-label"
                          htmlFor="pickup-detail"
                        >
                          <b>Trip Name and Details*</b>
                        </label>

                        <textarea
                          name="custom_title"
                          id="pickup-detail"
                          placeholder="Please mention the name of the customized trip or service in the designated field."
                          rows="4"
                          className="form-control"
                          {...register("custom_title", {
                            required: true,
                          })}
                          aria-invalid={
                            errors.custom_title ? "true" : "false"
                          }
                        ></textarea>
                      </div>
                    )}

                    <div>
                      <label htmlFor="total_price" className="col-form-label">
                        <b>Type Amount in US$</b>
                      </label>
                      <div className="row g-1">
                        <div className="col-12">
                          <input
                            type="number"
                            name="total_price"
                            min={0}
                            step={1}
                            className="form-control"
                            {...register("total_price", {
                              required: true,
                              valueAsNumber: true,
                            })}
                            aria-invalid={
                              errors.total_price ? "true" : "false"
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="name" className="col-form-label">
                        <b>
                          Your Full Name<span>*</span>
                        </b>
                      </label>
                      <div className="row g-1">
                        <div className="col-12">
                          <input
                            type="text"
                            id="name"
                            placeholder="Full Name*"
                            className="form-control"
                            {...register("customer_name", {
                              required: true,
                            })}
                            aria-invalid={
                              errors.customer_name ? "true" : "false"
                            }
                          />
                          {errors.customer_name && (
                            <span className="invalid-feedback">
                              Please enter a full name
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="col-form-label">
                        <b>
                          Your Email<span>*</span>
                        </b>
                      </label>

                      <div className="row g-1">
                        <div className="col-12">
                          <input
                            name="customer_email"
                            type="email"
                            placeholder="E-mail ID*"
                            className="form-control"
                            {...register("customer_email", {
                              required: true,
                              pattern: {
                                value: /\S+@\S+\.\S+/,
                                message:
                                  "Entered value does not match email format",
                              },
                            })}
                            aria-invalid={
                              errors.customer_email ? "true" : "false"
                            }
                          />
                          {errors.customer_email && (
                            <span className="invalid-feedback">
                              {errors.customer_email.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="loading">
                    <i className="icon h-14 w-14 text-secondary">
                      <Loading fill="CurrentColor" />
                    </i>
                  </div>
                )}
                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "proceeding" : "Proceed to Payment"}
                </button>
              </form>
            </div>
            <aside className="lg:col-span-4">
              <div className="sidebar-module">
                {watch("total_price") >= 1 && (
                  <div className="price-calculator">
                    <h3 className="module-title">Price Summary</h3>
                    <ul>
                      <li>
                        <span className="li-title">Package Price</span>
                        <span className="li-description">
                          US$ {Number(watch("total_price")).toFixed(2)}
                        </span>
                      </li>
                      <li>
                        <span className="li-title">3.5% card fee</span>
                        <span className="li-description">
                          US$ {charge.toFixed(2)}
                        </span>
                      </li>
                      <li>
                        <span className="li-title">Total Price</span>
                        <span className="li-description">
                          US${" "}
                          {(Number(watch("total_price")) + charge).toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
                <div className="travel-alert">
                  <div className="content">
                    <p>
                      <b>Note:</b>
                      <br />
                      For credit card payment, 3.5% extra will be levied to
                      you as credit card processing fee by bank. Your card
                      will be processed by Bank securely.
                    </p>
                  </div>
                </div>

                <div className="travel-alert trip_none">
                  <div className="content">
                    <i className="icon">
                      <Lock fill="currentColor" />
                    </i>
                    <div>
                      <p>
                        This is a secure and SSL encrypted payment via 2C2P.
                        Your credit card details are safe!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="associates">
                  <div className="content-list cards mt-2.5">
                    <Cards />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </>);
}
