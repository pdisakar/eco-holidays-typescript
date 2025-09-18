import Link from "next/link";
import { Media, UrlInfo } from "@/types";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { BASE_URL } from "@/lib/constants";

// Types
interface CategoryItem {
  title: string;
  total_packages: number;
  urlinfo: UrlInfo;
  all_packages: number;
  icon?: React.ReactNode;
  featured: Media | null;
}

interface FeaturedCategoriesProps {
  renderData: CategoryItem[];
  title: string;
  subtitle?: string;
  className?: string;
  lead?: string;
}

// Helper: Get matching icon by category title
const getCategoryIcon = (title: string): React.ReactNode | null => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("trek"))
    return <svg><use xlinkHref="/icons.svg#trekking" /></svg>;
  if (lowerTitle.includes("nepal tour"))
    return <svg><use xlinkHref="/icons.svg#tour" /></svg>;
  if (lowerTitle.includes("helicopter"))
    return <svg><use xlinkHref="/icons.svg#heli" /></svg>;
  if (lowerTitle.includes("climbing"))
    return <svg><use xlinkHref="/icons.svg#climbing" /></svg>;
  if (lowerTitle.includes("jungle"))
    return <svg><use xlinkHref="/icons.svg#rhino" /></svg>;
  if (lowerTitle.includes("adventurous"))
    return <svg><use xlinkHref="/icons.svg#adventure-sports" /></svg>;
  return null;
};

// Category Card
function CategoryCard({ categoryData }: { categoryData: CategoryItem }) {
  const { title, total_packages, urlinfo, icon, all_packages } = categoryData;
  const totalPackages = all_packages || total_packages || 0;

  return (
    <Link
      href={`${BASE_URL}${urlinfo.url_slug}`}
      className="item flex items-center group 
        [&>figure]:flex-[0_0_100px] [&>figure]:max-w-[100px]
        [&>figure>.icon]:p-[15px] [&>figure>.icon]:rounded [&>figure>.icon]:w-[100px] [&>figure>.icon]:h-[100px] [&>figure>.icon]:text-secondary [&>figure>.icon]:bg-white [&>figure>.icon]:block
        [&>figcaption]:pl-3 [&>figcaption]:flex-[0_0_calc(100%_-_100px)] 
        [&>figcaption>h3]:text-[1.125rem] [&>figcaption>span]:text-headings [&>figcaption>span]:block "
    >
      <figure>
        <i className="icon">{icon}</i>
      </figure>
      <figcaption>
        <h3>{title}</h3>
        <span>{totalPackages} itineraries</span>
      </figcaption>
    </Link>
  );
}

// Featured Categories
export default function FeaturedCategories({
  renderData,
  title,
  subtitle,
  className,
  lead,
}: FeaturedCategoriesProps) {
  // Sort & map with icons
  const data = renderData
    .sort((a, b) => b.all_packages - a.all_packages)
    .slice(0, 4).map((item) => ({
      ...item,
      icon: getCategoryIcon(item.title),
    }));

  return (
    <section className={cn("relative", className)}>
      <div className="container pb-[22px]">
        <Carousel className="[&>.overflow-hidden]:-m-3">
          <CarouselContent>
            {data.map((item, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/4 p-3 [&:nth-child(odd)]:translate-y-[-12px] [&:nth-child(even)]:translate-y-[12px]">
                <CategoryCard categoryData={item} />
              </CarouselItem>
            ))}
          </CarouselContent>


        </Carousel>
      </div>
    </section>
  );
}
