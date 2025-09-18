"use client";

import { useState } from "react";
import TripReviewCarousel from "./TripReviewCarousel";
import { BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { Youtube } from "react-bootstrap-icons";
import Reels from "./Reels";

export default function PackageReviewSection({
  testimonial_tripadvisor,
  media_reels,
  testimonial_google,
  package_testimonials,
  featured_testimonials,
  testimonial_trustpilot,
  package_title,
  globalData,
}) {
  
  const [activeTab, setActiveTab] = useState("tripadvisor");
  const navItems = [
    {
      title: "Tripadvisor",
      rating: "5.0",
      total_review: globalData.tripadvisor_review_count,
      link: "https://www.tripadvisor.com/Attraction_Review-g293890-d2098433-Reviews-Nepal_Hiking_Team-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html",
      icon: (
        <svg>
          <use xlinkHref={`${BASE_URL}sprite.svg#tripadvisor`}  />
        </svg>
      ),
    },
    {
      title: "Google",
      rating: "4.9",
      link: "https://maps.app.goo.gl/xJGUJ6JLVz8Md3MM6",
      total_review: globalData.google_review_count,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="#fbbb00"
            d="M113.47 309.408L95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
          />
          <path
            fill="#518ef8"
            d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
          />
          <path
            fill="#28b446"
            d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
          />
          <path
            fill="#f14336"
            d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
          />
        </svg>
      ),
    },
    {
      title: "Trustpilot",
      rating: "4.6",
      link: "https://www.trustpilot.com/review/nepalhikingteam.com",
      total_review: globalData.trustpilot_review_count,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 799.89 761">
          <path
            d="M799.89 290.83H494.44L400.09 0l-94.64 290.83L0 290.54l247.37 179.92L152.72 761l247.37-179.63L647.16 761l-94.35-290.54z"
            fill="#00b67a"
          ></path>
          <path
            d="M574.04 536.24l-21.23-65.78-152.72 110.91z"
            fill="#005128"
          ></path>
        </svg>
      ),
    },
  ];

  const renderIcon = (icon) => <span className="icon">{icon}</span>;

  const renderLink = (platform, url, className, text) => (
    <Link
      target="_blank"
      rel="nofollow"
      className={`font-secondary text-[.9375rem] ${className} font-medium rounded px-6 py-2 inline-block`}
      href={url}
    >
      {text}
    </Link>
  );

  const renderDetails = (platform, item) => (
    <div className={`detail-slot ${platform}`}>
      <div className="heading">
        <Link href={item.link}>{renderIcon(item.icon)}</Link>
        <b>{platform.charAt(0).toUpperCase() + platform.slice(1)}</b> Rating
      </div>
      <span className="text">
        <b>{item.rating}</b> <i className="ratings__5" />
        <span>{item.total_review} reviews</span>
      </span>
    </div>
  );

  const renderTabContent = (active, testimonials) => (
    <TripReviewCarousel
      renderData={testimonials?.length > 3 ? testimonials : package_testimonials?.length > 3 ? package_testimonials : featured_testimonials
      }
    />
  );

  return (
    <section className="common-box package-section" id="reviews">
      <div className="container">
        <div className="title text-center">
          <h2>Travellers‘ reviews</h2>
          <p className="lead max-w-[600px] mx-auto">
            Read our genuine feedback from past travelers with{" "}
            <span className="text-secondary">Nepal Hiking Team</span> sourced
            from TripAdvisor, Google, Facebook, and Trustpilot.
          </p>
        </div>

        <div className="lg:w-9/12 mx-auto">
          <div className="common-module review-nav-tabs bg-white shadow">
            <div className="navbar">
              <ul>
                {navItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => setActiveTab(item.title.toLowerCase())}
                    className={
                      activeTab === item.title.toLowerCase() ? "active" : ""
                    }
                  >
                    {renderIcon(item.icon)}
                    <span className="text">
                      {item.title} <b>{item.rating}</b>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="navbar-bottom">
              {activeTab === "tripadvisor" && (
                <>
                  {renderDetails("tripadvisor", navItems[0])}
                  {renderLink(
                    "Tripadvisor",
                    "https://www.tripadvisor.com/UserReviewEdit-g293890-d2098433-Nepal_Hiking_Team-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html",
                    "bg-tripadvisor text-headings",
                    "Write a Review"
                  )}
                </>
              )}
              {activeTab === "google" && (
                <>
                  {renderDetails("google", navItems[1])}
                  {renderLink(
                    "Google",
                    "https://www.google.com/search?q=nepal+hiking+team&oq=nepal+hi&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDkyDQgCEAAYgwEYsQMYgAQyEwgDEC4YgwEYxwEYsQMY0QMYgAQyEAgEEC4YxwEYsQMY0QMYgAQyBggFEEUYPDIGCAYQRRg9MgYIBxBFGDzSAQgxOTIyajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x39eb18e3730568c1:0x4290738e756e14ae,3,,,,",
                    "bg-google text-white",
                    "Write a Review"
                  )}
                </>
              )}
              {activeTab === "trustpilot" && (
                <>
                  {renderDetails("trustpilot", navItems[2])}
                  {renderLink(
                    "Trustpilot",
                    "https://www.trustpilot.com/review/nepalhikingteam.com",
                    "bg-trustpilot text-white",
                    "Write a Review"
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="review-nav-tabs common-module">
          <div className="tab-content">
            {activeTab === "tripadvisor" &&
              renderTabContent(activeTab, testimonial_tripadvisor)}
            {activeTab === "google" &&
              renderTabContent(activeTab, testimonial_google)}
            {activeTab === "trustpilot" &&
              renderTabContent(activeTab, testimonial_trustpilot)}
          </div>
        </div>

        {media_reels.length !== 0 && (
          <div className="common-module">
            <div className="title text-center">
              <h3 className="flex items-center justify-center gap-2">
                <i className="icon text-youtube inline-block h-8 w-8">
                  <Youtube fill="currentColor" />
                </i>{" "}
                Video Reviews
              </h3>
            </div>
            <Reels renderData={media_reels} />
          </div>
        )}
      </div>
    </section>
  );
}
