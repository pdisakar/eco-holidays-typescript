"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));
const Cards = dynamic(() => import("@/layouts/Footer/Cards"));
import { Lock, X } from "react-bootstrap-icons";
import Script from "next/script";
import Loading from "../../Loading";
import { PRODUCTION_SERVER, RECAPTCHA_SITE_KEY, SITE_KEY } from "@/lib/constants";
import axios from "axios";

export default function Checkout({ data, optionsData }) {
  const router = useRouter();
  const [packages] = useState(optionsData?.package);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState();
  const resetForm = () => {
    const form = document.getElementById("payment-form");
    form.reset();
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  useForm();

  useEffect(() => {
    setValue("customer_name", data?.customer_name);
    setValue("customer_email", data?.customer_email);
    setValue("total_price", data?.customer_total);
    setValue("percent", data?.percent);
    setValue("package_id", data?.package_id);
    setValue("custom_title", data?.custom_title);
  }, [setValue]);

  const charge = Number(watch("total_price")) * (3.5 / 100);

  const onSubmit = async (formData) => {
    let fdata = {
      ...formData,
      percent: 100,
      package_id: parseFloat(formData.package_id),
      customer_total: parseFloat(
        (Number(formData.total_price) + Number(charge)).toFixed(2)
      ),
    };

    ["total_price"].forEach((e) => delete data[e]);

    setLoading(true);

    await grecaptcha
      .execute(RECAPTCHA_SITE_KEY, {
        action: "payment_form",
      })
      .then((token) => {
        fdata.captcha_response = token;
        axios
          .post(`${PRODUCTION_SERVER}/payment/nabil`, fdata, {
            headers: {
              Accept: "application/json",
              sitekey: SITE_KEY
            },
          })
          .then((res) => {
            if (res.status === 200) {
              router.push(res.data.payment_url);
              resetForm();
              setMessage("Your information has been submitted.");
              setMessageType("success");
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


  return (<>
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      strategy="lazyOnload"
    ></Script>
    <div className="container common-box pt-0" role="main">
      <div className="container">
      <div className="lg:w-10/12 lg:mx-auto">
            <div className="page-title-area">
              <div className="title mb-0">
                <h1>Make a Payment</h1>
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
                    <X  fill="currentColor" />
                  </i>
                </button>
              </div>
            ) : null}
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <form
                  id="payment-form"
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {loading ? <div className="loading"></div> : null}
                  <div className="common-module bg-white shadow">
                    <div className="module-body">
                      <div className="grid grid-cols-12 gap-x-3 gap-y-5">
                        <div className="col-span-12">
                          <label
                            htmlFor="departure"
                            className="col-form-label"
                          >
                            <b>Select a package*</b>
                          </label>
                          <div className="row g-1">
                            <div className="col-12">
                              <div className="custom_select">
                                <span className="select_indicator"></span>
                                <select
                                  className="form-control"
                                  required
                                  readOnly
                                  disabled
                                  name="package_id"
                                  {...register("package_id", {
                                    required: true,
                                  })}
                                  aria-invalid={
                                    errors.package_id ? "true" : "false"
                                  }
                                >
                                  <option>Slect a Package*</option>
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
                            </div>
                            {watch("package_id") == 0 && (
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
                                  value={data?.custom_title}
                                  placeholder="Please mention the name of the customized trip or service in the designated field."
                                  rows="4"
                                  readOnly
                                  disabled
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
                          </div>
                        </div>
                        <div className="col-span-12">
                          <label htmlFor="total_price">
                            <b className="help-text">Type Amount in US$</b>
                          </label>
                          <div className="row g-1">
                            <div className="col-12">
                              <input
                                type="number"
                                readOnly
                                disabled
                                name="total_price"
                                value={data?.customer_total}
                                min={0}
                                step={1}
                                className="form-control"
                                {...register("total_price", {
                                  required: true,
                                  pattern: {
                                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                  },
                                })}
                                aria-invalid={
                                  errors.total_price ? "true" : "false"
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12">
                          <label
                            htmlFor="name"
                            className="col-sm-6 col-form-label"
                          >
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
                        <div className="col-span-12">
                          <label
                            htmlFor="email"
                            className="col-sm-6 col-form-label"
                          >
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
                  </div>

                

                  <div className="col-span-12">
                    {loading && (
                      <div className="loading">
                         <i className="icon h-14 w-14 text-secondary">
                          <Loading fill="currentColor" />
                        </i>
                      </div>
                    )}
                    <button
                      className="btn btn-primary btn-lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Proceeding..." : "Proceed to Payment"}
                    </button>
                  </div>
                </form>
              </div>
              <aside className="lg:col-span-4">
                <div className="sidebar-module">
                  {watch("total_price") && (
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
                            {(Number(watch("total_price")) + charge).toFixed(
                              2
                            )}
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
                          To pay for the order, enter your card details. Data
                          communication is secured by the TLS protocol.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="associates mt-2 text-right">
                    <div className="content-list cards">
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

