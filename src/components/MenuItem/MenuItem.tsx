import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";

interface MenuItemProps {
  href: string;
  title: string;
  key?: string | number;
}

export const MenuItem = ({ href, title, key }: MenuItemProps) => {
  return (
    <li className="nav-item" key={key}>
      <Link href={href} className="nav-a">
        {title}
      </Link>
    </li>
  );
};

interface MenuDropDownItemProps {
  href: string;
  text: string;
  key?: string | number;
}

export const MenuDropDownItem = ({ href, text, key }: MenuDropDownItemProps) => {
  return (
    <li className="dropdown-item" key={key}>
      <Link href={href} className="dropdown-link">
        {text}
      </Link>
    </li>
  );
};

interface MenuProps {
  children?: ReactNode;
  text: string;
  href: string;
  index: number;
  ids: string | number;
}

export const Menu = ({ children, text, href, index, ids }: MenuProps) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const linkRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  //const isMega = index === 0 || index === 1 || index === 2;
  const isMega = index === 0;
  const hasChildren = Boolean(children);
  const className = `nav-item ${hasChildren ? "dropdown" : ""} ${isMega ? "mega" : ""}`;
  const activeClass = dropdownActive ? "dropdown-active" : "";
  const activeOnHover = hasChildren ? "hover" : "";

  // Handle clicks outside the component to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (linkRef.current && !linkRef.current.contains(event.target as Node)) {
        setDropdownActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, []);

  const toggleDropdown = () => setDropdownActive((prev) => !prev);

  return (
    <li
      className={`${className} ${activeClass}`}
      data-dropdown-menu-active={activeOnHover}
      key={ids}
    >
      {hasChildren ? (
        <button
          type="button"
          className="nav-link"
          onClick={toggleDropdown}
          ref={linkRef as React.RefObject<HTMLButtonElement>}
        >
          <span>{text}</span>
        </button>
      ) : (
        <Link
          href={href}
          className="nav-link"
          prefetch={false}
          ref={linkRef as React.RefObject<HTMLAnchorElement>}
        >
          <span>{text}</span>
        </Link>
      )}
      {children}
    </li>
  );
};

interface MenuDropdownProps {
  href: string;
  title: string;
  children?: ReactNode;
  key?: string | number;
}

export const MenuDropdown = ({ href, title, children, key }: MenuDropdownProps) => {
  const collapseId = `collapse_${href.split(" ").join("")}`;
  return (
    <li className="dropdown-item dropdown" key={key}>
      <Link
        href={`#${collapseId}`}
        className="nav-a collapsed"
        data-bs-toggle="collapse"
        aria-expanded="false"
        aria-controls={collapseId}
      >
        {title}
      </Link>
      <div className="collapse" id={collapseId}>
        <ul className="sub-nav">{children}</ul>
      </div>
    </li>
  );
};