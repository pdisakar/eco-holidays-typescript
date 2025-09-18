"use client";
import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  LabelProps,
  Line,
} from "recharts";

type DataPoint = {
  day: string;
  altitude: number;
  destination: string;
};

export default function AltitudeGraph({
  renderData,
  duration_type,
}: {
  renderData: any;
  duration_type: string;
}) {
  const altitudeData: DataPoint[] = useMemo(() => {
    const sortedData = renderData?.details?.sort(
      (a: any, b: any) =>
        parseInt(a.itinerary_day) - parseInt(b.itinerary_day)
    );
    console.log(sortedData);
    
    return (
      sortedData?.map((item: any) => ({
        day: `Day ${item.itinerary_day}`,
        elevationM: parseInt(item.destination_elevation),
        destination: item.destination,
      })) || []
    );
  }, [renderData]);

  const [unit, setUnit] = useState<"m" | "ft">("m");

  const convertAltitude = (alt: number) =>
    unit === "ft" ? +(alt * 3.28084).toFixed(0) : alt;

  const data = altitudeData.map((d) => ({
    ...d,
    altitude: convertAltitude(d.elevationM),
  }));

  const CustomLabel = ({ x, y, value, index }: LabelProps) => {
    const item = data[index];
    return (
      <text
        x={x}
        y={y ? y - 24 : y}
        textAnchor="left"
        fill="#666666"
        fontSize="10"
        fontWeight="500"
      >
        <tspan x={x-10} dy="0">{item.destination}</tspan>
        <tspan x={x-10} dy="12">{value}{unit}</tspan>
      </text>
    );
  };

  return (
    <div className="border p-6 mb-10 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-medium">Altitude Chart</h2>
        <div className="text-xs tracking-wide font-semibold">
          <span className="text-muted/50 font-medium text-xxs mr-2.5">Altitude in:</span>
          <button
            onClick={() => setUnit("m")}
            className={`mr-1.5 ${unit === "m" ? "underline" : "text-gray-500"}`}
          >
            Meter
          </button>|
          <button
            onClick={() => setUnit("ft")}
            className={`ml-1.5 ${unit === "ft" ? "underline" : "text-gray-500"}`}
          >
            Feet
          </button>
        </div>
      </div>

      <div className="w-full h-[400px] custom-scroll-bar horizontal overflow-x-auto">
        <ResponsiveContainer width="100%" minWidth={'1280px'} height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 45, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="altitudeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#004956" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#004956" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
            <XAxis dataKey="day" fill="#000" tick={{ fontSize: 12, fontWeight:'600' }} />

            <Area
              type="monotone"
              dataKey="altitude"
              stroke="#004956"
              fill="url(#altitudeFill)"
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            >
              <LabelList content={CustomLabel} />
            </Area>
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
