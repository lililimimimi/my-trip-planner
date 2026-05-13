import type { TripPlan } from "../types";

interface Props {
  plan: TripPlan;
}

export default function BudgetSummary({ plan }: Props) {
  const items = [
    { label: "🎡 景点门票", value: plan.budget.attractions },
    { label: "🍜 餐饮", value: plan.budget.meals },
    { label: "🏨 住宿", value: plan.budget.hotels },
    { label: "🚇 交通", value: plan.budget.transport },
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#111",
          marginBottom: "16px",
        }}
      >
        💰 预算汇总
      </div>

      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #f5f5f5",
            fontSize: "13px",
          }}
        >
          <span style={{ color: "#666" }}>{item.label}</span>
          <span style={{ color: "#333", fontWeight: 500 }}>¥{item.value}</span>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "12px",
          marginTop: "4px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>
          总计
        </span>
        <span
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.5px",
          }}
        >
          ¥{plan.budget.total}
        </span>
      </div>
    </div>
  );
}
