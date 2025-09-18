"use client";
import dynamic from "next/dynamic";
import React from "react";

const RouteMapComponent = dynamic(() => import("./RouteMapComponent"), {
    ssr: false,
    loading: () => <div className="h-[500px]">Loading map...</div>,
});

type Props = {
    itinerarys?: any;
    className?: string;
};

export default function RouteMapWrapper({ itinerarys, className }: Props) {
    return <RouteMapComponent itinerarys={itinerarys} className={className} />;
}
