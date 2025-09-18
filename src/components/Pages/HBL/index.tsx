"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { BadgeInfo, X } from "lucide-react";
import Loading from "../../Loading";
import {
  PRODUCTION_SERVER,
  RECAPTCHA_SITE_KEY,
  SITE_KEY,
} from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";

// Type definitions
interface PackageOption {
  id: string;
  title: string;
}
interface OptionsData {
  package: PackageOption[];
}
interface OnlinePaymentProps {
  optionsData: OptionsData;
}
interface FormData {
  package_id: string;
  custom_title?: string;
  total_price: number;
  customer_name: string;
  customer_email: string;
}
interface PaymentResponse {
  payment_url: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
      ready(callback: () => void): void;
    };
  }
}

const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));

export default function OnlinePayment({ optionsData }: OnlinePaymentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>();
  const packages = useMemo(() => optionsData?.package || [], [optionsData]);
  const totalPrice = watch("total_price") || 0;
  const charge = useMemo(() => Number(totalPrice) * (3.5 / 100), [totalPrice]);

  const [isRecaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    // Wait for the reCAPTCHA script to be loaded
    const checkRecaptcha = () => {
      if (typeof window !== 'undefined' && typeof window.grecaptcha !== 'undefined') {
        setRecaptchaReady(true);
      } else {
        setTimeout(checkRecaptcha, 100);
      }
    };
    checkRecaptcha();
  }, []);

  const resetForm = () => reset();

  const onSubmit = async (formData: FormData) => {
    try {
      if (!isRecaptchaReady) {
        console.log('reCAPTCHA is not ready yet');
        return;
      }

      const token = await window.grecaptcha?.execute(RECAPTCHA_SITE_KEY as string, {
        action: 'form_submission'
      });


      setLoading(true);

      const data = {
        ...formData,
        percent: 100,
        customer_total: (Number(formData.total_price) + charge).toFixed(2),
        captcha_response: token,
      };

      const res = await fetch(`${PRODUCTION_SERVER}/payment/hbl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          sitekey: SITE_KEY,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const paymentResponse: PaymentResponse = await res.json();
      router.push(paymentResponse.payment_url);

      resetForm();

    } catch (err) {
      toast({
        description: (
          <div className="flex items-center gap-x-2 font-bold">
            <i className="icon h-5 w-5 text-danger">
              <BadgeInfo />
            </i>
            <span>{err instanceof Error ? err.message : "An unknown error occurred."}</span>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      <div className="container common-box pt-0" role="main">
        <div className="container">
          <div className="lg:w-5/6 lg:mx-auto">
            <div className="page-title pt-10 pb-6">
              <Breadcrumb currentPage="Online Payment" />
              <h1>Online Payment</h1>
            </div>
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <form
                  className="needs-validation flm-form"
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
                  <div className="common-modul bg-white shadow-base p-3 md:p-6 lg:p-8 mb0">
                    <div className="grid grid-cols-1 gap-x-3 gap-y-6">
                      <div>
                        <label htmlFor="package_id">Select a package<span className="text-danger inline-block ml-1">*</span></label>
                        <div className="custom_select">
                          <span className="select_indicator"></span>
                          <select
                            className="form-control"
                            id="package_id"
                            {...register("package_id", {
                              required: "Please select a package.",
                            })}
                            aria-invalid={errors.package_id ? "true" : "false"}
                          >
                            <option value="">Select a Package*</option>
                            <option value="0">Custom Package</option>
                            {packages?.map((itm) => {
                              return (
                                <option value={itm.id} key={itm.id}>
                                  {itm.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {errors.package_id && (
                          <p className="invalid-feedback">{errors.package_id.message}</p>
                        )}
                      </div>
                      {watch("package_id") === "0" && (
                        <div className="col-12">
                          <label htmlFor="pickup-detail">
                            Trip Name and Details<span className="text-danger inline-block ml-1">*</span>
                          </label>

                          <textarea
                            id="pickup-detail"
                            placeholder="Please mention the name of the customized trip or service in the designated field."
                            rows={4}
                            className="form-control"
                            {...register("custom_title", {
                              required: "Please provide trip details for your custom package.",
                            })}
                            aria-invalid={
                              errors.custom_title ? "true" : "false"
                            }
                          ></textarea>
                          {errors.custom_title && (
                            <p className="invalid-feedback">{errors.custom_title.message}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <label htmlFor="total_price">Type Amount in US$<span className="text-danger inline-block ml-1">*</span></label>
                        <div className="row g-1">
                          <div className="col-12">
                            <input
                              type="number"
                              id="total_price"
                              min={0}
                              step={1}
                              className="form-control"
                              {...register("total_price", {
                                required: "Please enter an amount.",
                                valueAsNumber: true,
                              })}
                              aria-invalid={
                                errors.total_price ? "true" : "false"
                              }
                            />
                            {errors.total_price && (
                              <p className="invalid-feedback">{errors.total_price.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="name">
                          Your Full Name<span className="text-danger inline-block ml-1">*</span>
                        </label>
                        <div className="row g-1">
                          <div className="col-12">
                            <input
                              type="text"
                              id="name"
                              placeholder="Full Name*"
                              className="form-control"
                              {...register("customer_name", {
                                required: "Please enter your full name.",
                              })}
                              aria-invalid={
                                errors.customer_name ? "true" : "false"
                              }
                            />
                            {errors.customer_name && (
                              <p className="invalid-feedback">
                                {errors.customer_name.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email">
                          Your Email<span className="text-danger inline-block ml-1">*</span>
                        </label>

                        <div className="row g-1">
                          <div className="col-12">
                            <input
                              id="email"
                              type="email"
                              placeholder="E-mail ID*"
                              className="form-control"
                              {...register("customer_email", {
                                required: "Please enter your email.",
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
                              <p className="invalid-feedback">
                                {errors.customer_email.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {loading && (
                    <div className="loading">
                      <i className="icon h-14 w-14 text-secondary">
                        <Loading title="Looding" titleId="" fill="CurrentColor" />
                      </i>
                    </div>
                  )}
                  <button
                    className="btn btn-primary btn-lg rounded-lg mt-6"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Proceeding..." : "Proceed to Payment"}
                  </button>
                </form>
              </div>
              <aside className="lg:col-span-4">
                <div className="sidebar-module">
                  {watch("total_price") >= 1 && (
                    <div className="price-calculator mb-6 bg-white p-3 md:p-6 lg:p-8 rounded-md shadow-base">
                      <h3 className="module-title text-lg mb-6">Price Summary</h3>
                      <ul className="[&>li]:flex [&>li]:items-center [&>li]:justify-between [&>li>.li-title]:text-headings/70 [&>li>.li-description]:text-primary [&>li>.li-description]:font-bold  [&>li+li]:mt-2.5 [&>li+li]:pt-2.5 [&>li+li]:border-t [&>li+li]:bordrer-t-border">
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

                  <div className="associates">
                    <div className=" cards">
                      <p className="text-headings/70 text-sm leading-[1.5] font-medium mb-1">
                        This is a secure and SSL encrypted payment. Your card
                        details are safe!
                      </p>
                      <figure className="card inline-block max-w-[200px] mt-3">
                        <Image
                          src="/payment.png"
                          height={33}
                          width={302}
                          alt="We Accept"
                        />
                      </figure>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}