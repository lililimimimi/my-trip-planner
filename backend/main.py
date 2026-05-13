from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from agent import agent
import json

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

@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest):
    def generate():
        for chunk in agent.chat_stream(req.message, req.replan_mode):
            yield f"data: {json.dumps({'chunk': chunk}, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/api/clear")
async def clear_history():
    agent.clear_history()
    return {"status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"}