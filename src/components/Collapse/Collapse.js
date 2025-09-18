import { useState } from "react";
import AnimateHeight from "react-animate-height";
import Link from "next/link";

export default function Collapse({ children, href, title}) {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState(0);

  const onCollapse = (e) => {
    e.preventDefault();
    setActive(!active);
    setHeight(height === 0 ? "auto" : 0);
  };

  return (
    <li className="nav-item">
      <div className={active ? "nav-link active" : "nav-link"}>
        <Link href={href}>
          {title}
        </Link>
        {children && (
          <button
            type="button"
            className="btn-toggle"
            onClick={(e) => onCollapse(e)}
          >
            {/* {active ? <i className="plus-minus"><Dash /></i> : <i className="icon"><Plus /></i>} */}
            <i className="icon"></i>
          </button>
        )}
      </div>
      {/* <Link href={href}>
          {title}
        </Link>
        {children && (
          <button
            type="button"
            className="btn-toggle"
            onClick={(e) => onCollapse(e)}
          >
            {active ? "-" : "+"}
          </button>
        )} */}
      {children &&  <AnimateHeight duration={300} height={height}>
        {children}
      </AnimateHeight>}
    </li>
  );
}
