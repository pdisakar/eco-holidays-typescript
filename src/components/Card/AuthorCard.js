import { BASE_URL, IMAGE_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function AuthorItem({ data }) {
  const { avatar, urlinfo, name, author_blog_count } = data;
  return (
    <div className="item inline-flex flex-col text-center">
      <figure className="h-[120px] w-[120px] p-[5px] border border-secondary rounded-full">
        <Link
          href={BASE_URL + "author/" + urlinfo.url_slug}
          className="image-slot rounded-full overflow-hidden block before:pt-[100%]"
        >
          {avatar && (
            <Image
              src={IMAGE_URL + avatar.full_path}
              alt={avatar ? avatar.alt_text : full_name}
              height={250}
              width={250}
            />
          )}
        </Link>
      </figure>

      <figcaption className="pt-4 leading-[1.2]">
        <h3 className="lg:text-2xl font-semibold">
          <Link
            href={BASE_URL + "author/" + urlinfo.url_slug}
          >
            {name}
          </Link>
        </h3>
        <span className="designation font-medium text-xs text-headings/80">{author_blog_count} News & Articles</span>
      </figcaption>
    </div>
  );
}
