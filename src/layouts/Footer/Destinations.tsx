"use client";

import Link from "next/link";
import { BASE_URL } from "@/lib/constants";

interface DestinationItem {
  name: string;
  slug: string;
  tours: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const destinations: DestinationItem[] = [
  {
    name: "Nepal",
    slug: "nepal",
    tours: "87+ Tours & activities",
    Icon: (props) => (
      <svg {...props}>
        <use xlinkHref="/icons.svg#nepal" />
      </svg>
    ),
  },
  {
    name: "Tibet",
    slug: "tibet",
    tours: "06+ Tours & activities",
    Icon: (props) => (
      <svg {...props}>
        <use xlinkHref="/icons.svg#tibet" />
      </svg>
    ),
  },
  {
    name: "Bhutan",
    slug: "bhutan",
    tours: "04+ Tours & activities",
    Icon: (props) => (
      <svg {...props}>
        <use xlinkHref="/icons.svg#bhutan" />
      </svg>
    ),
  },
];

export default function Destination() {
  return (
    <div className="destination">
      <ul className="[&>li+li]:mt-3">
        {destinations.map(({ name, slug, tours, Icon }) => (
          <li key={slug}>
            <Link href={`${BASE_URL}${slug}`} className="flex items-center gap-x-5">
              <figure className="max-w-[70px] flex flex-[0_0_70px] h-[70px] rounded text-secondary bg-white justify-center items-center shadow-[0_0_2px_rgba(0,73,86,.4)]">
                  <Icon fill="currentColor" className="h-[50px] block w-[50px]" />
              </figure>
              <figcaption>
                <h4 className="text-[1.125rem] text-headings font-semibold font-secondary">{name}</h4>
                <span className="text-muted text-xs block pt-0.5 font-medium">{tours}</span>
              </figcaption>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
