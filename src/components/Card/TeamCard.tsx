import { BASE_URL, IMAGE_URL } from "@/lib/constants";
import { Media, TeamItem, UrlInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface TeamCardProps {
  data: TeamItem;
  isAbout?: boolean
}

export default function TeamCard({ data, isAbout }: TeamCardProps) {
  const { avatar, urlinfo, full_name, position } = data;
  return (
    <div className="item flex flex-col">
      <figure className="h-[120px] w-[120px] p-[5px] border border-secondary rounded-full">
        <Link
          href={BASE_URL + "our-team/" + urlinfo.url_slug}
          className="image-slot rounded-full overflow-hidden block before:pt-[100%]"
        >
          {avatar && (
            <Image
              src={IMAGE_URL + avatar.full_path}
              alt={avatar.alt_text ? avatar.alt_text : full_name}
              height={500}
              width={500}
            />
          )}
        </Link>
      </figure>

      <figcaption className="pt-4 leading-[1.2]">
        <h3 className="text-[1.125rem] text-headings">
          <Link
            href={BASE_URL + "our-team/" + urlinfo.url_slug}
          >
            {full_name}
          </Link>
        </h3>
        <span className="designation font-medium text-xs pt-0.5 text-muted">{position}</span>
      </figcaption>
    </div>
  );
}