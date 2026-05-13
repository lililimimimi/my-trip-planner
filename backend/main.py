from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from agent import agent

app = FastAPI(title="旅行规划助手")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    replan_mode: Optional[str] = None


@app.post("/api/chat")
async def chat(req: ChatRequest):
    result = agent.chat(req.message, req.replan_mode)
    return result


@app.post("/api/clear")
async def clear_history():
    agent.clear_history()
    return {"status": "ok"}


@app.get("/health")
async def health():
    return {"status": "ok"}