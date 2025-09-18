import { BASE_URL } from "@/lib/constants";
import { Menu } from "../../../components/MenuItem/MenuItem";
import Link from "next/link";
import { useRef } from "react";

interface MenuChild {
  id: number | string;
  item_slug: string;
  item_title: string;
  children: MenuChild[];
}

interface MenuItem {
  id: number | string;
  item_slug: string;
  item_title: string;
  children: MenuChild[];
}

interface MainNavProps {
  menuData: MenuItem[];
}

export default function MainNav({ menuData }: MainNavProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {menuData?.map((item, idx) => {
        const { item_slug, item_title, children, id } = item;

        return (
          <Menu
            ids={id}
            text={item_title}
            href={BASE_URL + item_slug}
            index={idx}
            key={id}
          >
            {
              idx === 0 
                ? children && (
                    <div
                      className={
                        children.length >= 7
                          ? "dropdown-menu container left-0"
                          : "dropdown-menu "
                      }
                    >
                      <div className="custom-scroll-bar">
                        <ul
                          className={
                            children.length >= 7
                              ? "grid-4"
                              : "grid-2"
                          }
                        >
                          {children?.slice(0, 11)?.map((child) => (
                            <li key={child.id}>
                              <h5 className="dropdown-header">
                                <Link href={BASE_URL + child.item_slug}>
                                  {child.item_title}
                                </Link>
                              </h5>
                              {child?.children.length >= 1 && (
                                <ul>
                                  {child?.children
                                    ?.slice(0, 11)
                                    ?.map((subChild) => (
                                      <li
                                        className="dropdown-item"
                                        key={subChild.id}
                                      >
                                        <Link
                                          href={
                                            BASE_URL + subChild.item_slug
                                          }
                                          className="dropdown-link"
                                        >
                                          {subChild.item_title}
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                : children.length >= 1 && (
                    <ul className="dropdown-menu">
                      {children?.slice(0, 11)?.map((child) => {
                        const { item_slug, item_title, children, id } = child;
                        return (
                          <li
                            className={
                              children && children.length >= 1
                                ? "dropdown-item dropdown"
                                : "dropdown-item"
                            }
                            key={id}
                          >
                            <>
                              <Link
                                href={BASE_URL + item_slug}
                                className="dropdown-link"
                              >
                                {item_title}
                              </Link>
                              {children && children.length >= 1 && (
                                <ul className="dropdown-menu">
                                  {children?.slice(0, 11).map((schild) => {
                                    const { item_slug, item_title, id } = schild;
                                    return (
                                      <li className="dropdown-item" key={id}>
                                        <Link
                                          href={BASE_URL + item_slug}
                                          className="dropdown-link"
                                        >
                                          {item_title}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </>
                          </li>
                        );
                      })}
                    </ul>
                  )
            }
          </Menu>
        );
      })}
    </>
  );
}