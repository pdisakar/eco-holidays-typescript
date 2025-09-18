import { IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import { useState, useCallback, memo } from "react";
import { PlayFill } from "react-bootstrap-icons";

const TripVideo = memo(({ renderData, coverImage, title }) => {
  const [iframeVisible, setIframeVisible] = useState(false);

  const handlePlayButtonClick = useCallback(() => {
    setIframeVisible(true);
  }, []);

  return (
    <div className="featured-video trip-video">
      <div className="responsive-embed mb-0">
        {!iframeVisible ? (
          <figure className="image-slot bg-black before:pt-[56.25%]">
            <Image
              src={`${IMAGE_URL}${coverImage.full_path}`}
              alt={`${title} - video`}
              layout="responsive"
              height={500}
              width={642}
              loading="lazy" // Lazy load the image
            />
            <figcaption>
              <button
                onClick={handlePlayButtonClick}
                className="cursor-pointer h-20 rounded-full w-20 bg-black/20 inline-flex justify-center items-center hover:bg-black/30"
                aria-label={`Play ${title} video`}
              >
                <i className="icon h-12 w-12">
                  <PlayFill fill="currentColor" />
                </i>
              </button>
            </figcaption>
          </figure>
        ) : (
          <div className="bg-black">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${renderData.fact_value}?autoplay=1`}
              title={`${title} video player`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy" // Lazy load the iframe
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
});

// Adding a displayName to the memoized component
TripVideo.displayName = 'TripVideo';

export default TripVideo;
