"use client";

import { AccordionItem } from "@/components/ui/seoaccordation";
import { useState, useMemo } from "react";

type Item = {
    title: string;
    content: string;
};

type TripItineraryProps = {
    renderData: Item[];
    title: string;
};

export default function GoodToKnow({ renderData, title }: TripItineraryProps) {
    const items = renderData;
    const defaultOpenIndex = null;
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)
    const toggleItem = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index))
    }
    const toggleIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
         class="lucide lucide-chevron-up-icon lucide-chevron-up">
      <path d="m18 15-6-6-6 6"/>
    </svg>`;

    const toggleClassName = `
    transition-all text-muted hover:underline absolute top-4 right-0 
    flex-[0_0_24px] cursor-pointer h-6 w-6 inline-flex items-center 
    justify-center rounded-full [&>svg]:h-full [&>svg]:w-full rotate-[180deg]`;


    return (
        <div className="common-module">

            <h2 className="section-title">
                {title}
            </h2>
            {items.map((item, index) => (
                <AccordionItem
                    titleTag={true}
                    key={index}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndex === index}
                    onToggle={() => toggleItem(index)}
                    toggleIcon={toggleIcon}
                    toggleClassName={toggleClassName}
                    titleClassName="lg:text-[1.125rem] text-secondary leading-[1.3] font-semibold [&[aria-expanded='true']>.toggle]:rotate-[0]"
                    className=" [&+.item]:border-t relative lg:pr-14 pb-4 [&+.item]:pt-4"
                    contentClassName="text-body  pt-3 [&.active]:pt-3"
                />
            ))}
        </div>
    );
}
