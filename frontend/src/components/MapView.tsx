import { useEffect, useRef } from "react";
import type { TripPlan } from "../types";

interface Props {
  plan: TripPlan | null;
}

export default function MapView({ plan }: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plan) return;

    const loadMap = async () => {
      const AMapLoader = (await import("@amap/amap-jsapi-loader")).default;
      const AMap = await AMapLoader.load({
        key: import.meta.env.VITE_AMAP_WEB_JS_KEY,
        version: "2.0",
        plugins: ["AMap.Marker", "AMap.InfoWindow"],
      });

      if (mapRef.current) {
        mapRef.current.destroy();
      }

      const map = new AMap.Map(containerRef.current, {
        zoom: 12,
        center: [
          plan.days[0].attractions[0]?.longitude || 116.4,
          plan.days[0].attractions[0]?.latitude || 39.9,
        ],
      });

      mapRef.current = map;

      const colors = ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1"];

      plan.days.forEach((day, dayIndex) => {
        const color = colors[dayIndex % colors.length];

        // 景点标记
        day.attractions.forEach((attr, i) => {
          if (!attr.longitude || !attr.latitude) return;

          const marker = new AMap.Marker({
            position: [attr.longitude, attr.latitude],
            title: attr.name,
            label: {
              content: `<div style="background:${color};color:#fff;padding:3px 8px;border-radius:4px;font-size:12px;white-space:nowrap">第${day.day}天 ${attr.name}</div>`,
              offset: new AMap.Pixel(0, -35),
            },
          });

          const infoWindow = new AMap.InfoWindow({
            content: `
              <div style="padding:10px;min-width:200px">
                <div style="font-weight:500;font-size:14px;margin-bottom:6px">${attr.name}</div>
                <div style="font-size:12px;color:#666;margin-bottom:4px">${attr.address}</div>
                <div style="font-size:12px;color:#333">${attr.description}</div>
                <div style="font-size:12px;color:#999;margin-top:4px">游览约${attr.duration}分钟</div>
              </div>
            `,
            offset: new AMap.Pixel(0, -35),
          });

          marker.on("click", () => infoWindow.open(map, marker.getPosition()));
          marker.setMap(map);
        });

        // 餐厅标记
        day.meals.forEach((meal) => {
          if (!meal.longitude || !meal.latitude) return;

          const marker = new AMap.Marker({
            position: [meal.longitude, meal.latitude],
            title: meal.name,
            label: {
              content: `<div style="background:#ff4d4f;color:#fff;padding:3px 8px;border-radius:4px;font-size:12px;white-space:nowrap">🍜 ${meal.name}</div>`,
              offset: new AMap.Pixel(0, -35),
            },
          });

          const infoWindow = new AMap.InfoWindow({
            content: `
              <div style="padding:10px;min-width:200px">
                <div style="font-weight:500;font-size:14px;margin-bottom:6px">${meal.name}</div>
                <div style="font-size:12px;color:#666;margin-bottom:4px">${meal.address}</div>
                <div style="font-size:12px;color:#333">${meal.description}</div>
                <div style="font-size:12px;color:#fa8c16;margin-top:4px">人均约¥${meal.cost}</div>
              </div>
            `,
            offset: new AMap.Pixel(0, -35),
          });

          marker.on("click", () => infoWindow.open(map, marker.getPosition()));
          marker.setMap(map);
        });
      });
    };

    loadMap().catch(console.error);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [plan]);

  if (!plan)
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "14px",
        }}
      >
        生成行程后地图会显示景点位置
      </div>
    );

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
