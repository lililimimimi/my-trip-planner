import axios from "axios";
import type { ChatResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
});

export const sendMessage = async (
  message: string,
  replan_mode?: string,
): Promise<ChatResponse> => {
  const response = await api.post("/api/chat", {
    message,
    replan_mode: replan_mode || null,
  });
  return response.data;
};

export const sendMessageStream = async (
  message: string,
  replan_mode: string | undefined,
  onChunk: (chunk: string) => void,
  onResult: (result: ChatResponse) => void,
) => {
  const response = await fetch(`${BASE_URL}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, replan_mode: replan_mode || null }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const chunk = parsed.chunk as string;

        if (chunk.startsWith("\n__RESULT__")) {
          const resultStr = chunk.replace("\n__RESULT__", "");
          const result = JSON.parse(resultStr);
          onResult(result);
        } else {
          textBuffer += chunk;
          if (textBuffer.includes("__JSON_START__")) {
            const clean = textBuffer.split("__JSON_START__")[0];
            if (clean) onChunk(clean);
            textBuffer = "";
          } else if (textBuffer.length > 20) {
            onChunk(textBuffer.slice(0, -15));
            textBuffer = textBuffer.slice(-15);
          }
        }
      } catch {}
    }
  }
};

export const clearHistory = async (): Promise<void> => {
  await api.post("/api/clear");
};
