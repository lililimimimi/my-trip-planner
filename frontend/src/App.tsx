import { useState } from "react";
import TripForm from "./components/TripForm";
import ChatBox from "./components/ChatBox";
import TripPlanView from "./components/TripPlan";
import MapView from "./components/MapView";
import type { TripPlan } from "./types";
import { sendMessage } from "./services/api";

type Page = "form" | "result";

interface FormData {
  city: string;
  days: number;
  date: string;
  pace: string;
  preferences: string[];
  budget: string;
}

export default function App() {
  const [page, setPage] = useState<Page>("form");
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState<"plan" | "map">("plan");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);

    const paceMap: Record<string, string> = {
      easy1: "极松弛，每天只安排1个景点",
      easy2: "松弛，每天2-3个景点",
      intensive: "特种兵，每天3个以上景点，行程满",
    };

    const budgetMap: Record<string, string> = {
      economy: "经济型，每天300元以内",
      comfort: "舒适型，每天300-800元",
      luxury: "豪华型，每天800元以上",
    };

    const prefMap: Record<string, string> = {
      trending: "网红打卡",
      food: "地道美食",
      shopping: "购物血拼",
      history: "历史文化",
      nature: "自然风光",
      nightlife: "夜生活",
    };

    const prefs = data.preferences.map((p) => prefMap[p] || p).join("、");

    const message = `我想去${data.city}玩${data.days}天，出发日期是${data.date}，旅行节奏是${paceMap[data.pace]}，偏好是${prefs}，预算是${budgetMap[data.budget]}。请帮我规划详细的行程。`;

    try {
      const response = await sendMessage(message);
      console.log("后端返回：", response);
      console.log('景点坐标：', response.trip_plan?.days.map(d => 
        d.attractions.map(a => ({ name: a.name, lng: a.longitude, lat: a.latitude }))
      ));
      if (response.trip_plan) {
        setTripPlan(response.trip_plan);
      }
      setPage("result");
    } catch (error) {
      console.error("错误详情：", error);
      alert("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleTripPlanReceived = (plan: TripPlan) => {
    setTripPlan(plan);
  };

  if (page === "form") {
    return <TripForm onSubmit={handleFormSubmit} loading={loading} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        background: "#fafafa",
      }}
    >
      {/* 左侧聊天 */}
      <div
        style={{
          width: "360px",
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 顶部 */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>
              旅行助手 ✈️
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
              {tripPlan
                ? `${tripPlan.city} ${tripPlan.days.length}日游`
                : "规划中..."}
            </div>
          </div>
          <button
            onClick={() => {
              setPage("form");
              setTripPlan(null);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #eee",
              background: "#fff",
              color: "#666",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            重新规划
          </button>
        </div>

        {/* 聊天区域 */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ChatBox onTripPlanReceived={handleTripPlanReceived} />
        </div>
      </div>

      {/* 右侧内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Tab */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 24px",
            background: "#fff",
          }}
        >
          {[
            { key: "plan", label: "🗓 行程详情" },
            { key: "map", label: "🗺 地图展示" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "plan" | "map")}
              style={{
                padding: "14px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                color: activeTab === tab.key ? "#111" : "#999",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #111"
                    : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容 */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {activeTab === "plan" ? (
            <TripPlanView plan={tripPlan} />
          ) : (
            <MapView plan={tripPlan} />
          )}
        </div>
      </div>
    </div>
  );
}
