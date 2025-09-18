import Image from "next/image";
import Link from "next/link";
import { BASE_URL, BLOG_BASE_URL, IMAGE_URL } from "@/lib/constants";
import { Globe, User } from "lucide-react";
import { formatDate } from "@/lib/dateFormatter";
import React from "react";
import { BlogItem } from "@/types";
import { cn } from "@/lib/utils";





interface BlogCardProps {
  blogData: BlogItem;
  className?: string;
  autherPage?: boolean
}

export default function BlogCard({ blogData, className }: BlogCardProps) {
  const { title, featured, blog_date, urlinfo, categories, authors } = blogData;
  return (
    <div className={cn('item transation-all rounded-md overflow-hidden group', className)}>
      <figure className="relative ">
        <Link
          href={`${BLOG_BASE_URL}${urlinfo?.url_slug}`}
          className="image-slot rounded overflow-hidden before:pt-[71.1666666667%]"
        >
          {featured && (
            <Image
              src={IMAGE_URL + featured.full_path}
              alt={featured.alt_text ? featured.alt_text : title}
              height={350}
              width={450}
              loading="lazy"
              className="object-cover transition-transform group-hover:scale-110"
            />
          )}
        </Link>
      </figure>
      <figcaption className="pt-3 lg:pt-6">
        <ul className="blog-meta flex items-center flex-wrap pb-1 font-medium text-xs [&>li+li]:before:h-1 [&>li+li]:before:w-1 [&>li+li]:before:bg-current [&>li+li]:before:rounded-full [&>li+li]:before:mx-3 [&>li+li]:before:inline-flex">
          {categories && categories[0] && (
            <li>
              <Link
                href={BASE_URL + categories[0]?.urlinfo?.url_slug}
                className="underline hover:decoration-primary text-muted font-medium"
              >
                {categories[0]?.urlinfo.url_title}
              </Link>
            </li>
          )}

          {categories && categories[0] && (
            <li className="categories">
              <span className="text-muted">
                {formatDate(blog_date, "dd MMM, yyyy")}
              </span>
            </li>
          )}
        </ul>

        <h3 className="line-clamp-2 font-bold text-lg md:text-xl leading-[1.2]">
          <Link
            href={`${BLOG_BASE_URL}${urlinfo?.url_slug}`}
            className="text-headings transition-color  hover:underline hover:decoration-primary"
          >
            {title}
          </Link>
        </h3>

      </figcaption>
    </div>
  );
}