"use client";
import AnimateHeight from "react-animate-height";
import { useState } from "react";
import useWindowSize from "../../useWindowSize";

export default function TripOverview({ package_details, title }) {
  const { width } = useWindowSize();

  const [height, setHeight] = useState(250);
  const [active, setActive] = useState(false);
  const toggleHeight = () => {
    setActive(!active);
    setHeight(height === 250 ? "auto" : 250);
  };
  //lg:before:-z-10 lg:before:absolute lg:before:inset-0 lg:before:bg-mountain-range lg:before:bg-no-repeat lg:before:bg-right-bottom

  return (
    <div id="overview" className="package-section">
      <div className="common-module">
        <div className="module-title">
          <h2>{title}</h2>
        </div>
        {width <= 768 ? (
          <>
            <AnimateHeight duration={250} height={height}>
              <article
                className="common-module mb-0"
                dangerouslySetInnerHTML={{ __html: package_details }}
              ></article>
            </AnimateHeight>

            <button
              type="button"
              className="bg-primary shadow-lg shadow-primary/20 mt-5 px-6 py-1.5 text-white font-secondary capitalize font-medium text-sm rounded"
              onClick={toggleHeight}
            >
              {height === 250 ? "read more +" : "read less -"}
            </button>
          </>
        ) : (
          <article className="common-module mb-0">
            <article
              className="common-module mb-0"
              dangerouslySetInnerHTML={{ __html: package_details }}
            ></article>
          </article>
        )}
      </div>
    </div>
  );
}
