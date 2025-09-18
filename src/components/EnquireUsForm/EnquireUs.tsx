"use client";

import { useState, FormEvent } from "react";
import Script from "next/script";
import { useToast } from "@/hooks/use-toast";
import {
  PRODUCTION_SERVER,
  RECAPTCHA_SITE_KEY,
  SITE_KEY,
} from "@/lib/constants";
import Loading from "@/components/Loading";
import { BadgeInfo, Check } from "lucide-react";


// Interfaces for package data
interface Package {
  id: number;
  title: string;
}

// Interface for component props
interface EnquireUsProps {
  title?: string;
  haslabel?: boolean;
  horizontalLayout?: boolean;
  enablePhone?: boolean;
  type: string;
  classes?: string;
  subTitle?: string;
  packages?: Package[];
  defaultPackage?: string;
  hasTripName?: boolean;
}

export default function EnquireUs({
  title,
  haslabel,
  horizontalLayout,
  enablePhone,
  type,
  classes,
  subTitle,
  packages,
  defaultPackage,
  hasTripName,
}: EnquireUsProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    const contactForm = document.getElementById("enquire-form") as HTMLFormElement;
    if (contactForm) {
      contactForm.reset();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // const fetchIpAddress = async (): Promise<string> => {
      //   try {
      //     const response = await fetch("https://api.ipify.org/?format=json");
      //     const data = await response.json();
      //     return data.ip;
      //   } catch (error) {
      //     console.error("Error fetching IP address:", error);
      //     return "";
      //   }
      // };

      // const ipAddress = await fetchIpAddress();

      // if (!window.grecaptcha) throw new Error("reCAPTCHA not loaded");

      // setLoading(true);

      // const token = await new Promise<string>((resolve, reject) => {
      //   window.grecaptcha?.ready(async () => {
      //     try {
      //       const t = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "contact_form" });
      //       resolve(t);
      //     } catch (err) {
      //       reject(err);
      //     }
      //   });
      // });

      const form = event.currentTarget;
      const data = {
        name: (form.elements.namedItem("full_name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        message: (form.elements.namedItem("contactmessage") as HTMLTextAreaElement).value,
        type,
        url: window.location.href,
        captcha_response: '',
        number_of_traveller: parseInt((form.elements.namedItem("number_of_traveller") as HTMLInputElement).value),
        ip_address: '',
        ...(enablePhone && { phone: (form.elements.namedItem("phone") as HTMLInputElement).value }),
        ...(packages && { trip_id: parseInt((form.elements.namedItem("trip_id") as HTMLSelectElement).value) }),
      };

      console.log(data);


      const res = await fetch(`${PRODUCTION_SERVER}/contactmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          sitekey: SITE_KEY,
        },
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        resetForm();
        toast({
          description: (
            <div className="flex items-center gap-x-2 font-bold">
              <i className="icon h-5 w-5 bg-success text-white rounded-full p-1">
                <Check />
              </i>
              <span>
                Your inquiry has been received. One of our travel experts will
                contact you shortly.
              </span>
            </div>
          ),
        });
      } else {
        toast({
          description: (
            <div className="flex items-center gap-x-2 font-bold">
              <i className="icon h-5 w-5 text-danger">
                <BadgeInfo />
              </i>
              <span>An error occurred. Please try again later.</span>
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        description: (
          <div className="flex items-center gap-x-2 font-bold">
            <i className="icon h-5 w-5 text-danger">
              <BadgeInfo />
            </i>
            <span>An error occurred. Please try again later.</span>
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
        strategy="lazyOnload"
        defer
      />
      <div className={classes}>
        {title && (
          <div className="module-title">
            <h3>{title}</h3>
            {subTitle && <span className="text-muted">{subTitle}</span>}
          </div>
        )}

        <form onSubmit={handleSubmit} id="enquire-form">
          {loading && (
            <div className="loading block">
              <i className="icon h-12 w-12 text-secondary">
                <Loading fill="currentColor" />
              </i>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {hasTripName && packages && (
              <div className="col-span-2">
                <label htmlFor="trip_id" className="col-form-label block">
                  Select your trip*
                </label>
                <div className="custom_select">
                  <span className="select_indicator"></span>
                  <select
                    className="form-control"
                    required
                    name="trip_id"
                    defaultValue={defaultPackage}
                  >
                    <option>Select a Package*</option>
                    {packages.map((itm, idx) => (
                      <option value={itm.id} key={idx}>
                        {itm.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div
              className={
                horizontalLayout ? "col-span-2 md:col-span-1" : "col-span-2"
              }
            >
              {haslabel && (
                <label htmlFor="full_name" className="form-label block">
                  Your Name
                </label>
              )}
              <input
                type="text"
                name="full_name"
                id="full_name"
                className="form-control"
                placeholder="Full Name*"
                required
              />
            </div>
            <div
              className={
                horizontalLayout ? "col-span-2 md:col-span-1" : "col-span-2"
              }
            >
              {haslabel && (
                <label htmlFor="email" className="form-label">
                  E-mail*
                </label>
              )}
              <input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail*"
                className="form-control"
                required
              />
            </div>
            {enablePhone && (
              <div
                className={
                  horizontalLayout ? "col-span-2 md:col-span-1" : "col-span-2"
                }
              >
                {haslabel && (
                  <label htmlFor="phone" className="form-label block">
                    Mobile
                  </label>
                )}
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Mobile*"
                  className="form-control"
                  required
                />
              </div>
            )}
            <div className={enablePhone ? "col-span-2 md:col-span-1" : "col-span-2"}>
              {haslabel && (
                <label htmlFor="no_of_traveller" className="form-label block">
                  No. Of Travellers*
                </label>
              )}
              <input
                type="number"
                min={1}
                id="no_of_traveller"
                name="number_of_traveller"
                placeholder="No of Travellers*"
                className="form-control"
                required
              />
            </div>
            <div className="col-span-2">
              {haslabel && (
                <label htmlFor="message" className="form-label block">
                  Message*
                </label>
              )}
              <textarea
                name="contactmessage"
                id="message"
                rows={6}
                placeholder="Message*"
                className="form-control"
                required
              ></textarea>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="btn text-base border-0 font-bold rounded-lg px-5 py-2.5 block btn-primary"
              >
                {loading ? (
                  <>
                    <i className="spinner-border"></i> Sending
                  </>
                ) : (
                  "SUBMIT"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}