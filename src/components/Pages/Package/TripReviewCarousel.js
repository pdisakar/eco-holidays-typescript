import { useRef, useState } from "react";
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ReviewItem from "../../ReviewItem";
import { BASE_URL, IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";

export default function TripReviewCarousel({ limit, renderData }) {
  const [swiper, setSwiper] = useState();
  const swiperRef = useRef(null);
  const packageReviews = renderData?.slice(0, limit);
  return (<>
    {renderData && (
      <div className="swiper-carousel-outer">
        <div className="testimonial package-testimonial">
          {packageReviews?.length >= 3 ? (
            <Swiper
              spaceBetween={12}
              slidesPerView={1}
              ref={swiperRef}
              updateOnWindowResize
              observeParents
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                992: {
                  slidesPerView: 4,
                },
                1400: {
                  slidesPerView: 4,
                },
              }}
              onSwiper={setSwiper}
            >
              {renderData?.map((itm, index) => {
                const {
                  review_date,
                  avatar,
                  salutation,
                  review_rating,
                  full_name,
                  urlinfo,
                  review,
                  affiliate_organization,
                } = itm;
                const sanitizedReview = review.replace(/<img[^>]*>/g, '')
                const details = sanitizedReview.split(" ").splice(0, 30).join(" ");
                return (
                  <SwiperSlide key={index}>
                    {
                      <div className="item">
                        <div className="review-header">
                          <figure>
                            {avatar ? (
                              <Image
                                src={
                                  avatar ? IMAGE_URL + avatar?.full_path : ""
                                }
                                alt={full_name}
                                height={45}
                                width={45}
                              />
                            ) : (
                              full_name.charAt(0)
                            )}
                          </figure>
                          <figcaption>
                            <div className="caption-left">
                              <h5 className="text-headings">
                                {salutation + " " + full_name}
                              </h5>
                              <address>
                                {moment(review_date).format("Do MMM YYYY")}
                              </address>
                            </div>
                          </figcaption>
                        </div>
                        <div className="review-body pt-4">
                          <i className={`ratings__${review_rating}`}></i>
                          <h3 className="line-clamp-1 pt-1">
                            <Link
                              href={BASE_URL + "review/" + urlinfo.url_slug}
                            >
                              {urlinfo.url_title}
                            </Link>
                          </h3>
                          <article
                            className="line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: details }}
                          ></article>
                          <a
                            href={BASE_URL + "review/" + urlinfo.url_slug}
                            className="inline-block mt-1 text-[.75rem] underline text-secondary font-semibold uppercase"
                          >
                            + Read More
                          </a>
                        </div>
                      </div>
                    }
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {packageReviews?.map((itm, index) => {
                return (
                  <div key={index}>
                    <ReviewItem data={itm} collapsible={true} noCredits />
                  </div>
                );
              })}
            </div>
          )}
          {packageReviews?.length >= 4 && (
            <div className="swiper-navigation overly-middle">
              <div
                className="swiper-button-prev small radius"
                onClick={() => swiperRef.current.swiper.slidePrev()}
              >
                <i className="icon h-2.5 w-2.5 text-secondary">
                  <svg className="-rotate-[135deg]">
                    <use xlinkHref={BASE_URL + "sprite.svg#arrow-45"} />
                  </svg>
                </i>
              </div>
              <div
                className="swiper-button-next small radius"
                onClick={() => swiperRef.current.swiper.slideNext()}
              >
                <i className="icon h-2.5 w-2.5 text-secondary">
                  <svg className="rotate-[45deg]">
                    <use xlinkHref={BASE_URL + "sprite.svg#arrow-45"} />
                  </svg>
                </i>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </>);
}
