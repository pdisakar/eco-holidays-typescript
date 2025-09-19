"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL, IMAGE_URL, PACKAGE_BASE_URL } from "@/lib/constants";
import Breadcrumb from "@/components/Breadcrumb";
import EnquireUs from "@/components/EnquireUsForm/EnquireUs";
import PageBanner from "@/components/Banners/PageBanner";
import SocialShare from "@/components/SocialShare";
import { formatDate } from "@/lib/dateFormatter";
import BlogNav from "./BlogNav";

// Define TypeScript interfaces for the data structure
interface UrlInfo {
  url_slug: string;
  url_title: string;
}

interface FeaturedImage {
  full_path: string;
  alt_text?: string;
}

interface PackageItem {
  package_title: string;
  featured: FeaturedImage | null;
  package_discount: number;
  package_duration: number;
  package_duration_type: string;
  urlinfo: UrlInfo;
  additional_field_1?: string;
  group_default_price: number;
  total_testimonials: number;
}

interface Author {
  name: string;
  urlinfo: UrlInfo;
  description: string;
  avatar?: FeaturedImage;
}

interface BlogData {
  banner: any;
  title: string;
  abstract: string;
  blog_date: string;
  authors: Author[];
  btag: string[];
}

interface BlogProps {
  data: {
    content: BlogData;
    tocHtml: string;
    updatedHtml: string;
    previous_blog?: any;
    next_blog?: any;
    block_count: number;
    [key: string]: any;
  };
  siteUrl?: string;
}


export default function Blog({ data, siteUrl }: BlogProps) {
  const { content: blogData, tocHtml, updatedHtml } = data;

   useEffect(() => {
    const blockEls = document.querySelectorAll<HTMLDivElement>(
      "div.package-block"
    );
    for (let i = 0; i < data.block_count; i++) {
      const blocks = `data.block${i + 1}`;
      blockEls[i].removeAttribute("style");
      blockEls[i].innerHTML = eval(blocks).map((itm) => {
        const {
          package_title,
          featured,
          package_discount,
          package_duration,
          package_duration_type,
          urlinfo,
          additional_field_1,
          group_default_price,
          total_testimonials,
        } = itm;

        const testimonials = total_testimonials > 0 ? total_testimonials : 5

        const slug = urlinfo.url_slug;

        const featured_image = featured
          ? `<a
          href="${PACKAGE_BASE_URL}${slug}"
          class="image-slot">
          <img src="${IMAGE_URL + featured?.full_path}"
          alt="${featured?.alt ? featured?.alt_text : package_title}"
          height="350"
          width="450" />
        </a>`
          : null;

        const svgPeopleFill = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      </svg>`;
        const svgTagsFill = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tags-fill" viewBox="0 0 16 16">
        <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z" />
      </svg>`;
        const svgStarFill = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </svg>`;
        const packageDuration =
          package_duration < 10
            ? `0${package_duration} ${package_duration_type === "days" ? "Days" : package_duration_type}`
            : `${package_duration} ${package_duration_type === "days" ? "Days" : package_duration_type}`;
        const TotalTestimonials =
          testimonials > 0
            ? `<span class="review-rating">
         <i>${svgStarFill}</i>
         ${
           testimonials <= 9
             ? `(0${testimonials}) reviews`
             : `(${testimonials}) reviews`
         }
       </span>`
            : "";

        const packageDiscount =
          package_discount !== 0
            ? `
         <span class="strike">
          ${" $" + (package_discount + group_default_price)}
          </span>`
            : "";

        const tripStatus = additional_field_1
          ? additional_field_1 == "Best Price"
            ? `
           <div class="status danger">
           <span class="icon">
             ${svgTagsFill}
           </span>${additional_field_1}
         </div>`
            : additional_field_1 == "Group Tours"
            ? `<div class="status success">
              <span class="icon">
                ${svgPeopleFill}
              </span>${additional_field_1}
            </div>
           `
            : `<div class="status warning">
            <span class="icon">
              ${svgStarFill}
            </span>${
              additional_field_1 == "Pravite Trip"
                ? "Private Trip"
                : additional_field_1
            }
         </div>`
          : "";


        return `
          <div class="item">
          
            ${tripStatus}
          <figure>
            ${featured_image}
          </figure>
          <figcaption>
            <div class="caption-header">
              <h3>
                <a href="${PACKAGE_BASE_URL}${slug}">
                  ${package_title}
                </a>
              </h3>
            </div>
            <p><span class="duration">${packageDuration}</span> from <span class="discount">US $${(group_default_price+group_default_price*0.075).toFixed(0)}</span>
                <span class="normal">US $${group_default_price}</span></p>

                <a class="btn" href="${PACKAGE_BASE_URL}${slug}">View Itinerary</a>
          ${TotalTestimonials}
           
          </figcaption>
        </div>`;
      });
    }
  });


  const breadcrumbData = [
    {
      title: "Blog",
      slug: "blog",
    },
    {
      title: "Blog",
      slug: "blog",
    },
  ];

  return (
    <>
      {blogData.banner && (
        <PageBanner renderData={blogData.banner} pageTitle={blogData.title} />
      )}

      <div className="common-box blog-page pt-0 pb-0">
        <div className="content container">
          <div className="lg:w-2/3 lg:mx-auto">
            <div className="page-title mb-6">
              <Breadcrumb
                data={breadcrumbData}
                currentPage={blogData.title}
                classes="py-3 mb-3"
              />
              <h1>{blogData.title}</h1>
              <div className="meta mt-1 text-headings/80 text-md font-medium">
                By{" "}
                <Link
                  href={`/author/${blogData.authors[0].urlinfo.url_slug}`}
                  className="underline text-headings/80"
                >
                  {blogData.authors[0].name}
                </Link>{" "}
                on {formatDate(blogData.blog_date, "Do MMM YYYY")}
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: blogData.abstract }}></div>

            {tocHtml !== "<ol></ol>" && (
              <aside className="toc block my-6">
                <h2 className="text-[1.375rem] mb-2 font-extrabold text-primary">
                  Table of Contents
                </h2>
                <div
                  dangerouslySetInnerHTML={{ __html: tocHtml }}
                  className="font-normal text-sm [&>ol>li>ol]:mb-0 [&>ol]:list-none [&>ol>li+li]:pt-0 [&>ol>li+li]:mt-1 [&>ol>li>ol>li]:mt-1 [&>ol>li>ol>li+li]:mt-0 [&>ol>li>ol]:list-none [&>ol>li>ol]:pl-5 [&>ol>li>a>span]:text-secondary [&>ol>li>ol>li>a]:text-body [&>ol>li>ol>li>a>span]:text-secondary [&>ol>li>a>span]:font-bold [&>ol>li>ol>li>a>span]:font-bold hover:[&>ol>li>ol>li>a]:text-primary hover:[&>ol>li>ol>li>a]:underline hover:[&>ol>li>a]:text-primary hover:[&>ol>li>a]:underline"
                ></div>
              </aside>
            )}

            <article
              className="common-module blog-detail"
              id="blog-detail"
              dangerouslySetInnerHTML={{ __html: updatedHtml }}
            ></article>

            {blogData?.btag.length >= 1 && (
              <div className="common-module">
                <h3 className="module-title">#Tags</h3>
                <div className="tags">
                  <ul>
                    {blogData?.btag.map((itm, idx) => (
                      <li key={idx}>
                        <Link href="#">{itm}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="author-slot mt-10 p-6 rounded-md bg-secondary/[0.065] ">
              <div className="item flex gap-x-6">
                <figure className="image-slot before:pt-[100%] h-28 w-28 rounded-xl drop-shadow-base flex-[0_0_108px]">
                  {blogData.authors[0]?.avatar && (
                    <Image
                      src={IMAGE_URL + blogData.authors[0]?.avatar.full_path}
                      alt={blogData.authors[0]?.name}
                      height={150}
                      width={150}
                      className="scale-[1.12]"
                    />
                  )}
                </figure>
                <figcaption>
                  <h3 className="text-lg font-black mb-3">
                    <Link
                      href={`${BASE_URL}author/${blogData?.authors[0]?.urlinfo.url_slug}`}
                      className="name text-primary"
                    >
                      {blogData?.authors[0]?.name}
                    </Link>
                  </h3>
                  <article
                    dangerouslySetInnerHTML={{
                      __html: blogData?.authors[0].description,
                    }}
                    className="text-base leading-[1.6]"
                  />
                </figcaption>
              </div>
            </div>

            <div className="relative mt-10 text-center before:bottom-3.5 before:-z-10 before:h-0.5 before:bg-headings/20 before:absolute before:inset-x-0">
              <span className="block text-sm font-medium mb-1">
                Share with your Friends
              </span>
              <SocialShare
                url={siteUrl}
                title={blogData.title}
                classess="inline-flex px-3 bg-body-bg"
              />
            </div>

            <BlogNav prevBlog={data.previous_blog} nextBlog={data.next_blog} />

            <EnquireUs
              horizontalLayout={true}
              title="Make an Enquiry"
              type="Contact Us"
              classes="flm-form mb-10 bg-white shadow-base p-6 lg:p-8 rounded [&>.module-title>h3]:text-xl [&>.module-title>h3]:mb-3 [&>.module-title>h3]:lg:text-2xl [&>.module-title>h3]:font-black [&>form>div>div>.form-control]:border-headings/30 [&>form>div>div>.form-control]:rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}