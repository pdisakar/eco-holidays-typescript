import { useState } from "react";
import AnimateHeight from "react-animate-height";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
} from "react-bootstrap-icons";

const ItemBody = ({ content }) => {
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(false);

  //animate heighs
  const toggleHeight = () => {
    setActive(!active);
    setHeight(height === 0 ? "auto" : 0);
  };
  return (
    <>
      <div className="item-head" onClick={toggleHeight}>
        {content.detail_title}
        <span className="toggler">
          {height === 0 ? <ChevronDown /> : <ChevronUp />}
        </span>
      </div>
      <AnimateHeight duration={500} height={height}>
        <div className="item-body">
          <div
            dangerouslySetInnerHTML={{ __html: content.detail_description }}
          />
        </div>
      </AnimateHeight>
    </>
  );
};

export default function TripCostDetails({ costIncludes, costExcludes }) {
  return (
    <div className="package-cost-details">
      <ul>
        {costIncludes?.map((itm, idx) => {
          return (
            <li key={idx} className="include">
              <span className="icon">
                <CheckCircle fill="currentColor" />
              </span>
              <div className="item">
                <ItemBody content={itm} />
              </div>
            </li>
          );
        })}
        {costExcludes?.map((itm, idx) => {
          return (
            <li key={idx} className="exclude">
              <span className="icon">
                <XCircle fill="currentColor" />
              </span>
              <div className="item">
                <ItemBody content={itm} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
