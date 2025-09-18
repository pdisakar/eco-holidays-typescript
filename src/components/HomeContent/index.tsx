"use client";

import Link from "next/link";
import Searvice from "../services";

interface PageProps {
  renderData: PageItem;
}

interface PageItem {
  page_title: string;
  page_description: string;
}


export default function HomeContent({ renderData }: PageProps) {
  const { page_title, page_description } = renderData;
  return (
    <section className="relative z-20 overflow-hidden home-content bg-light lg:bg-white common-box">
      <span className="absolute hidden lg:block top-0 right-[-2px] h-[150px] w-[150px] z-20 text-light icon">
        <svg>
          <use xlinkHref="./icons.svg#hiker"></use>
        </svg>
      </span>
      <div className="container">
        <div className="lg:grid lg:grid-cols-11 lg:gap-6">

          <div className="lg:order-2 lg:col-span-6 lg:pl-3">
            <div className="title [&>h1]:drop-shadow-black [&>h1]:text-shadow-white">
              <h1 className="text-3xl md:text-4xl font-normal mb-2" dangerouslySetInnerHTML={{ __html: page_title }} />
            </div>
            <div
              className="common-box pt-0 relative
              lg:before:absolute lg:before:inset-x-[-99999px] lg:before:bg-light lg:before:inset-y-0 lg:before:-z-10"

            >
              <article className="common-module z-10 mb0 text-base font-normal tracking-wide [&>ul>li]:text-left  lg:pt-8 [&>blockquote]:text-base md:[&>blockquote]:text-lg " dangerouslySetInnerHTML={{ __html: page_description }}></article>

              <Link href="/about-us" className="btn btn-lg btn-primary rounded mt-6">Know more about us</Link>
            </div>
          </div>
          <div className="lg:order-1 lg:col-span-5 relative z-50">

            <Searvice />
          </div>
        </div>
      </div>
    </section>
  );
}
