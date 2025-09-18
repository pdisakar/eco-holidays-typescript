"use client";
import { useState } from "react";
import AnimateHeight from "react-animate-height";

export default function EssentialInfo({ data, title }) {
  const [height, setHeight] = useState(500);
  const [active, setActive] = useState(false);
  //animate heighs
  const toggleHeight = () => {
    setActive(!active);
    setHeight(height === 500 ? "auto" : 500);
  };
  return (
    <div id="useful-info" className="package-section">
      <div className="common-module">
        <div className="module-title">
          <h2 className="text-xl md:text-2xl text-headings font-extrabold">
            Useful Informations
          </h2>
        </div>

        {data?.split(" ").length >= 200 ? (
          <>
            <AnimateHeight duration={250} height={height}>
              <article
                className="common-module !mb-0"
                dangerouslySetInnerHTML={{ __html: data }}
              ></article>
            </AnimateHeight>
            <button
              className="btn text-sm border-0 font-bold rounded-md z-10 relative px-4 py-1 block btn-primary mt-6"
              onClick={toggleHeight}
            >
              {height == 500 ? "+ Read more" : "- Read less"}
            </button>
          </>
        ) : (
          <article
                className="common-module !mb-0"
            dangerouslySetInnerHTML={{ __html: data }}
          ></article>
        )}
      </div>
    </div>
  );
}
