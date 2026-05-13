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

export const clearHistory = async (): Promise<void> => {
  await api.post("/api/clear");
};
