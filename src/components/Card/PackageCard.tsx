import Image from 'next/image';
import Link from 'next/link';
import { BASE_URL, IMAGE_URL, PACKAGE_BASE_URL } from '@/lib/constants';
import { Media, UrlInfo } from '@/types';

interface Destination {
  urlinfo: UrlInfo;
  title: string;
}

interface Testimonial {
  review_rating: number;
}

interface PackageData {
  package_title: string;
  featured?: Media;
  package_discount?: number;
  package_duration: number;
  package_duration_type: string;
  urlinfo: UrlInfo;
  testimonials?: Testimonial[];
  // FIX: Allow 'additional_field_1' to be null to match the incoming 'PackageItem' type.
  additional_field_1?: string | null;
  group_default_price: number;
  id: string | number;
  grade?: string;
  trip_style?: string;
  style?: string;
  total_testimonials: number;
  destination?: Destination;
}

interface PackageCardProps {
  packageData: PackageData;
  isSuggested?: boolean;
}

export default function PackageCard({
  packageData,
  isSuggested,
}: PackageCardProps) {
  const {
    package_title,
    featured,
    package_discount,
    package_duration,
    package_duration_type,
    urlinfo,
    testimonials,
    additional_field_1,
    group_default_price,
    id,
    grade,
    trip_style,
    style,
    total_testimonials,
    destination,
  } = packageData;

  const slug = urlinfo.url_slug;

  const statusClasses = `leading-[14px] mt-3 flex items-center gap-x-1.5   z-20 text-muted font-secondary text-sm`;

  const renderAdditionalField = () => {
    let bgColor: string, iconHref: string;
    switch (additional_field_1) {
      case 'Best Price':
        bgColor = 'bg-secondary';
        iconHref = 'tagsFill';
        break;
      case 'Group Tours':
        bgColor = 'bg-primary';
        iconHref = 'peopleFill';
        break;
      default:
        bgColor = 'bg-warning';
        iconHref = 'starFill';
    }
    return (
      <div className={`${statusClasses}`}>
        <svg
          className="bg-danger text-white rounded-full inline-block"
          height={18}
          width={18}>
          <use xlinkHref="/icons.svg#info-i" />
        </svg>
        {additional_field_1 === 'Pravite Trip'
          ? 'Private Trip'
          : additional_field_1}
      </div>
    );
  };

  const renderImage = (className: string) => (
    <Link
      href={PACKAGE_BASE_URL + slug}
      className={`rounded-[20px] shadow-[0_5px_10px] shadow-black/15 image-slot before:pt-[66.6666666667%] ${className}`}>
      {featured && (
        <Image
          src={`${IMAGE_URL}${featured.full_path}`}
          alt={
            featured.alt_text
              ? featured.alt_text ?? package_title
              : package_title
          }
          width={372}
          height={320}
          className="object-cover transition-transform group-hover:scale-110"
          sizes="auto, (max-width: 372px) 100vw, 372px"
          fetchPriority="high"
        />
      )}
    </Link>
  );

  return (
    <div className="item rounded-md h-full group">
      <figure className="relative mx-[-1px] mt-[-1px]">
        {renderImage('')}
      </figure>
      <figcaption className="pt-4 px-1">
        <div className="caption-header min-h-[60px]">
          <h3 className="line-clamp-2 font-bold text-[1.125rem] md:text-lg leading-[1.2]">
            <Link
              href={PACKAGE_BASE_URL + slug}
              className="text-headings transition-color  hover:underline hover:decoration-primary">
              {urlinfo.url_title}
            </Link>
          </h3>
          <ul className="flex items-center gap-x-2 text-muted text-xs font-medium mt-1">
            <li className="duration inline-flex items-center gap-x-1.5 leading-[1]">
              {`${package_duration} ${
                package_duration_type === 'days'
                  ? 'Days'
                  : package_duration_type
              }`}
            </li>
            <li>|</li>
            {total_testimonials > 0 && (
              <li className="duration inline-flex items-center gap-x-1">
                <i className="ratings__5 scale-[0.95]"></i>
                <span>
                  (
                  {`${
                    total_testimonials <= 9 ? '0' : ' '
                  }${total_testimonials} reviews`}
                  )
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex leading-[1] justify-between items-center">
          <div className="package-cost font-secondary flex items-center gap-x-1.5">
            {/* <span className="text-muted text-xxs font-medium tracking-wide block mb-0.5">
              Starting From
            </span> */}
            <span className="text-secondary font-bold  text-[1.125rem] sm:text-lg">
              US${group_default_price}
            </span>
            <span className="text-muted line-through inline-block text-sm md:text-md">
              US${(group_default_price * 1.05).toFixed(0)}
            </span>
          </div>
          <div className="button">
            <Link
              className="font-semibold h-8 w-8 inline-flex justify-center items-center capitalize text-sm text-primary bg-primary/10 rounded-full  text-pretty tracking-wide  hover:uderline hover:decoration-primary group-hover:bg-primary group-hover:text-white transition-all duration-150 ease-linear"
              aria-label={`Explore ${package_title}`}
              title={`Explore ${package_title}`}
              href={BASE_URL + urlinfo.url_slug}>
              <svg className="h-3 w-3 inline-block">
                <use
                  xlinkHref="/icons.svg#arrow-short-right"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>

        {additional_field_1 && <> {renderAdditionalField()}</>}
      </figcaption>
    </div>
  );
}
