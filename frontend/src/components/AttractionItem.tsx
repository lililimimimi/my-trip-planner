import { useState, useEffect } from "react";
import type { Attraction } from "../types";
import { getPlaceImage } from "../services/unsplash";

interface Props {
  attraction: Attraction;
  index: number;
}

export default function AttractionItem({ attraction, index }: Props) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    getPlaceImage(`${attraction.name} China travel`).then((url) =>
      setImage(url)
    );
  }, [attraction.name]);

  return (
    <div style={{
      display: "flex", gap: "12px", alignItems: "flex-start",
      padding: "14px 0", borderBottom: "1px solid #f5f5f5",
    }}>
      {/* 序号 */}
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        background: "#111", color: "#fff", fontSize: "13px",
        fontWeight: 700, display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, marginTop: "2px",
      }}>
        {index + 1}
      </div>

      {/* 内容 */}
      <div style={{ flex: 1 }}>
        {/* 名称 + 标签 */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>
            {attraction.name}
          </span>
          {attraction.ticket_price === 0 ? (
            <span style={{
              fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
              background: "#f0faf0", color: "#2e7d32", fontWeight: 500,
            }}>免费</span>
          ) : (
            <span style={{
              fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
              background: "#fff8e1", color: "#f57f17", fontWeight: 500,
            }}>¥{attraction.ticket_price}</span>
          )}
          {attraction.tag && (
            <span style={{
              fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
              background: "#f0f0f0", color: "#555", fontWeight: 500,
            }}>{attraction.tag}</span>
          )}
        </div>

        {/* 地址 + 导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
            <a
            href={`https://uri.amap.com/marker?position=${attraction.longitude},${attraction.latitude}&name=${encodeURIComponent(attraction.name)}&coordinate=gaode&callnative=1`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "18px", height: "18px", borderRadius: "50%",
              background: "#e8f5e9", color: "#2e7d32",
              textDecoration: "none", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px"
            }}
            title="导航"
          >
            📍
          </a>
          <span style={{ fontSize: "12px", color: "#999" }}>{attraction.address}</span>
        </div>

        {/* 描述 */}
        <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.6", marginBottom: "8px" }}>
          {attraction.description}
        </div>

        {/* 底部信息：游玩时间 + 类型 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "11px", color: "#aaa", display: "flex", alignItems: "center", gap: "4px" }}>
            ⏱ 建议游玩 {Math.floor(attraction.duration / 60) > 0
              ? `${Math.floor(attraction.duration / 60)}-${Math.floor(attraction.duration / 60) + 0.5} 小时`
              : `${attraction.duration} 分钟`}
          </span>
          {attraction.category && (
            <span style={{ fontSize: "11px", color: "#aaa", display: "flex", alignItems: "center", gap: "4px" }}>
              🏛 {attraction.category}
            </span>
          )}
        </div>
      </div>

      {/* 图片 */}
      {image ? (
        <div style={{
          width: "90px", height: "90px", borderRadius: "12px",
          overflow: "hidden", flexShrink: 0,
        }}>
          <img src={image} alt={attraction.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ) : (
        <div style={{
          width: "90px", height: "90px", borderRadius: "12px",
          background: "#f5f5f5", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px",
        }}>
          🏛
        </div>
      )}
    </div>
  );
}