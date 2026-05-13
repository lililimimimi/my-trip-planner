import { useState, useRef, useEffect } from "react";
import type { ChatMessage, TripPlan } from "../types";
import { sendMessageStream, clearHistory } from "../services/api";

interface Props {
  onTripPlanReceived: (plan: TripPlan) => void;
}

export default function ChatBox({ onTripPlanReceived }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "你好！我是你的旅行规划助手，告诉我你想去哪里、玩几天、有什么偏好，我来帮你规划行程！",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const send = async (message: string, replan_mode?: string) => {
    if (!message.trim() && !replan_mode) return;
    if (loading) return;

    const userMessage = message || "";
    if (userMessage) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    }
    setInput("");
    setLoading(true);
    setStreamingContent("");

    try {
      await sendMessageStream(
        userMessage,
        replan_mode,
        (chunk) => {
          setStreamingContent((prev) => prev + chunk);
        },
        (result) => {
          setMessages((prev) => {
            const lastStreaming = streamingContent;
            return [
              ...prev,
              {
                role: "assistant",
                content:
                  lastStreaming ||
                  result.message ||
                  "行程已生成，请查看右侧详情",
                trip_plan: result.trip_plan,
              },
            ];
          });
          setStreamingContent("");
          if (result.trip_plan) {
            onTripPlanReceived(result.trip_plan);
          }
        },
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，出错了，请重试。",
        },
      ]);
      setStreamingContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    await clearHistory();
    setMessages([
      {
        role: "assistant",
        content: "对话已清空，重新开始吧！",
      },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              background: msg.role === "user" ? "#111" : "#f5f5f5",
              color: msg.role === "user" ? "#fff" : "#333",
              padding: "10px 14px",
              borderRadius:
                msg.role === "user"
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            {msg.content}
          </div>
        ))}

        {/* 流式输出中 */}
        {streamingContent && (
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "80%",
              background: "#f5f5f5",
              color: "#333",
              padding: "10px 14px",
              borderRadius: "16px 16px 16px 4px",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            {streamingContent}
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "14px",
                background: "#999",
                marginLeft: "2px",
                verticalAlign: "middle",
                animation: "blink 1s infinite",
              }}
            />
          </div>
        )}

        {loading && !streamingContent && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#f5f5f5",
              padding: "10px 14px",
              borderRadius: "16px 16px 16px 4px",
              fontSize: "13px",
              color: "#999",
            }}
          >
            规划中...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入框 */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          gap: "8px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="告诉我你想去哪里..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "20px",
            border: "1px solid #eee",
            fontSize: "13px",
            outline: "none",
            background: "#fafafa",
            color: "#333",
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: loading ? "#ccc" : "#111",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          发送
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: "10px 14px",
            borderRadius: "20px",
            border: "1px solid #eee",
            background: "#fff",
            color: "#666",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          清空
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
