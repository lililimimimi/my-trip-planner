import type { LocalFood } from "../types";

interface Props {
  foods: LocalFood[];
  city: string;
}

export default function LocalFoodList({ foods, city }: Props) {
  if (!foods || foods.length === 0) return null;

  return (
    <div>
      {/* 标题区 */}
      <div
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#111",
          marginBottom: "4px",
        }}
      >
        必吃美食
      </div>
      <div style={{ fontSize: "13px", color: "#999", marginBottom: "16px" }}>
        {city}经典小吃与本帮菜推荐
      </div>

      {/* 列表 */}
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
              padding: "14px 16px",
              borderBottom: i < foods.length - 1 ? "1px solid #f5f5f5" : "none",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {/* 左侧：名称 + 描述 */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#111",
                  marginBottom: "4px",
                }}
              >
                {food.name}
              </div>
              <div style={{ fontSize: "12px", color: "#999", lineHeight: 1.5 }}>
                {food.description}
              </div>
            </div>

            {/* 右侧：胶囊价格标签 */}
            <div
              style={{
                flexShrink: 0,
                background: "#fff5f0",
                border: "1px solid #ffd8c2",
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "12px",
                color: "#e65100",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {food.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
