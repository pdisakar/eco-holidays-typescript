"use client";

import { BASE_URL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Avatar from "@/assets/images/avatar.jpg";

interface InfoProps {
  phone: string;
  email: string;
  avatar?: string;
  avatarAlt: string;
  taLink: string;
}

export default function Info({
  phone,
  email,
  avatar,
  avatarAlt,
  taLink,
}: InfoProps) {
  return (
    <div className="info font-secondary">
      <ul>
        {/* WhatsApp / Phone */}
        <li className="phone">
          <Link
            href={`https://api.whatsapp.com/send?phone=977${phone}`}
            className="item"
          >
            <i className="icon">
              {/* If you want dynamic avatar from server */}
              {/* avatar && (
                <Image
                  src={`${IMAGE_URL}${avatar}`}
                  height={40}
                  width={42}
                  alt={avatarAlt}
                />
              ) */}
              <Image src={Avatar} height={56} width={56} alt={avatarAlt} />
            </i>
            <div className="text">
              <span className="text-small">Whatsapp, Viber <svg height={13} width={13} className="inline-block text-primary -mt-0.5"><use xlinkHref="./icons.svg#whatsapp" /></svg></span>
              <span className="text-big">977 {phone}</span>
            </div>
          </Link>
        </li>

        {/* Email */}
        <li className="email">
          <Link href={`mailto:${email}`} className="item">
            <i className="icon text-primary">
              <svg height={30} width={30}>
                <use xlinkHref="./icons.svg#envelope-open" />
              </svg>
            </i>
            <div className="text">
              <span className="text-small">Quick Questions?</span>
              <span className="text-big">Email Us</span>
            </div>
          </Link>
        </li>

        {/* Tripadvisor */}
        <li className="ta">
          <Link
            href={taLink}
            target="_blank"
            rel="nofollow noreferrer"
            className="item"
          >
            <i className="icon">
              <svg>
                <use xlinkHref={`${BASE_URL}icons.svg#tripadvisor_icon`} />
              </svg>
            </i>
            <div className="text">
              <span className="text-small">Certificate of</span>
              <span className="text-big">
                Excellence {new Date(
                  new Date().setMonth(new Date().getMonth() - 6)
                ).getFullYear()}
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
