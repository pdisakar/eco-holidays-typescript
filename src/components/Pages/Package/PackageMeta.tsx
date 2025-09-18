"use client";
import { useGlobalData } from "@/context/globalContext"
import { BadgeCheck, Heart } from "lucide-react";
import Link from "next/link";

export default function PackageMeta() {
    const { globalData } = useGlobalData()
    return (
        <ul className="package-meta leading-[1] text-xs text-headings font-normal pt-1 flex items-center gap-x-3">
            <li className="flex items-center gap-x-1">
                <i className="ratings__5 mr-1"></i>
                <Link
                    href="#reviews"
                    className="text-primary inline-block font-medium underline"
                >
                    {globalData.tripadvisor_review_count + " reviews"}
                </Link>
                on TripAdvisor
            </li>
            {/* <li className="flex items-center gap-x-1">
               <Heart height={20} width={20} fill="#dc3545" stroke="#dc3545" /> Recommended by 99% of travelers
            </li> */}
        </ul>
    )
}