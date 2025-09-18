"use client"

import { useGlobalData } from "@/context/globalContext"
import { cn } from "@/lib/utils"

export default function FancyReview ({className}){
    const {globalData} = useGlobalData()
    return (
        <div className={cn('fancy-review', className)}>
        <ul className="flex items-center flex-wrap gap-6">
          <li>
            <a
              href={globalData.trip_advisor}
              target="_blank"
              rel="nofollow"
              className="item relative block pl-10"
            >
              <i className="icon h-8 w-8 absolute left-0 top-0">
                <svg>
                  <use xlinkHref="/icons.svg#tripadvisor_icon"></use>
                </svg>
              </i>
              <span className="text-base leading-[1] block font-bold text-headings">
                Tripadvisor
              </span>
              <b className="text-sm mr-1.5 font-bold">4.8</b>
              <span className="rating [&>i]:inline-block [&>i]:rounded-full [&>i]:h-2.5 [&>i]:w-2.5 [&>i]:bg-[#37AA6C] [&>i+i]:ml-0.5">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </span>
            </a>
          </li>
          <li>
            <a
              href={globalData.google}
              target="_blank"
              rel="nofollow"
              className="item relative block pl-10"
            >
              <i className="icon h-8 w-8 absolute left-0 top-0">
                <svg>
                  <use xlinkHref="/icons.svg#google"></use>
                </svg>
              </i>
              <span className="text-base font-bold block leading-[1.1] text-headings">Google</span>
              <span className="flex items-center">
                <b className="text-sm mr-1.5">4.7</b>
                <i className="ratings__5 align-middle inline-flex items-center"></i>
              </span>
            </a>
          </li>
        </ul>
        
      </div>
    )
}