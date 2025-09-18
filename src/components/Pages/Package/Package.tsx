
import { BASE_URL, IMAGE_URL } from "@/lib/constants";
import {
  BadgeDollarSign,
  BadgeInfo,
  BookText,
  FileQuestion,
  Map,
  MapPin,
  MessageSquareHeart,
  Share2,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Breadcrumb as BreadcrumbType, PackageContent, PackageItem, Testimonial } from "@/types";
import CostDetails from "./Costdetails";
import TripDeparture from "./TripDeparture";

// === Dynamic Imports ===
const TripItinerary = dynamic(() => import("./TripItinerary"));
const TripGallery = dynamic(() => import("./TripGallery"));
const RouteMap = dynamic(() => import("./TripMap"));
const TripFaqs = dynamic(() => import("./TripFaqs"));
const ReviewCard = dynamic(() => import("@/components/Card/ReviewCard"));
const BookingModule = dynamic(() => import("./BookingModule"));
const PackageNav = dynamic(() => import("./PackageNav"));
const GoodToKnow = dynamic(() => import("./GoodToKnow"));
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));
const DownloadBrochureButton = dynamic(() => import("@/components/BrochurePDF/DownloadBrochureButton"));
const AltitudeGraph = dynamic(() => import("./AltitudeGraph"));
const PackageMeta = dynamic(() => import("./PackageMeta"));
const BestSellingPackages = dynamic(() => import("@/components/BestSellingPackages"));
const FancyReview = dynamic(() => import("@/components/FancyReview"));
const SocialShare = dynamic(() => import("@/components/SocialShare"));
const TripFact = dynamic(() => import("./TripFact"));

interface PackagePageProps {
  data: {
    page_type: string;
    content: PackageContent;
    featured_testimonials: Testimonial[];
    breadcrumbs: BreadcrumbType[][];
    related: PackageItem[]
  }
  url: string
}

export default function PackagePage({ data, url }: PackagePageProps) {

  const {
    id,
    package_title,
    package_abstract,
    package_details,
    package_cost_includes,
    package_cost_excludes,
    package_duration,
    package_duration_type,
    package_max_altitude,
    package_departure_note,
    package_trip_info,
    additional_field_1,
    additional_field_2,
    pricegroup,
    itinerary,
    destination,
    grade,
    style,
    transportation,
    meals,
    accommodation,
    active_departures,
    all_testimonials,
    testimonials,
    groupFaqs,
    package_map_path,
    featured,
    good_to_know,
    banners,
    group_default_price,
    urlinfo,
    additional_facts,
    meta,
    package_highlights,
    total_testimonials
  } = data.content;
  const breadcrumbsData = data?.breadcrumbs?.[Object.keys(data.breadcrumbs)[0]];
  const total_rating = testimonials?.reduce((sum, itm) => sum + itm.review_rating, 0) ?? 0;
  const total_review = testimonials?.length ?? 0;
  const avrage_rating = total_review > 0 ? (total_rating / (total_review * 5)) * 100 : 0;

  const package_itinerary = itinerary?.details?.filter((i) => i.itinerary_stop === 1) || [];
  const trip_testimonials = testimonials?.length ? testimonials : data.featured_testimonials;
  const brochureData = {
    title: package_title,
    slug: urlinfo.url_slug,
    package_details,
    itinerary: package_itinerary.map((a) => ({
      itinerary_day: a.itinerary_day,
      itinerary_title: a.itinerary_title,
      itinerary_description: a.itinerary_description,
      accommodation: a.accommodation,
      duration: a.duration,
    })),
    package_cost_excludes,
    package_cost_includes,
    duration: package_duration,
    price: group_default_price,
    duration_type: package_duration_type,
  };

  const navItems = [
    { link: "overview", text: "Overview", icon: <BookText /> },
    { link: "itinerary", text: "Itinerary", icon: <Map fill="currentColor" /> },
    { link: "availability", text: "Price & Availability", icon: <BadgeDollarSign /> },
    (itinerary?.itinerary_map && itinerary?.itinerary_map !== "") && { link: "map", text: "Route Map", icon: <MapPin /> },
    package_trip_info && { link: "useful-info", text: "Trip Info", icon: <BadgeInfo /> },
    { link: "reviews", text: "Reviews", icon: <MessageSquareHeart /> },
    groupFaqs?.[0] && { link: "trip_faqs", text: "FAQs", icon: <FileQuestion /> },
  ].filter(Boolean);

  const showItineraryMap = itinerary?.itinerary_map && itinerary.itinerary_map !== "";


  const Product = {
    "@context": "https://schema.org",
    "@type": "Product",
    description: meta.meta_description,
    mpn: `EHN${id}`,
    name: package_title,
    image: banners.map((b) => IMAGE_URL + b.media.full_path),
    brand: {
      "@type": "Brand",
      name: "Eco Holidays Nepal",
    },
    reviews: testimonials.map((itm) => ({
      datePublished: itm.created_at,
      reviewBody: itm.review.replace(/(<([^>]+)>)/gi, ""),
      name: itm.urlinfo?.url_title,
      "@type": "Review",
      author: { "@type": "Person", name: itm.full_name },
      reviewRating: {
        bestRating: "5",
        ratingValue: itm.review_rating.toString(),
        worstRating: "1",
        "@type": "Rating",
      },
      publisher: { "@type": "Organization", name: "Jillian" },
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: total_review > 0 ? (total_rating / total_review).toFixed(2) : "0",
      reviewCount: total_testimonials.toString(),
    },
    offers: {
      price: `${group_default_price}.00`,
      priceCurrency: "USD",
      priceValidUntil: "2028-11-26",
      availability: "https://schema.org/InStock",
      url: `${process.env.CANONICAL_BASE}${urlinfo.url_slug}`,
      "@type": "Offer",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...breadcrumbsData.map((bc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: bc.title,
        item: `${process.env.CANONICAL_BASE}${bc.slug}`,
      })),
      {
        "@type": "ListItem",
        position: breadcrumbsData.length + 1,
        name: package_title,
        item: `${process.env.CANONICAL_BASE}${urlinfo.url_slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groupFaqs?.map((faq) => ({
      "@type": "Question",
      name: faq?.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq?.answer?.replace(/<\/?[^>]+(>|$)/g, ""),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(Product) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="common-box pt-0">
        <div className="container" id="navbar-sticky-container">

          {banners.length > 0 && <TripGallery renderData={banners.map((a) => a.media)} />}

          <div className="flex items-center justify-between pt-3">
            {breadcrumbsData && <Breadcrumb data={breadcrumbsData} classes="mb-3" currentPage={urlinfo.url_title} />}
            <div className="page-action lg:flex-[0_0_20%]">
              <ul className="flex items-center lg:justify-end gap-4">
                <li className="dropdown relative group">
                  <button className="btn py-1 border-0 text-xs text-headings inline-flex justify-center items-center rounded-full hover:underline hover:text-primary">
                    <Share2 className="h-4 w-4 mr-1 text-primary" /> Share
                  </button>
                  <SocialShare
                    url={url}
                    title={package_title}
                    classess="absolute top-full z-[50] transition duration-150 ease-out translate-y-4 opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
                  />
                </li>
                <li className="dropdown">
                  <DownloadBrochureButton brochureData={brochureData} />
                </li>
              </ul>
            </div>
          </div>

          <PackageNav navItems={navItems} />

          <div className="lg:grid pt-10 package-page lg:grid-cols-10 gap-6">

            <div className="page-left lg:col-span-7">

              <div className="page-title mb-6">


                <div className="flex flex-wrap gap-y-3 justify-between gap-x-6">
                  <div>
                    <h1>{package_title}</h1>
                    <PackageMeta />
                  </div>

                </div>
              </div>
              {package_abstract && (
                <>
                  <article className="package-abstract mb-6" dangerouslySetInnerHTML={{ __html: package_abstract }} />
                </>
              )}

              <TripFact {...{ destination, package_duration, package_duration_type, grade, style, accommodation, package_max_altitude, minPeople: pricegroup?.[0]?.min_people ?? null, transportation, meals, additional_facts }}
              />

              {package_highlights && (
                <div className="package-section highlights ">
                  <h2 className="mb-5 text-secondary text-xl font-bold">
                    Highlights of {package_title}
                  </h2>
                  <article className="common-module" dangerouslySetInnerHTML={{ __html: package_highlights }} />
                </div>
              )}

              <div className="package-section" id="overview">
                <div className="common-module">
                  <h2 className="section-title">Trip Overview</h2>
                  {package_details && (
                    <article className="common-module mb0" dangerouslySetInnerHTML={{ __html: package_details }} />
                  )}
                </div>
              </div>

              {additional_field_2 && <div className="p-3 md:p-6 mb-6 lg:mb-10 bg-secondary/10 rounded-md flex gap-x-3" >
                <svg className="bg-secondary flex-[0_0_24px] text-white rounded-full p-0.5" height={24} width={24}><use xlinkHref="/icons.svg#info-i" /></svg>
                <article dangerouslySetInnerHTML={{ __html: additional_field_2 }}></article>
              </div>}



              <CostDetails package_cost_excludes={package_cost_excludes} package_cost_includes={package_cost_includes} package_title={package_title} />

              <div className="package-section" id="availability">
                <TripDeparture
                  renderData={active_departures}
                  slug={urlinfo.url_slug}
                  package_duration={package_duration}
                  groupPrice={pricegroup}
                  group_default_price={group_default_price}
                  title={`Price & Availability`}
                />
              </div>

              {package_itinerary.length > 0 && (
                <div className="package-section" id="itinerary">
                  <div className="common-module">
                    <TripItinerary
                      renderData={package_itinerary}
                      duration_type={package_duration_type}
                      title={`Itinerary of ${package_title} - ${package_duration} ${package_duration_type}`}
                    />
                    <div className="relative bg-light text-headings font-medium text-md rounded-md p-6 mt-3">
                      <i className="icon h-16 w-16 opacity-20 text-secondary absolute right-6 bottom-3">
                        <svg><use xlinkHref="/icons.svfvg#customize_trip" fill="currentColor" /></svg>
                      </i>
                      <p>If the provided schedule isn't suitable for you, we can create personalized travel arrangements.</p>
                      <Link href={`/customize-trip?_trip=${id}`} className="btn btn-md btn-secondary font-bold rounded-lg mt-3">
                        Customize My Trip
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {
                showItineraryMap && (
                  <div className="package-section" id="map">
                    <h2 className="section-title">{package_title} Map & Elevation</h2>

                    <RouteMap itinerarys={itinerary} className="mb-3" />
                    <AltitudeGraph renderData={itinerary} duration_type={package_duration_type} />
                  </div>
                )
              }



              {good_to_know && good_to_know.length > 0 && (
                <div className="package-section" id="useful-info">
                  <GoodToKnow renderData={good_to_know} title="Essential Information" />
                </div>
              )}

              {groupFaqs?.[0] && (
                <div className="package-section" id="trip_faqs">
                  <TripFaqs renderData={groupFaqs[0]} title="FAQs" package_title={package_title} />
                </div>
              )}

              <div className="package-section" id="reviews">
                <div className="common-module mb0">
                  <div className="module-title">
                    <h2 className="section-title">Traveller Review</h2>
                  </div>
                  <FancyReview className="mb-6" />
                  <ul className="grid gap-3 [&>li+li]:border-t [&>li+li]:border-t-border [&>li+li]:pt-5 [&>li+li]:mt-5">
                    {trip_testimonials?.map((itm: any, idx: number) => (
                      <li key={idx}>
                        <ReviewCard reviewData={itm} className="p-0 shadow-none border-none lg:p-0 [&>.card-body>article]:leading-[1.65]" />
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${BASE_URL}reviews`}
                    className="btn text-sm mt-6  text-white border font-semibold rounded-full px-6 py-2 bg-primary border-primary/70"
                  >
                    Read All Review
                  </Link>
                </div>
              </div>
            </div>

            <aside className="page-right booking-module-sticky-top lg:col-span-3"> <BookingModule
              groupPrice={pricegroup}
              price={group_default_price}
              duration={package_duration}
              durationType={package_duration_type}
              status={additional_field_1}
              package_title={package_title}
              testimonials={testimonials}
              avrage_rating={avrage_rating}
              total_rating={total_rating}
              all_testimonials={all_testimonials}
            /> </aside>


          </div>




        </div>
      </div>



      {data.related.length > 0 && (
        <BestSellingPackages className="common-box border-t border-t-border" renderData={data.related} title="Similar <b>Trips</b>" />
      )}
    </>
  );
}