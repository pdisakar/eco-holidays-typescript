"use client";
import { useEffect, useRef, useState } from "react";
import useActiveElementScroll from "@/hooks/ActiveElementScroll";
import useScrollspy from "@/hooks/useScrollspy";
import Link from "next/link";

interface NavItem {
  link: string;
  text: string;
  icon?: React.ReactNode;
}

interface PackageNavProps {
  navItems: NavItem[];
  className?: string
}

export default function PackageNav({
  navItems,
  className
}: PackageNavProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction: "up" | "down" = currentScrollY > lastScrollY ? "down" : "up";
      setScrollDirection(direction);

      setIsVisible(currentScrollY > 300);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navRef = useRef<HTMLUListElement | null>(null);

  // Initialize custom hooks
  useActiveElementScroll(navRef);
  const activeId = useScrollspy(
    navItems.map((section) => section.link),
    100
  );

  return (
    <nav
      className={`fixed bg-white shadow-md top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible
          ? "transform translate-y-0 opacity-100"
          : "transform -translate-y-full opacity-0"
      } ${className}`}
    >
      <div className="container flex">
        <ul
          className="nav-wrapper flex items-center whitespace-nowrap overflow-x-scroll"
          ref={navRef}
          style={{ scrollbarWidth: "none" }}
        >
          {navItems.map(({ link, text, icon }, idx) => (
            <li key={idx}>
              <Link
                href={`#${link}`}
                className={`flex relative uppercase whitespace-nowrap leading-[16px] items-center text-xxs md:text-xs font-semibold py-[16px] px-4 transition-all duration-150 after:absolute after:left-0 after:right-0 after:bottom-0 after:bg-primary after:transition-all ${
                  activeId === link
                    ? "text-headings after:h-[3px] active bg-primary/10"
                    : "text-muted hover:text-primary after:delay-200"
                }`}
              >
                {/* {icon && <i className="icon h-4 w-4 mr-1 -mt-0.5">{icon}</i>} */}
                {text}
              </Link>
            </li>
          ))}
        </ul>

        {/* Inquiry Button
        {!inquiryNavbar && (
          <div className="inline-flex items-center pl-6">
            <button
              onClick={() => setIsPopupsActive(true)}
              className="px-6 py-1.5 bg-secondary text-white text-sm font-bold rounded uppercase"
            >
              Inquiry
            </button>
          </div>
        )} */}
      </div>
    </nav>
  );
}
