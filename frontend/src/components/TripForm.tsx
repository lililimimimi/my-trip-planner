import { useState } from "react";

interface FormData {
  city: string;
  days: number;
  date: string;
  pace: string;
  preferences: string[];
  budget: string;
  showCityPicker?: boolean;
}

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

const PREFERENCES = [
  { key: "trending", label: "🔥 网红打卡" },
  { key: "food", label: "🍜 地道美食" },
  { key: "shopping", label: "🛍 购物血拼" },
  { key: "history", label: "🏛 历史文化" },
  { key: "nature", label: "🌿 自然风光" },
  { key: "nightlife", label: "🌙 夜生活" },
];

const PACE = [
  { key: "easy", label: "🌸 松弛", desc: "每天2-3个景点" },
  { key: "normal", label: "✨ 适中", desc: "每天3-4个景点" },
  { key: "intensive", label: "⚡ 特种兵", desc: "每天5个以上" },
];

const BUDGET = [
  { key: "economy", label: "经济", desc: "¥300以内/天" },
  { key: "comfort", label: "舒适", desc: "¥300-800/天" },
  { key: "luxury", label: "豪华", desc: "¥800以上/天" },
];

export default function TripForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormData>({
    city: "",
    days: 3,
    date: "",
    pace: "normal",
    preferences: ["trending", "food"],
    budget: "comfort",
  });

  const togglePref = (key: string) => {
    setForm((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(key)
        ? prev.preferences.filter((p) => p !== key)
        : [...prev.preferences, key],
    }));
  };

  const handleSubmit = () => {
    if (!form.city.trim()) return alert("请输入目的地");
    if (!form.date) return alert("请选择出发日期");
    onSubmit(form);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* 标题 */}
        <div style={{ marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-1px",
              lineHeight: 1.2,
            }}
          >
            去哪里旅行？✈️
          </div>
          <div style={{ fontSize: "14px", color: "#aaa", marginTop: "8px" }}>
            填写需求，AI 为你生成专属行程
          </div>
        </div>

        
        {/* 目的地 */}
        <div style={{ marginBottom: "28px", position: "relative" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#aaa",
              marginBottom: "10px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            目的地
          </div>
          <div
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                showCityPicker: !prev.showCityPicker,
              }))
            }
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1.5px solid #efefef",
              fontSize: "15px",
              background: "#fafafa",
              color: form.city ? "#111" : "#aaa",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{form.city || "选择目的地..."}</span>
            <span style={{ fontSize: "12px", color: "#aaa" }}>▼</span>
          </div>

          {/* 下拉列表 */}
          {form.showCityPicker && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 100,
                background: "#fff",
                borderRadius: "14px",
                border: "1.5px solid #efefef",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                marginTop: "6px",
                maxHeight: "280px",
                overflowY: "auto",
              }}
            >
              {[
                { group: "直辖市", cities: ["北京", "上海", "重庆"] },
                {
                  group: "华东",
                  cities: ["杭州", "南京", "苏州", "黄山", "厦门"],
                },
                {
                  group: "华南",
                  cities: ["广州", "深圳", "三亚", "海口", "桂林"],
                },
                { group: "西南", cities: ["成都", "丽江", "大理", "昆明"] },
                { group: "西北", cities: ["西安"] },
                { group: "华中", cities: ["武汉", "张家界", "长沙"] },
                { group: "华北/东北", cities: ["青岛"] },
              ].map(({ group, cities }) => (
                <div key={group}>
                  <div
                    style={{
                      padding: "8px 16px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#aaa",
                      letterSpacing: "0.5px",
                      background: "#fafafa",
                    }}
                  >
                    {group}
                  </div>
                  {cities.map((city) => (
                    <div
                      key={city}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          city,
                          showCityPicker: false,
                        }))
                      }
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        cursor: "pointer",
                        color: form.city === city ? "#111" : "#333",
                        fontWeight: form.city === city ? 700 : 400,
                        background: form.city === city ? "#f5f5f5" : "#fff",
                        borderBottom: "1px solid #f5f5f5",
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 天数 + 日期 */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#aaa",
                marginBottom: "10px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              出发日期
            </div>
            <input
              type="date"
              value={form.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "14px",
                border: "1.5px solid #efefef",
                fontSize: "14px",
                outline: "none",
                background: "#fafafa",
                color: "#111",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#aaa",
                marginBottom: "10px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              天数
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "1.5px solid #efefef",
                background: "#fafafa",
              }}
            >
              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    days: Math.max(1, prev.days - 1),
                  }))
                }
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1.5px solid #e0e0e0",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {form.days}天
              </span>
              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    days: Math.min(14, prev.days + 1),
                  }))
                }
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1.5px solid #e0e0e0",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 旅行节奏 */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#aaa",
              marginBottom: "10px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            旅行节奏
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { key: "easy1", label: "🌸 极松弛", desc: "每天1个景点" },
              { key: "easy2", label: "✨ 松弛", desc: "每天2-3个景点" },
              { key: "intensive", label: "⚡ 特种兵", desc: "每天3个以上" },
            ].map((p) => (
              <div
                key={p.key}
                onClick={() => setForm((prev) => ({ ...prev, pace: p.key }))}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  border: `1.5px solid ${form.pace === p.key ? "#111" : "#efefef"}`,
                  background: form.pace === p.key ? "#111" : "#fafafa",
                  textAlign: "center",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: form.pace === p.key ? "#fff" : "#333",
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color:
                      form.pace === p.key ? "rgba(255,255,255,0.6)" : "#aaa",
                    marginTop: "3px",
                  }}
                >
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 旅行偏好 */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#aaa",
              marginBottom: "10px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            旅行偏好（可多选）
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {PREFERENCES.map((p) => (
              <div
                key={p.key}
                onClick={() => togglePref(p.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  border: `1.5px solid ${form.preferences.includes(p.key) ? "#111" : "#efefef"}`,
                  background: form.preferences.includes(p.key)
                    ? "#111"
                    : "#fafafa",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: form.preferences.includes(p.key) ? "#fff" : "#555",
                  transition: "all 0.15s",
                }}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* 预算 */}
        <div style={{ marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#aaa",
              marginBottom: "10px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            预算范围
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {BUDGET.map((b) => (
              <div
                key={b.key}
                onClick={() => setForm((prev) => ({ ...prev, budget: b.key }))}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  border: `1.5px solid ${form.budget === b.key ? "#111" : "#efefef"}`,
                  background: form.budget === b.key ? "#111" : "#fafafa",
                  textAlign: "center",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: form.budget === b.key ? "#fff" : "#333",
                  }}
                >
                  {b.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color:
                      form.budget === b.key ? "rgba(255,255,255,0.6)" : "#aaa",
                    marginTop: "3px",
                  }}
                >
                  {b.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提交 */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: loading ? "#ccc" : "#111",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "-0.3px",
          }}
        >
          {loading ? "规划中..." : "开始我的旅行 ✦"}
        </button>
      </div>
    </div>
  );
}
