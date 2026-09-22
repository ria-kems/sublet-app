"use client";

import { Layer, Source } from "react-map-gl/mapbox";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type NeighborhoodMapProps = {
  latitude: number;
  longitude: number;
  token: string;
};

const CIRCLE_RADIUS_METERS = 400;

function circleGeoJson(latitude: number, longitude: number) {
  const points = 64;
  const coordinates: [number, number][] = [];

  for (let index = 0; index < points; index += 1) {
    const angle = (index / points) * 2 * Math.PI;
    const dx = (CIRCLE_RADIUS_METERS / 111320) * Math.cos(angle);
    const dy =
      (CIRCLE_RADIUS_METERS / (111320 * Math.cos((latitude * Math.PI) / 180))) *
      Math.sin(angle);
    coordinates.push([longitude + dy, latitude + dx]);
  }

  coordinates.push(coordinates[0]!);

  return {
    type: "Feature" as const,
    geometry: {
      type: "Polygon" as const,
      coordinates: [coordinates],
    },
    properties: {},
  };
}

export function NeighborhoodMap({
  latitude,
  longitude,
  token,
}: NeighborhoodMapProps) {
  const circle = circleGeoJson(latitude, longitude);

  return (
    <div className="h-72 w-full overflow-hidden rounded-box border border-base-300">
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          latitude,
          longitude,
          zoom: 13,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        attributionControl
        scrollZoom={false}
      >
        <Source id="neighborhood-area" type="geojson" data={circle}>
          <Layer
            id="neighborhood-fill"
            type="fill"
            paint={{
              "fill-color": "#2563eb",
              "fill-opacity": 0.15,
            }}
          />
          <Layer
            id="neighborhood-outline"
            type="line"
            paint={{
              "line-color": "#2563eb",
              "line-width": 2,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
