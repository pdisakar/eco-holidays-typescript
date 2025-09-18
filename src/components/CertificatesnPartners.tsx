"use client";

import Image, { StaticImageData } from "next/image";
import TripAdvisorIcon from "@/assets/images/associated/tripadvisor.png";
import TripAdvisorIconLight from "@/assets/images/associated/tripadvisor-light.png";
import TourRadar from "@/assets/images/associated/logo-tour-radar.png";
import BookMundi from "@/assets/images/associated/bookmundi.png";
import Viator from "@/assets/images/associated/logo-viator.png";
import NepalGoverment from "@/assets/images/associated/nepal-goverment.png";
import Nma from "@/assets/images/associated/nma.png";
import Ntb from "@/assets/images/associated/ntb.png";
import Taan from "@/assets/images/associated/taan.png";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGlobalData } from "@/context/globalContext";
import { cn } from "@/lib/utils";

interface CertificatesnPartnersProps {
  title?: string;
  subTitle?: string; // not currently used, but kept for future-proofing
  content?: string;  // not currently used
  className?: string;
  ta_light?: boolean;
}

interface PartnerItem {
  src?: StaticImageData;
  alt: string;
  width: number;
  height: number;
  href?: string;
  isTripAdvisor?: boolean;
}

export default function CertificatesnPartners({
  title,
  className,
  ta_light = false,
}: CertificatesnPartnersProps) {
  const { globalData } = useGlobalData();

  const partners: PartnerItem[] = [
    { src: NepalGoverment, alt: "Nepal Government", width: 65, height: 54 },
    { src: Ntb, alt: "NTB", width: 65, height: 67 },
    { src: Taan, alt: "TAAN", width: 49, height: 67 },
    { src: Nma, alt: "NMA", width: 65, height: 57 },
    { src: Viator, alt: "Viator", width: 94, height: 28 },
    {
      href: globalData?.trip_advisor,
      alt: "Trip Advisor",
      width: 141,
      height: 30,
      isTripAdvisor: true,
    },
    {
      src: TourRadar,
      href: globalData?.tourradar,
      alt: "Tour Radar",
      width: 140,
      height: 25,
    },
    {
      src: BookMundi,
      href: globalData?.bookmundi,
      alt: "BookMundi",
      width: 139,
      height: 28,
    },
  ];

  return (
    <aside className={cn("affiliation", className)}>
        {title && (
          <h3 className="uppercase mb-7 font-semibold text-headings text-[1.25rem] font-secondary">{title}</h3>
        )}
        <Carousel className="affiliation-list [&>.overflow-hidden]:-mx-5">
          <CarouselContent className=" items-center ">
            {partners.map((partner, idx) => (
              <CarouselItem key={idx} className="basis-auto px-5">
                <div className="item">
                  {partner.href ? (
                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="intro-img"
                    >
                      {partner.isTripAdvisor ? (
                        <Image
                          src={ta_light ? TripAdvisorIconLight : TripAdvisorIcon}
                          alt={partner.alt}
                          width={partner.width}
                          height={partner.height}
                          className={ta_light ? "light" : ""}
                        />
                      ) : (
                        partner.src && (
                          <Image
                            src={partner.src}
                            alt={partner.alt}
                            width={partner.width}
                            height={partner.height}
                          />
                        )
                      )}
                    </a>
                  ) : (
                    partner.src && (
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        width={partner.width}
                        height={partner.height}
                      />
                    )
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
    </aside>
  );
}
