import { useState, useEffect } from "react";
import type { Meal } from "../types";
import { getPlaceImage } from "../services/unsplash";

interface Props {
  meals: Meal[];
}

function MealItem({ meal }: { meal: Meal }) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const searchQuery = meal.description
      ? `${meal.description.split("，")[0]} Chinese food`
      : `Chinese restaurant food`;
    getPlaceImage(searchQuery).then((url) => setImage(url));
  }, [meal.name]);

  

  return (
    <div
      style={{
        flex: 1,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #f0f0f0",
        background: "#fff",
      }}
    >
      {/* 图片 */}
      <div style={{ width: "100%", height: "120px", overflow: "hidden" }}>
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80"
          }
          alt={meal.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 文字 */}
      <div style={{ padding: "10px 12px" }}>
        
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#111",
            marginBottom: "4px",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {meal.name}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#e65100",
            marginBottom: "6px",
          }}
        >
          ¥{meal.cost}
          <span style={{ fontSize: "11px", color: "#aaa", fontWeight: 400 }}>
            /人
          </span>
        </div>
        {meal.address && (
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "3px" }}
          >
            <span style={{ fontSize: "11px", flexShrink: 0 }}>📍</span>
            <span
              style={{
                fontSize: "11px",
                color: "#999",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }}
            >
              {meal.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MealList({ meals }: Props) {
  if (!meals || meals.length === 0) return null;

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
        美食推荐
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        {meals.map((meal, i) => (
          <MealItem key={i} meal={meal} />
        ))}
      </div>
    </div>
  );
}
