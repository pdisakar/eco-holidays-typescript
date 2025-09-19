import { BlogItem, CategoryItem, Media, Meta, PackageItem, UrlInfo } from "@/types";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const BlogCard = dynamic(() => import("@/components/Card/BlogCard"));
const CategoryCard = dynamic(() => import("@/components/Card/CategoryCard"));
const PackageCard = dynamic(() => import("@/components/Card/PackageCard"));
const PageBanner = dynamic(() => import("@/components/Banners/PageBanner"));
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"));

interface Content {
  title: string;
  description: string | null;
  children: CategoryItem[];
  packages: PackageItem[];
  meta: Meta;
  banner: Media;
  urlinfo: UrlInfo;
  blogs: BlogItem[];
}

interface CategoryProps {
  data: {
    content: Content,
    breadcrumbs: BreadcrumbData[][],
  };
  siteUrl?:string
}

interface BreadcrumbData {
  slug: string;
  title: string;
}

// === Main Component ===
export default function Category({ data }: CategoryProps) {
  const { title, description, children, packages, banner, urlinfo, blogs } =
    data.content;
  const hasChildren = useMemo(
    () => children && children.length > 0,
    [children]
  );
  const hasPackages = useMemo(
    () => packages && packages.length > 0,
    [packages]
  );
  const hasBlogs = useMemo(() => blogs && blogs.length > 0, [blogs]);
  const hasDescription = useMemo(
    () => description && description.trim() !== "",
    [description]
  );

  return (
    <>
      {banner && <PageBanner renderData={banner} pageTitle={title} />}

      <div className="common-box pt-0">
        <div className="container" role="main">
          <div className="lg:w-9/12 lg:mx-auto">
            <div className="page-title pt-6 lg:pt-0 mb-6">
              {data.breadcrumbs?.[0] && (
                <Breadcrumb
                  data={data.breadcrumbs[0]}
                  currentPage={title}
                  classes="py-3 mb-3"
                />
              )}
              <h1>{title}</h1>
            </div>
          </div>

          {hasChildren && (
            <div
              className={`common-module category ${!hasPackages ? "mb-0" : ""}`}
            >
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {children.map((itm, idx) => (
                  <li key={idx}>
                    <CategoryCard categoryData={itm} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasPackages && (
            <div className={`common-module ${!hasBlogs ? "mb-0" : ""}`}>
              <div className="package-list">
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                  {packages
                    .filter((p) => p.status !== 0)
                    .map((itm, idx) => (
                      <li className="col-lg-4" key={idx}>
                        <PackageCard packageData={itm} />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}

          {hasBlogs && (
            <div className="common-module mb-0">
              <div className="common-module mb-0">
                <div className="blog-list">
                  <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((itm, idx) => (
                      <li key={idx}>
                        <BlogCard blogData={itm} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasDescription && (
        <div className="common-box bg-gradient-to-b from-light to-secondary/0">
          <div className="container">
            <div className="lg:w-9/12 lg:mx-auto">
              <div className="title">
                <h2>About {title}</h2>
              </div>
              <article
                className="common-module"
                dangerouslySetInnerHTML={{ __html: description }}
              ></article>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
