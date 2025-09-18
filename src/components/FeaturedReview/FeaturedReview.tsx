"use client";
import ReviewCard from "../Card/ReviewCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import FancyReview from "../FancyReview";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { Testimonial } from "@/types";
import { useGlobalData } from "@/context/globalContext";
import Image from "next/image";


interface FeaturedReviewProps {
  renderData: Testimonial[];
  title: string;
  classes?: string;
}

export default function FeaturedReview({ renderData, title, classes = "" }: FeaturedReviewProps) {
  const { globalData } = useGlobalData();
  return (
    <aside className={classes}>
      <div className="container">
        <div className="title flex flex-wrap items-center justify-between">
          <div className="left md:pl-[150px]">
            <a href={globalData.trip_advisor} target="_blank" rel="nofollow noreferrer" className="hidden md:inline-block absolute left-0 px-4 pb-8 pt-3 bg-tripadvisor top-[-70px] rounded-b-md after:absolute after:inset-x-0.5 after:bottom-0 after:border-x-[64px] after:border-b-[22px] after:border-x-transparent after:border-b-secondary">
              <Image
                src="/ta.webp"
                alt="Trip Advisor"
                width={100}
                height={121}
              />
            </a>
            <h2 className="text-white" dangerouslySetInnerHTML={{ __html: title }}></h2>
            <p className="lead text-[#fff]/90">
              Discover what hundreds of fellow travelers are saying about
              their experiences with <strong className="underline">Eco Holidays Nepal</strong>.
            </p>
          </div>
          <FancyReview className="mt-6 text-white/90 [&>ul>li>a>span]:text-white" />
        </div>
        <Carousel className="md:[&>.overflow-hidden]:-m-3 [&>.overflow-hidden]:-m-1.5">
          <CarouselContent>
            {renderData?.map((itm, idx) => (
              <CarouselItem
                key={idx}
                className="sm:basis-1/2 md:basis-1/3 px-1.5 md:p-3"
              >
                <ReviewCard reviewData={itm} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="navigation mt-6 lg:mt-8 flex flex-wrap gap-2.5 items-center text-center md:mt-3  [&>button]:text-white [&>button]:border-0 [&>button]:shadow-none [&>button]:bg-primary [&>button]:h-7 [&>button]:w-7 [&>button]:rounded [&>button>svg]:h-3 [&>button>svg]:w-3">
            <CarouselPrevious className="gap-0.5 items-center disabled:opacity-20 disabled:cursor-not-allowed">
              <svg
                className="rotate-180 h-3 w-3"
              >
                <use xlinkHref={`/icons.svg#chevron`} fill="currentColor" />
              </svg>
            </CarouselPrevious>

            <CarouselDots className="mt-0 md:hidden" />
            <CarouselNext className="gap-0.5">
              <svg
                className="h-3 w-3"
              >
                <use xlinkHref={`/icons.svg#chevron`} fill="currentColor" />
              </svg>
            </CarouselNext>
            <Link href={`${BASE_URL}reviews`} className="text-xxs px-5 py-2 rounded-full bg-primary text-pretty text-white font-bold uppercase lg:ml-auto inline-flex items-center">Read More Reviews<svg className="h-3 w-3 transition-all inline-block ml-1.5 group-hover:w-3">
              <use
                xlinkHref="/icons.svg#arrow-short-right"
                fill="currentColor"
              />
            </svg></Link>
          </div>
        </Carousel>
      </div>
    </aside>
  );
}