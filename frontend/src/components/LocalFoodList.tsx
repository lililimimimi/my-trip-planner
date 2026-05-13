import type { LocalFood } from "../types";

interface Props {
  foods: LocalFood[];
  city: string;
}

export default function LocalFoodList({ foods, city }: Props) {
  if (!foods || foods.length === 0) return null;

  return (
    <div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#111",
          marginBottom: "4px",
        }}
      >
        {city}必吃小吃
      </div>
      <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px" }}>
        来了就不能错过这些
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {foods.map((food, i) => (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              borderBottom: i < foods.length - 1 ? "1px solid #f5f5f5" : "none",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* emoji */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "#f9f9f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                flexShrink: 0,
              }}
            >
              {food.emoji}
            </div>

            {/* 内容 */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <span
                  style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}
                >
                  {food.name}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#e65100",
                    fontWeight: 600,
                  }}
                >
                  {food.price}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5 }}>
                {food.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
