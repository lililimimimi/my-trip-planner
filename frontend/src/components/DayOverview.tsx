import type { DayPlan } from "../types";

interface Props {
  day: DayPlan;
}

export default function DayOverview({ day }: Props) {
  return (
    <div
      style={{
        background: "#f9f9f7",
        borderRadius: "16px",
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#aaa",
          marginBottom: "12px",
          letterSpacing: "0.5px",
        }}
      >
        今日概览
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        {day.attractions.map((attr, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                background: "#fff",
                border: "1px solid #eee",
                color: "#333",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              📍 {attr.name}
            </div>
            {i < day.attractions.length - 1 && (
              <span style={{ color: "#ccc", fontSize: "12px" }}>→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
