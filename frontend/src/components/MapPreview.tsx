import { useEffect, useRef } from "react";
import type { DayPlan } from "../types";

interface Props {
  day: DayPlan;
}

export default function MapPreview({ day }: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = async () => {
      const AMapLoader = (await import("@amap/amap-jsapi-loader")).default;
      const AMap = await AMapLoader.load({
        key: import.meta.env.VITE_AMAP_WEB_JS_KEY,
        version: "2.0",
        plugins: ["AMap.Marker", "AMap.InfoWindow"],
      });

      if (mapRef.current) mapRef.current.destroy();

      const map = new AMap.Map(containerRef.current, { zoom: 12 });
      mapRef.current = map;
      const allMarkers: any[] = [];

      day.attractions.forEach((attr, i) => {
        if (!attr.longitude || !attr.latitude) return;
        const marker = new AMap.Marker({
          position: [attr.longitude, attr.latitude],
          title: attr.name,
          label: {
            content: `<div style="background:#111;color:#fff;padding:3px 8px;border-radius:20px;font-size:12px;white-space:nowrap">${i + 1} ${attr.name}</div>`,
            offset: new AMap.Pixel(0, -35),
          },
        });
        const infoWindow = new AMap.InfoWindow({
          content: `<div style="padding:10px;min-width:160px">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px">${attr.name}</div>
            <div style="font-size:12px;color:#666">${attr.address}</div>
            <div style="font-size:12px;color:#999;margin-top:4px">⏱ ${attr.duration}分钟</div>
          </div>`,
          offset: new AMap.Pixel(0, -35),
        });
        marker.on("click", () => infoWindow.open(map, marker.getPosition()));
        marker.setMap(map);
        allMarkers.push(marker);
      });

      day.meals.forEach((meal) => {
        if (!meal.longitude || !meal.latitude) return;
        const marker = new AMap.Marker({
          position: [meal.longitude, meal.latitude],
          title: meal.name,
          label: {
            content: `<div style="background:#e65100;color:#fff;padding:3px 8px;border-radius:20px;font-size:12px;white-space:nowrap">🍜 ${meal.name}</div>`,
            offset: new AMap.Pixel(0, -35),
          },
        });
        marker.setMap(map);
        allMarkers.push(marker);
      });

      if (allMarkers.length > 0) map.setFitView(allMarkers);
    };

    loadMap().catch(console.error);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [day.day]);

  return (
    <div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#111",
          marginBottom: "10px",
        }}
      >
        地图预览
      </div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "200px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
