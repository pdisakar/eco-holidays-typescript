import { BASE_URL } from "@/lib/constants";
import { getHomeData } from "@/services/network_requests";
import dynamic from "next/dynamic";
import type { Metadata } from 'next'
import DepartureTrips from "@/components/DepartureTrips";

const BestSellingPackages = dynamic(
  () => import("@/components/BestSellingPackages")
);
const FeaturedReview = dynamic(
  () => import("@/components/FeaturedReview/FeaturedReview")
);
const HomeContent = dynamic(() => import("@/components/HomeContent"));
const FeaturedBlog = dynamic(() => import("@/components/FeaturedBlog"));
const FeaturedCategories = dynamic(
  () => import("@/components/FeaturedCategories")
);
const Service = dynamic(() => import("@/components/services"));
const Banner = dynamic(() => import("@/components/Banners/HomeBanner"));

function getTravelYear(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const startYear = month === 11 ? year + 1 : year;
  const endYearShort = (startYear + 1).toString().slice(-2);

  return `${startYear}/${endYearShort}`;
}


export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomeData();
  const pagecontent = data?.pagecontent;
  return {
    title: pagecontent?.meta?.meta_title,
    description: pagecontent?.meta?.meta_description,
    alternates: {
      canonical: process.env.CANONICAL_BASE,
    },
    openGraph: {
      title: pagecontent?.meta?.meta_title,
      description: pagecontent?.meta?.meta_description,
      url: process.env.CANONICAL_BASE,
    },
  };
}


export default async function Home(): Promise<JSX.Element> {
  const [data] = await Promise.all([getHomeData()]);
  const testimonialsAvatars =
    "featured_testimonials" in data && Array.isArray(data.featured_testimonials)
      ? data.featured_testimonials
        .filter((itm: { avatar: string | null }) => itm.avatar !== null)
        .map((a: { avatar: any }) => a.avatar)
      : [];
  const bannerData = data.pagecontent.carousel.content[0];


  return (
    <>
      <Banner
        single={true}
        renderData={bannerData}
        video={false}
        className=""
      />
      <FeaturedCategories
        title="Explore your ways out…"
        lead="Discover the best of the Himalayas with our featured categories, showcasing the most popular and beloved tours."
        renderData={data.featured_categories}
        className="common-box wave-bottom bg-light"
      />

      {/* <Service className="pt-6 lg:pt-8" /> */}
      <BestSellingPackages
        className="common-box"
        titleClassName="text-center"
        renderData={data.featured_packages}
        title={`Featured <b>Trekking in Nepal</b>`}
        lead="Some of the best rated Nepal Trekking"
        linkTo={BASE_URL + data.category_section_a.urlinfo.url_slug}
      />
      <BestSellingPackages
        titleClassName="text-center"
        className="common-box pb-0 border-t border-t-border"
        testimonialsAvatars={testimonialsAvatars}
        renderData={data.category_section_a.packages}
        title={`Top <b>Tours in Nepal</b>`}
        subTitle="Handpicked for you"
        lead="Some of the best rated Tours in Nepal"
        linkTo={BASE_URL + data.category_section_a.urlinfo.url_slug}
      />

      <HomeContent
        renderData={data.pagecontent}
      />


      <FeaturedReview
        renderData={data.featured_testimonials}
        title={`Whats our <b>Clients Say</b>`}
        classes="common-box featured-testimonial bg-secondary before:-z-10 before:inset-0 before:absolute before:bg-[url('/path-pattern.png')] before:bg-repeat before:opacity-10 z-10"
      />
      <DepartureTrips containerClass="container" classes="common-box bg-[#F2ECDC] z-10 before:-z-10 before:inset-0 before:absolute before:bg-[url('/path-pattern.png')] before:bg-repeat before:opacity-100 " title="Upcoming <b>Depatures</b>" lead="These are the most visited and popular Nepal Holidays destinations." />
      <FeaturedBlog
        renderData={data.featured_blogs}
        classes="common-box"
        title="From Our <b>Blog</b>"
        subTitle="Travel related news and updates"
        lead="Get the latest travel tips, destination guides, and inspiration from our travel experts."
        limit={4}
      />
    </>
  );
}
