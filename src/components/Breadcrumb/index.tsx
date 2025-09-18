import Link from "next/link";
import { BASE_URL } from "@/lib/constants";

interface BreadcrumbItem {
  slug: string;
  title: string;
}

interface BreadcrumbProps {
  data?: BreadcrumbItem[];
  currentPage: string;
  classes?: string;
}

export default function Breadcrumb({ data, currentPage, classes }: BreadcrumbProps) {
  const breadcrumbData = data?.slice(0, data.length - 1)||[];

  return (
    <nav className={`breadcrumb-nav hidden md:block relative z-10 ${classes || ""}`}>
      <ol className="breadcrumb flex items-center text-xxs font-semibold text-muted [&>li>a]:inline-block [&>li>a]:leading-[1.5]">
        {/* Home Link */}
        <li className="breadcrumb-item">
          <Link href="/" className="text-muted underline hover:text-primary">
            Home
          </Link>
        </li>
        {breadcrumbData.map(({ slug, title }, idx) => (
          <li key={idx} className="breadcrumb-item">
            <Link
              href={`${BASE_URL}${slug}`}
              className="text-muted hover:text-primary"
            >
              {title}
            </Link>
          </li>
        ))}

        {/* Current Page */}
        <li className="breadcrumb-item active">
          <span className="text-primary">{currentPage}</span>
        </li>
      </ol>
    </nav>
  );
}