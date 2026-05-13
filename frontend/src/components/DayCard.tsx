import type { DayPlan } from "../types";
import AttractionItem from "./AttractionItem";
import MealItem from "./MealItem";
import { useState } from "react";

interface Props {
  day: DayPlan;
  isActive: boolean;
  onClick: () => void;
}

export default function DayCard({ day, isActive, onClick }: Props) {
  return (
    <div style={{ marginBottom: "12px" }}>
      {/* 折叠标题 */}
      <div
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: isActive ? "16px 16px 0 0" : "16px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {/* 序号 */}
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

        {/* 标题信息 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#111",
              letterSpacing: "-0.3px",
            }}
          >
            {day.theme}
          </div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
            {day.date} · {day.attractions.length}个景点 · {day.meals.length}餐
          </div>
        </div>

        {/* 展开箭头 */}
        <div
          style={{
            fontSize: "12px",
            color: "#bbb",
            transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </div>
      </div>

      {/* 展开内容 */}
      {isActive && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #f0f0f0",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            padding: "20px",
          }}
        >
          {/* 警告 */}
          {day.warnings && day.warnings.length > 0 && (
            <div
              style={{
                background: "#fff8e1",
                border: "1px dashed #ffe082",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#f57f17",
                marginBottom: "16px",
                lineHeight: "1.6",
              }}
            >
              {day.warnings.map((w, i) => (
                <div key={i}>⚠️ {w}</div>
              ))}
            </div>
          )}

          {/* 景点 */}
          {day.attractions.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                📍 今日景点
              </div>
              {day.attractions.map((attr, i) => (
                <AttractionItem key={i} attraction={attr} index={i} />
              ))}
            </div>
          )}

          {/* 餐饮 */}
          {day.meals.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                🍽 今日餐饮
              </div>
              {day.meals.map((meal, i) => (
                <MealItem key={i} meal={meal} />
              ))}
            </div>
          )}

          {/* 住宿 */}
          {day.hotel && (
            <div
              style={{
                background: "#f9f9f9",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                🏨 住宿推荐
              </div>
              <div
                style={{ fontWeight: 600, color: "#111", marginBottom: "4px" }}
              >
                {day.hotel.area}
              </div>
              <div style={{ color: "#666", marginBottom: "4px" }}>
                {day.hotel.type}
              </div>
              {day.hotel.reason && (
                <div
                  style={{
                    color: "#888",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  {day.hotel.reason}
                </div>
              )}
              <div style={{ color: "#e65100", fontWeight: 600 }}>
                约¥{day.hotel.estimated_cost}/晚
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
