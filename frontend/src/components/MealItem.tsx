import type { Meal } from "../types";

interface Props {
  meal: Meal;
}

const MEAL_CONFIG = {
  breakfast: { label: "早餐", bg: "#e3f2fd", color: "#1565c0", emoji: "🌅" },
  lunch: { label: "午餐", bg: "#f1f8e9", color: "#2e7d32", emoji: "☀️" },
  dinner: { label: "晚餐", bg: "#fce4ec", color: "#c2185b", emoji: "🌙" },
};

export default function MealItem({ meal }: Props) {
  const config = MEAL_CONFIG[meal.type] || MEAL_CONFIG.lunch;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "12px 0",
        borderBottom: "1px solid #f5f5f5",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        {/* emoji */}
        <div style={{ fontSize: "22px", lineHeight: 1 }}>{config.emoji}</div>
        <div>
          {/* 类型标签 */}
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "20px",
              background: config.bg,
              color: config.color,
              fontWeight: 600,
              marginBottom: "4px",
              display: "inline-block",
            }}
          >
            {config.label}
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#111",
              marginBottom: "3px",
            }}
          >
            {meal.name}
          </div>
          {meal.address && (
            <div
              style={{ fontSize: "12px", color: "#999", marginBottom: "3px" }}
            >
              {meal.address}
            </div>
          )}
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.5" }}>
            {meal.description}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#e65100",
          whiteSpace: "nowrap",
          marginLeft: "12px",
        }}
      >
        ¥{meal.cost}
      </div>
    </div>
  );
}
