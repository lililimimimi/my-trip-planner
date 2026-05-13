import { useState, useEffect } from "react";
import type { Hotel } from "../types";
import { getPlaceImage } from "../services/unsplash";

interface Props {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: Props) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const query = hotel.name
      ? `${hotel.name} hotel room`
      : `${hotel.area} hotel China`;
    getPlaceImage(query).then((url) => setImage(url));
  }, [hotel.name]);

  return (
    <div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#111",
          marginBottom: "12px",
        }}
      >
        酒店推荐
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* 左图右文 */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* 图片 */}
          <div style={{ width: "140px", flexShrink: 0, overflow: "hidden" }}>
            <img
              src={
                image ||
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80"
              }
              alt={hotel.name || hotel.area}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* 内容 */}
          <div
            style={{
              flex: 1,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: "6px",
                  lineHeight: 1.3,
                }}
              >
                {hotel.name || hotel.area}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#e65100",
                  }}
                >
                  ¥{hotel.estimated_cost}
                  <span
                    style={{ fontSize: "11px", color: "#aaa", fontWeight: 400 }}
                  >
                    /晚
                  </span>
                </div>
                {hotel.rating && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <span style={{ fontSize: "13px" }}>⭐</span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {hotel.rating}
                    </span>
                  </div>
                )}
              </div>
              {hotel.tags && hotel.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                    marginBottom: "8px",
                  }}
                >
                  {hotel.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "#f5f5f5",
                        color: "#555",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {hotel.address && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ fontSize: "12px" }}>📍</span>
                <span
                  style={{ fontSize: "11px", color: "#999", lineHeight: 1.4 }}
                >
                  {hotel.address}
                </span>
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#bbb",
              alignSelf: "center",
              paddingRight: "12px",
            }}
          >
            ›
          </div>
        </div>

        {hotel.reason && (
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #f5f5f5",
              fontSize: "12px",
              color: "#666",
              lineHeight: 1.6,
              background: "#f9f9f7",
            }}
          >
            💡 {hotel.reason}
          </div>
        )}
      </div>
    </div>
  );
}
