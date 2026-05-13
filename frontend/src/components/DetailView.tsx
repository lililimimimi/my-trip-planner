import type { TripPlan } from "../types";
import AttractionItem from "./AttractionItem";
import DayOverview from "./DayOverview";
import MealList from "./MealList";
import HotelCard from "./HotelCard";
import MapPreview from "./MapPreview";
import LocalFoodList from "./LocalFoodList";

interface Props {
  plan: TripPlan;
  dayNumber: number;
  onBack: () => void;
  onNextDay: (day: number) => void;
}

export default function DetailView({
  plan,
  dayNumber,
  onBack,
  onNextDay,
}: Props) {
  const day = plan.days.find((d) => d.day === dayNumber);
  if (!day) return null;
  const isLastDay = dayNumber === plan.days.length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 顶部导航 */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "13px",
            color: "#666",
            fontWeight: 500,
            padding: 0,
          }}
        >
          ← 返回行程
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#f5f5f5",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            color: "#555",
            fontWeight: 500,
          }}
        >
          🗺 {day.attractions.length} Stops
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* 大标题 */}
        <div style={{ padding: "20px 24px 16px" }}>
          <div
            style={{
              fontSize: "13px",
              color: "#aaa",
              marginBottom: "4px",
              fontWeight: 500,
            }}
          >
            Day {day.day} · {day.date}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-0.5px",
              marginBottom: "12px",
              lineHeight: 1.2,
            }}
          >
            {day.theme}
          </div>
          {day.warnings && day.warnings.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {day.warnings.map((w, i) => (
                <div
                  key={i}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    background: "#fff8e1",
                    border: "1px solid #ffe082",
                    fontSize: "12px",
                    color: "#f57f17",
                    fontWeight: 500,
                  }}
                >
                  ⚠️ {w}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 今日概览 */}
        <div style={{ padding: "0 24px 16px" }}>
          <DayOverview day={day} />
        </div>

        {/* 两列布局 */}
        <div
          style={{
            padding: "0 24px 16px",
            display: "flex",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* 左列：今日安排 + 美食推荐 + 酒店推荐 */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: "12px",
                }}
              >
                今日安排
              </div>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #f0f0f0",
                  borderRadius: "16px",
                  padding: "4px 16px",
                }}
              >
                {day.attractions.map((attr, i) => (
                  <AttractionItem key={i} attraction={attr} index={i} />
                ))}
              </div>
            </div>
            <MealList meals={day.meals} />
            {day.hotel && <HotelCard hotel={day.hotel} />}
          </div>

          {/* 右列：当地小吃，高度跟左列一样 */}
          {plan.local_foods && plan.local_foods.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <LocalFoodList foods={plan.local_foods} city={plan.city} />
            </div>
          )}
        </div>

        {/* 地图预览，横跨全宽 */}
        <div style={{ padding: "0 24px 24px" }}>
          <MapPreview day={day} />
        </div>
      </div>

      {/* 底部按钮 */}
      <div
        style={{
          padding: "12px 24px 20px",
          borderTop: "1px solid #f0f0f0",
          background: "#fff",
          position: "sticky",
          bottom: 0,
        }}
      >
        {!isLastDay && (
          <button
            onClick={() => onNextDay(dayNumber + 1)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "20px",
              border: "none",
              background: "#111",
              fontSize: "14px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            继续 Day {dayNumber + 1} →
          </button>
        )}
      </div>
    </div>
  );
}
