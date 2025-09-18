import { IMAGE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/dateFormatter";
import { cn } from "@/lib/utils";
import { Testimonial } from "@/types";
import Image from "next/image";


interface ReviewCardProps {
  reviewData: Testimonial;
  className?: string
}

function limitWords(input: string | undefined, wordLimit: number): string | undefined {
  if (!input) return input;
  const words = input.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : input;
}

export default function ReviewCard({ reviewData, className }: ReviewCardProps) {
  const {
    review_date,
    avatar,
    salutation,
    review_rating,
    full_name,
    country_name,
    country_code,
    address,
    review,
    review_title,
  } = reviewData;

  return (
    <div className={cn("card bg-body-bg p-5 lg:p-6 rounded-md shadow-[0_0_10px] shadow-black/10 review h-full", className)}>
      <div className="card-header">
        <div className="inline-flex gap-x-3 items-center relative">
          <figure className="avatar h-[55px] w-[55px] mx-auto rounded-full inline-block image-slot before:pt-[100%]">
            {avatar?.full_path ? (
              <Image
                src={IMAGE_URL + avatar.full_path}
                alt={full_name}
                width={50}
                height={50}
              />
            ) : (
              <span className="absolute inset-0 bg-[#e3eff4] text-primary inline-flex justify-center items-center font-semibold text-[1.125rem] capitalize">
                {full_name.charAt(0)}
              </span>
            )}
          </figure>
          <figcaption className="leading-[1.3]">
            <span className="text-base mt-1.5 font-medium text-headings block">{full_name}</span>
            <span className="text-xxs block">{formatDate(review_date, "Do MMM, YYYY")}</span>
          </figcaption>
        </div>
      </div>

      <div className="card-body">
        <i className={`ratings__${review_rating ?? 5}`}></i>
        <h3 className="text-[1.125rem] leading-[1.4] text-headings line-clamp-2 mb-2">
          {review_title}
        </h3>
        <article
          dangerouslySetInnerHTML={{ __html: review }}
          className="text-sm leading-[1.5] custom-scroll-bar max-h-[120px] overflow-y-auto"
        />
      </div>
    </div>
  );
}
