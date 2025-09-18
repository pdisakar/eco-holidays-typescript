import { Fancybox, Carousel, Panzoom } from "@fancyapps/ui";
import Image from "next/image";
import { useEffect } from "react";

export default function TripGallery({ limit, renderData, thumbinalsControl }) {
  useEffect(() => {
    const mainCarousel = new Carousel(document.querySelector("#mainCarousel"), {
      Dots: false,
    });

    // Thumbnails
    const thumbCarousel = new Carousel(
      document.querySelector("#thumbCarousel"),
      {
        Sync: {
          target: mainCarousel,
          friction: 0,
        },
        Dots: false,
        Navigation: false,
        center: true,
        slidesPerPage: 1,
        infinite: false,
      }
    );

    // Customize Fancybox
    Fancybox.bind('[data-fancybox="gallery"]', {
      Carousel: {
        on: {
          change: (that) => {
            mainCarousel.slideTo(mainCarousel.findPageForSlide(that.page), {
              friction: 0,
            });
          },
        },
      },
    });
  });
  return (
    <>
      <div id="mainCarousel" className={[style.wrapper + " " + style.full]}>
        {renderData.map((itm, idx) => {
          return (
            <div
              className={style.slider + " carousel__slide"}
              data-src={process.env.imageUrl + "/" + itm.full_path}
              data-fancybox="gallery"
              data-caption={itm.caption}
              key={idx}
            >
              <Image
                src={process.env.IMAGE_URL + itm.full_path}
                alt={itm.caption}
                height={500}
                width={940}
                layout="responsive"
              />
            </div>
          );
        })}
      </div>

      {thumbinalsControl && (
        <div
          id="thumbCarousel"
          className={[style.wrapper + " " + style.thumbinal]}
        >
          {renderData.map((itm, idx) => {
            return (
              <div className={style.slider + " carousel__slide"} key={idx}>
                <Image
                  src={process.env.IMAGE_URL + itm.thumb_path}
                  alt={itm.caption}
                  height={100}
                  width={100}
                  className="panzoom__content"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
