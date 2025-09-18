"use client";
import { useRef, useState } from "react";
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
import { BASE_URL } from "@/lib/constants";
import PackageItem from "../PackageItem/Package";
import PackageSkeleton from "../PackageItem/PackageSkeleton";

export default function FeaturedPackages({
  title,
  subTitle,
  limit,
  renderData,
  isRelated,
  classes,
}) {
  const [swiper, setSwiper] = useState();
  const [swiperLoading, setSwiperLoading] = useState(true)
  const swiperRef = useRef(null);
  const featuredPackages = renderData?.slice(0, limit);

  return (
    <section className={classes}>
      <div className="container">
        <div className="title two-col">
          <div>
            {subTitle && <span className="subtitle">{subTitle}</span>}
            <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
          </div>
          <div>
            {!swiperLoading && renderData.length > 3 && (
              <div className="swiper-navigation">
                <div
                  className="swiper-button-prev medium radius"
                  onClick={() => swiperRef.current.swiper.slidePrev()}
                >
                  <i className="icon h-3 w-3 text-headings">
                    <svg className="-rotate-[135deg]"><use xlinkHref={BASE_URL + 'sprite.svg#arrow-45'} /></svg>
                  </i>
                </div>
                <div
                  className="swiper-button-next medium radius"
                  onClick={() => swiperRef.current.swiper.slideNext()}
                >
                  <i className="icon h-3 w-3 text-headings">
                    <svg className="rotate-[45deg]"><use xlinkHref={BASE_URL + 'sprite.svg#arrow-45'} /></svg>
                  </i>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {renderData && (
          <div className="swiper-carousel-outer">
            <div className="package-layot__grid-classic package-carousel">
              {renderData?.length > 3 ? (
                <>
                  {swiperLoading && <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 lg:gap-6">
                    {
                      Array(2).fill().map((index, idx) => {
                        return (
                          <li key={idx}>
                            <PackageSkeleton />
                          </li>
                        )
                      })
                    }
                  </ul>
                  }
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={2}
                      ref={swiperRef}
                      updateOnWindowResize
                      observeParents
                      loop={true}
                      breakpoints={{
                        320: {
                          spaceBetween: 10,
                          slidesPerView: 2,
                        },
                        640: {
                          spaceBetween: 12,
                          slidesPerView: 2,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        }
                      }}
                      onSwiper={(swiper) => { if (swiper) { setSwiperLoading(false) } }}
                    >
                      {!swiperLoading && featuredPackages.map((itm, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <PackageItem packageData={itm} />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                </>

              ) : (
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPackages?.map((itm, index) => {
                    return (
                      <li key={index}>
                        <PackageItem packageData={itm} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
