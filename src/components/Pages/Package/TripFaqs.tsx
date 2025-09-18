"use client";

import { AccordionItem } from "@/components/ui/seoaccordation";
import { useState, useMemo } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type TripItineraryProps = {
  renderData: { faq: FaqItem[] };
  title: string;
  package_title: string
};

export default function TripFaqs({ renderData, title, package_title }: TripItineraryProps) {
  const items = renderData.faq;
  const defaultOpenIndex = 0;

  const [openStates, setOpenStates] = useState<boolean[]>(
    () => items.map((_, i) => i === defaultOpenIndex)
  );

  const allExpanded = useMemo(() => openStates.every(Boolean), [openStates]);

  const toggleItem = (index: number) => {
    setOpenStates((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const setAll = (state: boolean) => {
    setOpenStates(items.map(() => state));
  };

  const toggleIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="24" height="24" viewBox="0 0 24 24" fill="none" 
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
         class="lucide lucide-chevron-up-icon lucide-chevron-up">
      <path d="m18 15-6-6-6 6"/>
    </svg>`;

  const toggleClassName = `
    transition-all text-muted hover:underline absolute right-0 
    flex-[0_0_24px] cursor-pointer h-6 w-6 inline-flex items-center 
    justify-center rounded-full [&>svg]:h-full [&>svg]:w-full rotate-[180deg]`;

  const buttonClass = "btn text-sm shadow-md text-headings border font-bold rounded-full px-4 py-1.5 block bg-primary/5 border-primary/70";


  const handleToggleAll = () => setAll(!allExpanded);

  return (
    <div className="common-module">
      <h2 className="section-title">
       {package_title} {title}
      </h2>

      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.question}
          content={item.answer}
          isOpen={openStates[index]}
          onToggle={() => toggleItem(index)}
          toggleIcon={toggleIcon}
          toggleClassName={toggleClassName}
          titleClassName="lg:text-[1.06275rem] font-medium text-secondary [&[aria-expanded='true']>.toggle]:rotate-[0] "
          className=" [&+.item]:border-t relative lg:pr-14 pb-4 [&+.item]:pt-4"
          contentClassName="text-body pt-3 [&.active]:pt-3"
        />
      ))}
    </div>
  );
}
