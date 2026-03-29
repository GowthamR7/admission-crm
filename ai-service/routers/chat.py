from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from graph.agent import admission_agent

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    answer: str
    intent: str

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    state = {
        "message": request.message,
        "intent": "",
        "rag_answer": "",
        "live_data": "",
        "final_answer": "",
        "history": [m.model_dump() for m in (request.history or [])],
    }
    result = admission_agent.invoke(state)
    return ChatResponse(
        answer=result.get("final_answer", "Sorry, I could not process your request."),
        intent=result.get("intent", "rag"),
    )
