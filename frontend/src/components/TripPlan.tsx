import { useState } from "react";
import type { TripPlan } from "../types";
import ListView from "./ListView";
import DetailView from "./DetailView";

interface Props {
  plan: TripPlan | null;
}

export default function TripPlanView({ plan }: Props) {
  const [activeDay, setActiveDay] = useState<number | null>(null);

  if (!plan)
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "48px" }}>🗺</div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#333" }}>
          还没有行程
        </div>
        <div style={{ fontSize: "13px", color: "#aaa" }}>
          和助手聊聊你想去哪里吧
        </div>
      </div>
    );

  if (activeDay !== null) {
    return (
      <DetailView
        plan={plan}
        dayNumber={activeDay}
        onBack={() => setActiveDay(null)}
        onNextDay={(day) => setActiveDay(day)}
      />
    );
  }

  return <ListView plan={plan} onDayClick={(day) => setActiveDay(day)} />;
}
