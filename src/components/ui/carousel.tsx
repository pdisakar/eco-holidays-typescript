"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselOrientation = "horizontal" | "vertical";

interface CarouselOptions {
  loop?: boolean;
  align?: "start" | "center" | "end";
  skipSnaps?: boolean;
  [key: string]: any;
}

interface CarouselContextType {
  carouselRef: (node?: Element | null) => void;
  api: EmblaCarouselType | undefined;
  opts?: CarouselOptions;
  orientation: CarouselOrientation;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = React.createContext<CarouselContextType | null>(null);

function useCarousel(): CarouselContextType {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: CarouselOrientation;
  opts?: CarouselOptions;
  setApi?: (api: EmblaCarouselType) => void;
  plugins?: any[];
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api?: EmblaCarouselType) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

// ----------------------
// CarouselContent
// ----------------------

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div ref={ref} className={cn("flex", className)} {...props} />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

// ----------------------
// CarouselItem
// ----------------------

interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

// ----------------------
// CarouselPrevious
// ----------------------

interface CarouselNavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
  disabled?: boolean;
}

const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselNavButtonProps>(
  ({ className, variant = "outline", size = "icon", children, ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className)}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

// ----------------------
// CarouselNext
// ----------------------

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNavButtonProps>(
  ({ className, variant = "outline", size = "icon", children, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className)}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

// ----------------------
// CarouselDots
// ----------------------

interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {}

const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel();
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    React.useEffect(() => {
      if (!api) return;

      const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
      setScrollSnaps(api.scrollSnapList());
      api.on("select", onSelect);
      onSelect();

      return () => {
        api.off("select", onSelect);
      };
    }, [api]);

    const scrollTo = (index: number) => {
      api?.scrollTo(index);
    };

    return (
      <div ref={ref} className={cn("flex justify-center gap-1 mt-4", className)} {...props}>
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={cn(
              "h-1 rounded-full transition-colors",
              selectedIndex === idx ? "bg-primary w-8" : "bg-primary/20 w-4"
            )}
          />
        ))}
      </div>
    );
  }
);
CarouselDots.displayName = "CarouselDots";

// ----------------------
// Exports
// ----------------------

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
};
