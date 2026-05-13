import type { TripPlan } from "../types";

interface Props {
  plan: TripPlan;
  onDayClick: (day: number) => void;
}

export default function ListView({ plan, onDayClick }: Props) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 顶部标题 */}
      <div
        style={{
          padding: "20px 24px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.5px",
          }}
        >
          Itinerary
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#f5f5f5",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            color: "#555",
            fontWeight: 500,
          }}
        >
          🗺 {plan.days.reduce((acc, d) => acc + d.attractions.length, 0)}{" "}
          Places
        </div>
      </div>

      {/* 行程列表 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {plan.days.map((day, index) => (
          <div
            key={day.day}
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              marginBottom: "16px",
              cursor: "pointer",
            }}
            onClick={() => onDayClick(day.day)}
          >
            {/* 左侧序号+时间轴 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "4px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#111",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {day.day}
              </div>
              {index < plan.days.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    minHeight: "40px",
                    background: "#eee",
                    marginTop: "6px",
                  }}
                />
              )}
            </div>

            {/* 卡片 */}
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                overflow: "hidden",
                display: "flex",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* 卡片内容 */}
              <div style={{ flex: 1, padding: "14px 16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#aaa",
                    marginBottom: "4px",
                    fontWeight: 500,
                  }}
                >
                  Day {day.day} · {day.date}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#111",
                    letterSpacing: "-0.3px",
                    marginBottom: "6px",
                    lineHeight: 1.3,
                  }}
                >
                  {day.theme}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    marginBottom: "10px",
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {day.attractions.map((a) => a.name).join("、")}
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {day.tags?.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "#f5f5f5",
                        color: "#555",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {day.attractions.some((a) => a.ticket_price === 0) && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "#f0faf0",
                        color: "#2e7d32",
                        fontWeight: 500,
                      }}
                    >
                      免费
                    </span>
                  )}
                </div>
              </div>

              {/* 右侧 Day 数字 */}
              <div
                style={{
                  width: "80px",
                  flexShrink: 0,
                  background: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    fontWeight: 500,
                    marginBottom: "2px",
                  }}
                >
                  DAY
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {day.day}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div
        style={{
          padding: "12px 24px 20px",
          borderTop: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <button
          onClick={() => onDayClick(1)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "20px",
            border: "none",
            background: "#111",
            fontSize: "15px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
            letterSpacing: "-0.3px",
          }}
        >
          开始我的旅行 ✦
        </button>
      </div>
    </div>
  );
}
