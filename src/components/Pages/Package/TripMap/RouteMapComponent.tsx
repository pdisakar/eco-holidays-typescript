"use client";
import { useEffect, useMemo, useRef } from "react";
import L, { LatLng } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  LayersControl,
  CircleMarker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

const { BaseLayer } = LayersControl;

type ItineraryItem = {
  id: number;
  origin: string;
  origin_coordinate: string;
  origin_elevation: string;
  destination: string;
  destination_coordinate: string;
  destination_elevation: string;
  distance?: string;
  travel_mode: string;
  itinerary_day: number;
};

type Props = {
  itinerarys: { details: ItineraryItem[] };
  className?: string;
};

function parseLatLng(coord: string) {
  const [lat, lng] = coord.split(",").map(Number);
  return { lat, lng };
}

const getIconByMode = (mode: string) => {
  const iconUrlMap: Record<string, string> = {
    car: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="101.47 32.31 309.06 446.6"><path fill="#e74c3c" d="M256 32.31c85.36 0 154.53 69.2 154.53 154.53 0 64-114.82 220.49-154.53 292.07-38.07-68.7-154.53-231.83-154.53-292.07 0-85.33 69.2-154.53 154.53-154.53zm69.07 148.71c0-38.03-31.02-69.05-69.07-69.05-38.02 0-69.04 31.02-69.04 69.05 0 38.02 31.02 69.04 69.04 69.04 38.05 0 69.07-31.02 69.07-69.04z"/></svg>')}`,
    air: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="101.47 32.31 309.06 446.6"><path fill="#e74c3c" d="M256 32.31c85.36 0 154.53 69.2 154.53 154.53 0 64-114.82 220.49-154.53 292.07-38.07-68.7-154.53-231.83-154.53-292.07 0-85.33 69.2-154.53 154.53-154.53zm69.07 148.71c0-38.03-31.02-69.05-69.07-69.05-38.02 0-69.04 31.02-69.04 69.05 0 38.02 31.02 69.04 69.04 69.04 38.05 0 69.07-31.02 69.07-69.04z"/></svg>')}`,
    foot: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="101.47 32.31 309.06 446.6"><path fill="#e74c3c" d="M256 32.31c85.36 0 154.53 69.2 154.53 154.53 0 64-114.82 220.49-154.53 292.07-38.07-68.7-154.53-231.83-154.53-292.07 0-85.33 69.2-154.53 154.53-154.53zm69.07 148.71c0-38.03-31.02-69.05-69.07-69.05-38.02 0-69.04 31.02-69.04 69.05 0 38.02 31.02 69.04 69.04 69.04 38.05 0 69.07-31.02 69.07-69.04z"/></svg>')}`,
  };

  return new L.Icon({
    iconUrl: iconUrlMap[mode] || "/icons/default.png",
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
    shadowSize: [31, 31],
  });
};

const travelColors: Record<string, string> = {
  air: "#008f3c",
  car: "#008f3c",
  foot: "#008f3c",
};

function FitBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [bounds, map]);
  return null;
}

function AnimatedCircle({ path }: { path: LatLng[] }) {
  const markerRef = useRef<L.CircleMarker>(null);
  const requestRef = useRef<number>();
  const progressRef = useRef(0);

  useEffect(() => {
    if (path.length < 2) return;

    const animate = () => {
      const total = path.length;
      const progress = progressRef.current;
      const i = Math.floor(progress);
      const frac = progress % 1;

      const current = path[i];
      const next = path[(i + 1) % total];

      const lat = current.lat + (next.lat - current.lat) * frac;
      const lng = current.lng + (next.lng - current.lng) * frac;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }

      progressRef.current += 0.02;
      if (progressRef.current >= total - 1) progressRef.current = 0;

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [path]);

  return (
    <CircleMarker
      center={path[0]}
      radius={5}
      fillColor="red"
      fillOpacity={1}
      color="white"
      weight={2}
      ref={markerRef}
    />
  );
}

export default function RouteMapComponent({ itinerarys, className }: Props) {
  const boundsRef = useRef<L.LatLngBounds | null>(null);

  // Group by destination
  const groupedByDestination = useMemo(() => {
    return itinerarys.details.reduce((acc, item) => {
      if (!acc[item.destination]) acc[item.destination] = [];
      acc[item.destination].push(item);
      return acc;
    }, {} as Record<string, ItineraryItem[]>);
  }, [itinerarys]);

  const bounds = useMemo(() => {
    const coords: L.LatLngExpression[] = [];
    itinerarys.details.forEach((item) => {
      coords.push(
        [parseLatLng(item.origin_coordinate).lat, parseLatLng(item.origin_coordinate).lng],
        [parseLatLng(item.destination_coordinate).lat, parseLatLng(item.destination_coordinate).lng]
      );
    });
    const computed = L.latLngBounds(coords);
    boundsRef.current = computed;
    return computed;
  }, [itinerarys]);

  const flattenedPath: LatLng[] = useMemo(() => {
    const points: LatLng[] = [];
    itinerarys.details.forEach((item) => {
      const origin = parseLatLng(item.origin_coordinate);
      const dest = parseLatLng(item.destination_coordinate);
      points.push(new L.LatLng(origin.lat, origin.lng));
      points.push(new L.LatLng(dest.lat, dest.lng));
    });
    return points;
  }, [itinerarys]);

  if (!itinerarys?.details?.length) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center rounded-lg border shadow-md mb-8">
        <p>No itinerary data available.</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full h-[500px] relative z-0 rounded-lg overflow-hidden shadow border', className)}>
      <MapContainer
        center={[27.7, 85.3]}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        bounds={boundsRef.current ?? undefined}
      >
        <FitBounds bounds={bounds} />

        <LayersControl position="topright">
          <BaseLayer checked name="Map View">
            <TileLayer
              url={`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=BaW6L3rgPE6w4XoiUN28`}
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
            />
          </BaseLayer>
          <BaseLayer name="Satellite View">
            <TileLayer
              url="https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.png?key=BaW6L3rgPE6w4XoiUN28"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics'
            />
          </BaseLayer>
        </LayersControl>

        {/* Markers grouped by destination */}
        {Object.values(groupedByDestination).map((group, groupIndex) => {
          const days = group.map((it) => it.itinerary_day).sort((a, b) => a - b);
          const item = group[0];
          const dest = parseLatLng(item.destination_coordinate);

          return (
            <Marker
              key={`${item.destination}-${groupIndex}`}
              position={[dest.lat, dest.lng]}
              icon={getIconByMode(item.travel_mode)}
            >
              <Popup>
                <strong>
                  Day {days.join(", ")}: {item.destination}
                </strong>
                <br />
                Elevation: {item.destination_elevation}
                {item.distance && item.distance !== "undefined" && (
                  <>
                    <br />
                    Distance: {item.distance}
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}

        {/* Polylines per item (keep routes intact) */}
        {itinerarys.details.map((item) => {
          const origin = parseLatLng(item.origin_coordinate);
          const dest = parseLatLng(item.destination_coordinate);
          const line: L.LatLngExpression[] = [
            [origin.lat, origin.lng],
            [dest.lat, dest.lng],
          ];

          return (
            <Polyline
              key={item.id}
              positions={line}
              color={travelColors[item.travel_mode] || "gray"}
              weight={item.travel_mode === "car" ? 5 : item.travel_mode === "foot" ? 2 : 2}
              dashArray={
                item.travel_mode === "air"
                  ? "5 10"
                  : item.travel_mode === "foot"
                  ? "0 0"
                  : undefined
              }
              lineCap="round"
              lineJoin="round"
              opacity={0.8}
            />
          );
        })}

        <AnimatedCircle path={flattenedPath} />
      </MapContainer>
    </div>
  );
}
