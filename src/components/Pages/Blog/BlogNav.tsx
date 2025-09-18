import { BLOG_BASE_URL, IMAGE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/dateFormatter";
import { Media, UrlInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

type BlogNavItem = {
  urlinfo: UrlInfo;
  title: string;
  thumbnail: string;
  featured: Media
  blog_date: string; // ISO date string
};

type BlogNavProps = {
  prevBlog?: BlogNavItem | null;
  nextBlog?: BlogNavItem | null;
};

export default function BlogNav({ prevBlog, nextBlog }: BlogNavProps) {
  
  return (
    <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-6">

      {/* Previous Blog */}
      {prevBlog && (
        <Link
          href={`${BLOG_BASE_URL}${prevBlog.urlinfo.url_slug}`}
          className="group flex items-center gap-4"
        >
          <span className="w-24 object-cover rounded-lg flex-shrink-0 image-slot overflow-hidden before:pt-[80.28571429%]">
            <Image
              src={IMAGE_URL + prevBlog.featured.full_path}
              alt={prevBlog.title}
              height={350}
              width={450}
            />
          </span>
          
          <div>
            <p className="text-sm text-gray-500">← Previous</p>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary line-clamp-2">
              {prevBlog.title}
            </h3>
               <p className="text-xs text-muted font-normal mt-1">
              {formatDate(prevBlog.blog_date, 'Do MMM, YYYY')}
            </p>
          </div>
        </Link>
      )}

      {/* Next Blog */}
      {nextBlog && (
        <Link
          href={`${BLOG_BASE_URL}${nextBlog.urlinfo.url_slug}`}
          className="group flex items-center gap-4 sm:justify-end sm:text-right"
        >
          <div className="order-2 sm:order-1">
            <p className="text-sm text-muted font-normal">Next →</p>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary line-clamp-2">
              {nextBlog.title}
            </h3>
            <p className="text-xs text-muted font-normal mt-1">
              {formatDate(nextBlog.blog_date, 'Do MMM, YYYY')}
            </p>
          </div>
          <span className="w-24 md:order-2 object-cover rounded-lg flex-shrink-0 image-slot overflow-hidden before:pt-[80.28571429%]">
            <Image
              src={IMAGE_URL + nextBlog.featured.full_path}
              alt={nextBlog.title}
              height={350}
              width={450}
            />
          </span>
        </Link>
      )}

    </div>
  );
}
