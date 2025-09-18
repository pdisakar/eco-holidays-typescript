import { BASE_URL, IMAGE_URL } from "@/lib/constants";
import { CategoryItem } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  categoryData: CategoryItem;
  isFeatured?: boolean;
}

export default function CategoryCard({ categoryData, isFeatured }: CategoryCardProps) {
  const { title, featured, total_packages, urlinfo } = categoryData;
  const totalPackages =
    categoryData.all_packages !== undefined
      ? categoryData.all_packages
      : total_packages ?? 0;

  return (
    <div className="item group">
      <figure className="relative after:bg-black/0 after:transition-all after:z-10 after:absolute after:inset-0 after:rounded-md after:pointer-events-none after:bg-gradient-to-t after:from-headings/70 after:to-headings/5 ">
        <Link
          href={BASE_URL + encodeURIComponent(urlinfo.url_slug)}
          className="image-slot block before:pt-[135.71428571%] rounded-md overflow-hidden "
        >
          {featured && (
            <Image
              src={IMAGE_URL + featured.full_path}
              alt={featured.alt_text ? featured.alt_text : title}
              width={280}
              height={350}
              sizes="auto, (max-width: 280px) 100vw, 280px"
              className="transition-transform group-hover:scale-110"
            />
          )}
        </Link>

        <figcaption className="absolute px-5 py-4 drop-shadow-lg z-20  rounded bottom-0 inset-x-0 p-x-3 transition-all duration-100 pointer-events-none">
          <h3 className="font-semibold font-secondary text-[1.125rem] md:text-lg lg:text-xl  transition-all delay-100">
            <Link
              href={BASE_URL + encodeURIComponent(urlinfo.url_slug)}
              className="text-white"
            >
              {title}
            </Link>
          </h3>
          {totalPackages !== 0 && (
            <span className="package-count text-md delay-200 text-white/90 font-medium  transition-all before:h-0.5 before:w-6 before:bg-current before:inline-block before:align-middle before:mr-1">
              {totalPackages <= 9
                ? `0${totalPackages} itineraries`
                : `${totalPackages} itineraries`}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}