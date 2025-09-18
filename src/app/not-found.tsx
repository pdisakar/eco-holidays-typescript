import Link from "next/link";
import type { Metadata } from "next";

export function metadata(): Metadata {
  return {
    title: "Page Not Found"
  };
}

export default function NotFound() {
  return (
    <div className="common-box">
      <div className="flex flex-col items-start justify-start  md:flex-row md:items-center md:justify-center md:space-x-6 min-h-[50vh]">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-8xl font-secondary text-headings font-normal leading-9 tracking-tight dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
            404
          </h1>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-headings text-xl font-bold leading-normal md:text-2xl">
            Sorry we could not find this page.
          </p>
          <p className="mb-8">But do not worry, you can find plenty of other things on our homepage.</p>
          <Link
            href="/"
            className="focus:shadow-outline-primary inline rounded border border-transparent bg-primary/90 px-6 py-3 text-sm font-bold leading-5 text-white shadow transition-colors duration-150 hover:bg-primary focus:outline-none dark:hover:bg-blue-500"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}