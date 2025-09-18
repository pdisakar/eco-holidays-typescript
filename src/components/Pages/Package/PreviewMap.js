"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function calculatePolylineBounds(coordinates) {
  const bounds = coordinates.reduce(
    ([minLat, maxLat, minLng, maxLng], [lat, lng]) => [
      Math.min(minLat, lat),
      Math.max(maxLat, lat),
      Math.min(minLng, lng),
      Math.max(maxLng, lng),
    ],
    [Infinity, -Infinity, Infinity, -Infinity]
  );
  return [
    [bounds[0], bounds[2]],
    [bounds[1], bounds[3]],
  ];
}

const transformData = (data) => {
  const destinationMap = new Map();
  data.forEach(({ properties: { destination, day } }) => {
    const days = destinationMap.get(destination) || [];
    if (!days.includes(day)) days.push(day);
    destinationMap.set(destination, days);
  });

  return data.map((item) => ({
    ...item,
    properties: {
      ...item.properties,
      day: destinationMap.get(item.properties.destination).join(", "),
    },
  }));
};

const PreviewMap = ({ polylineCoordinates, mapPosition, geojsonData }) => {
  const mapRef = useRef(null);
  const [dotPosition, setDotPosition] = useState(0);

  const transformedData = useMemo(
    () => transformData(geojsonData.features),
    [geojsonData]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotPosition(
        (prev) =>
          (prev + Math.ceil(Math.sqrt(polylineCoordinates.length))) %
          polylineCoordinates.length
      );
    }, 7500 / Math.ceil(Math.sqrt(polylineCoordinates.length)));
    return () => clearInterval(intervalId);
  }, [polylineCoordinates.length]);

  useEffect(() => {
    if (polylineCoordinates.length && mapRef.current) {
      mapRef.current.fitBounds(calculatePolylineBounds(polylineCoordinates));
    }
  }, [polylineCoordinates]);

  const svgUrl = useMemo(() => {
    const svgString = `
      <svg width="3.75" height="3.75" xmlns="http://www.w3.org/2000/svg">
        <circle cx="1.875" cy="1.875" r="1.5" stroke="#1990a8" stroke-width="0.6" fill="white" />
      </svg>`;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  }, []);

  const customIcon = useMemo(
    () =>
      L.icon({
        iconUrl: svgUrl,
        iconSize: [15, 15],
        iconAnchor: [7.5, 15],
        popupAnchor: [0, -15],
      }),
    [svgUrl]
  );

  return (
    <MapContainer
      ref={mapRef}
      center={mapRef.current?._lastCenter || mapPosition}
      zoom={15}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={polylineCoordinates} color="#1990a8" weight={2.5} />
      {polylineCoordinates[dotPosition] && (
        <CircleMarker
          center={polylineCoordinates[dotPosition]}
          radius={4}
          fillColor="red"
          fillOpacity={1}
          color="#ffffff"
        />
      )}
      {transformedData.map((feature, index) => {
        const [lng, lat] = feature.geometry.coordinates;
        return (
          <Marker key={index} position={[lat, lng]} icon={customIcon}>
            <Popup>
              <div>
                <strong>Day {feature.properties.day}</strong>
                <br />
                {feature.properties.destination}
                {feature.properties.destination_elevation &&
                  ` (${feature.properties.destination_elevation} m)`}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default PreviewMap;
