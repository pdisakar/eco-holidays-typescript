"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Script from "next/script";
import { X } from "react-bootstrap-icons";
import axios from "axios";
import { PRODUCTION_SERVER, RECAPTCHA_SITE_KEY, SITE_KEY } from "@/lib/constants";

export default function CommentForm({ title, classes, subTitle, blogId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const resetForm = () => {
    const contactForm = document.getElementById("comment_form");
    contactForm.reset();
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      // Fetch IP address
      const fetchIpAddress = async () => {
        try {
          const response = await fetch("https://api.ipify.org/?format=json");
          const data = await response.json();
          return data.ip;
        } catch (error) {
          console.error("Error fetching IP address:", error);
          return "";
        }
      };

      const ipAddress = await fetchIpAddress();

      const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "comment_form",
      });
      let data = {
        blog_id: blogId,
        parent_id: 0,
        commentor_name: formData.full_name,
        commentor_email: formData.email,
        commentor_address: "",
        commentor_contact: "",
        comment: formData.comment,
        ip_address: ipAddress,
        captcha_response: token,
      };

      const res = await axios.post(`${PRODUCTION_SERVER}/blog/comment`, data, {
        headers: {
          Accept: "application/json",
          sitekey: SITE_KEY,
        },
      });

      if (res.status === 200) {
        resetForm();
        setMessage("your comment submitted successfully");
      } else {
        setMessage("Some error occurred.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Some error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      strategy="lazyOnload"
    ></Script>
    <div className={classes}>
      {title && (
        <div className="module-title">
          <h3 className="module-title">{title}</h3>
          {subTitle && <span className="text-muted">{subTitle}</span>}
        </div>
      )}

      {message ? (
        <div className="alert success alert-dismissible fade show">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage("")}
          >
            <i className="icon">
              <X />
            </i>
          </button>
        </div>
      ) : null}

      <form
        id="comment_form"
        className="needs-validation"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        {loading ? <div className="loading"></div> : null}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="full_name" className="form-label" hidden>
              Your Name
            </label>
            <input
              type="text"
              {...register("full_name", {
                required: true,
              })}
              name="full_name"
              id="full_name"
              className="form-control"
              aria-invalid={errors.full_name ? "true" : "false"}
              placeholder="Full Name*"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="email" className="form-label" hidden>
              E-mail*
            </label>
            <input
              type="email"
              name="email"
              id="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              aria-invalid={errors.email ? "true" : "false"}
              placeholder="E-mail*"
              className="form-control"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="message" className="form-label" hidden>
              Message*
            </label>
            <textarea
              name="comment"
              id="message"
              rows="6"
              placeholder="Your Comment*"
              {...register("comment", {
                required: true,
              })}
              className="form-control"
              aria-invalid={errors.comment ? "true" : "false"}
            ></textarea>
          </div>
          <div className="col-span-2 md:col-span-1">
            <button type="submit" className="btn btn-primary btn-lg">
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
  </>);
}
