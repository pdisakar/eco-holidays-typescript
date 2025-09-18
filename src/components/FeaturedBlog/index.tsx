"use client";

import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import BlogCard from "../Card/BlogCard";
import React from "react";
import { BlogItem } from "@/types";


interface FeaturedBlogProps {
  title: string;
  subTitle?: string;
  limit: number;
  renderData: BlogItem[];
  content?: string;
  classes?: string;
  lead?: string;
}

export default function FeaturedBlog({
  title,
  subTitle,
  limit,
  renderData,
  content,
  classes,
  lead,
}: FeaturedBlogProps) {
  return (
    <section className={classes}>
      <div className="container">
        <div className="title gap-3 flex items-center flex-wrap justify-between">
          <div>
            <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
          {lead && <p className="lead">{lead}  </p>}
          </div>
          <Link
            href={`${BASE_URL}blog`}
            className="btn btn-md  text-primary font-semibold border border-primary rounded-md hover:text-primary/80 "
          >
            View All Blog
          </Link> 
        </div>

        <div className="blog-list featured">
          <ul className="grid md:grid-cols-2 gap-6 [&>li:nth-child(1)]:row-span-3">
            {renderData?.slice(0, limit).map((itm, idx) => (
              <li key={idx} className="item">
                <BlogCard blogData={itm} className={idx !== 0 ? 'md:flex md:items-center md:[&>figure]:flex-[0_0_30%] md:[&>figcaption]:pt-0 md:[&>figcaption]:flex-[0_0_70%] md:[&>figcaption]:pl-4' : 'relative h-full [&>figure]:h-full [&>figure>.image-slot]:h-full  [&>figcaption]:before:bg-black/0 [&>figcaption]:before:transition-all [&>figcaption]:before:-z-10 [&>figcaption]:before:absolute [&>figcaption]:before:inset-x-0 [&>figcaption]:before:bottom-0 [&>figcaption]:before:-top-10 [&>figcaption]:before:rounded-b-md  [&>figcaption]:before:bg-gradient-to-t [&>figcaption]:before:from-headings/70 [&>figcaption]:before:to-headings/5 [&>figcaption]:absolute [&>figcaption]:inset-x-0 [&>figcaption]:bottom-0 [&>figcaption]:p-6 [&>figcaption]:z-20 lg:[&>figcaption>h3]:text-[1.875rem] [&>figcaption>h3>a]:text-white [&>figcaption>.blog-meta>li+li]:before:bg-white [&>figcaption>.blog-meta>li>.text-muted]:text-white'} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}