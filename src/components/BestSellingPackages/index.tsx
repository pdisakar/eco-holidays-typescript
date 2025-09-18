"use client";
import Image from "next/image";
import PackageCard from "../Card/PackageCard";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { cn } from "@/lib/utils";
import { IMAGE_URL } from "@/lib/constants";
import { Media } from "@/types";
import { useGlobalData } from "@/context/globalContext";
import Link from "next/link";

interface BestSellingPackagesProps {
  renderData: PackageData[];
  title: string;
  titleClassName?: string;
  subTitle?: string;
  className?: string;
  linkTo?: string;
  titleCenter?: boolean;
  lead?: string;
  testimonialsAvatars?: Media[];
}

export default function BestSellingPackages({
  renderData,
  title,
  subTitle,
  className,
  linkTo,
  titleCenter,
  titleClassName,
  lead,
  testimonialsAvatars
}: BestSellingPackagesProps) {
  const { globalData } = useGlobalData();
  return (
    <section className={cn(className)}>
      <div className="container">
        <Carousel className="[&>.overflow-hidden]:-mx-3">
          <div className={cn('title flex items-center justify-between', titleClassName)}>
            <div className="text-left">
              <h2 dangerouslySetInnerHTML={{ __html: title }} />
              {lead && (
                <p className="lead text-muted">{lead}</p>
              )}

            </div>


            <div className="navigation hidden lg:flex flex-wrap gap-x-2.5 items-center text-center mt-3  [&>button]:text-white [&>button]:border-0 [&>button]:shadow-none [&>button]:bg-primary [&>button]:h-7 [&>button]:w-7 [&>button]:rounded [&>button>svg]:h-3 [&>button>svg]:w-3">
              <CarouselPrevious className="gap-0.5 items-center disabled:opacity-20 disabled:cursor-not-allowed">
                <svg
                  className="rotate-180 h-3 w-3"
                >
                  <use xlinkHref={`/icons.svg#chevron`} fill="currentColor" />
                </svg>
              </CarouselPrevious>
              <CarouselNext className="gap-0.5">
                <svg
                  className="h-3 w-3"
                >
                  <use xlinkHref={`/icons.svg#chevron`} fill="currentColor" />
                </svg>
              </CarouselNext>


            </div>

          </div>
          <CarouselContent>
            {renderData?.map((itm, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3 px-3">
                <PackageCard packageData={itm} />
              </CarouselItem>
            ))}
          </CarouselContent>



          <CarouselDots className="mt-6 md:hidden" />

        </Carousel>
      </div>
    </section>
  );
}
