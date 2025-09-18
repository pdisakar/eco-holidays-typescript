"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ServiceProps {
  className?: string;
}

interface ServiceItem {
  img: React.ReactNode;
  title: string;
  body: string;
}

export default function Service({ className }: ServiceProps) {
  const value: ServiceItem[] = [
    {
      img: (
        <svg>
          <use xlinkHref="/icons.svg#customize_itinerary" fill="currentColor" />
        </svg>
      ),
      title: "Tailor Made Itinerary",
      body: "Based on your budget and time-bound, we design the best suitable itinerary for your vacation.",
    },
    {
      img: (
        <svg>
          <use xlinkHref="/icons.svg#badge" fill="currentColor" />
        </svg>
      ),
      title: "Winner of Tripadvisor Excellence Award",
      body: "Our uncompromising services have offered us Tripadvisor Excellence Award with excellent feedback from our guests.",
    },
    {
      img: (
        <svg>
          <use xlinkHref="/icons.svg#lowest_price" fill="currentColor" />
        </svg>
      ),
      title: "Lowest Price Guarantee",
      body: "We offer incredibly reasonable costs for all holiday activities focusing on the services we promise.",
    },
    {
      img: (
        <svg>
          <use xlinkHref="/icons.svg#trekking_leader" fill="currentColor" />
        </svg>
      ),
      title: "Local Leaders & Guides",
      body: "We are proud to have our leaders and guides from the local sphere of the Himalayas.",
    },
    {
      img: (
        <svg>
          <use xlinkHref="/icons.svg#calendar_check" fill="currentColor" />
        </svg>
      ),
      title: "Sustainable Travel",
      body: "Our trips are eco-friendly with careful use of local resources not disturbing the local culture and natural amenities.",
    },
  ];

  return (
    <div className={cn("", className)}>
      <ul className="flex leading-[1.5] text-body justify-end items-center flex-wrap -m-2.5 [&>li]:p-2.5 md:[&>li]:flex-[0_0_50%] md:[&>li]:max-w-[50%] md:[&>li:nth-child(1)]:mb-[-40%] md:[&>li:nth-child(3)]:mb-[-40%]">
        {value.map((item, index) => (
          <li key={index}>
            <div className="p-6 rounded border-t-2 border-t-secondary shadow-[0_0_2px] shadow-secondary/40 bg-white">
              <span className="icon text-secondary h-8 w-8 md:h-[50px] md:w-[50px]">
                {item.img}
              </span>
              <div className="text pt-3 text-sm">
                <h3 className="text-md text-secondary mb-2.5 md:text-base lg:text-[1.125rem] font-semibold">
                  {item.title}
                </h3>
                <p>{item.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
