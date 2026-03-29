from __future__ import annotations
import os
from typing import TypedDict, List
import httpx
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from rag.chain import get_rag_chain

load_dotenv()

# ── State ────────────────────────────────────────────────────────────────────

class AgentState(TypedDict):
    message: str
    intent: str
    rag_answer: str
    live_data: str
    final_answer: str
    history: List[dict]

# ── Nodes ────────────────────────────────────────────────────────────────────

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2,
)


def classify_intent(state: AgentState) -> AgentState:
    """Classify if query needs live backend data or just RAG knowledge."""
    msg = state["message"].lower()
    LIVE_KEYWORDS = ["available seats", "remaining seats", "how many seats", "quota full", "seat count"]
    intent = "live_data" if any(k in msg for k in LIVE_KEYWORDS) else "rag"
    return {**state, "intent": intent}


def rag_answer_node(state: AgentState) -> AgentState:
    """Answer using the RAG chain (document knowledge)."""
    try:
        chain = get_rag_chain()
        result = chain.invoke({"query": state["message"]})
        answer = result.get("result", "I could not find an answer in the knowledge base.")
    except Exception as e:
        answer = f"RAG error: {str(e)}"
    return {**state, "rag_answer": answer}


def live_data_node(state: AgentState) -> AgentState:
    """Fetch real-time seat data from the backend API."""
    try:
        backend_url = os.getenv("BACKEND_URL", "http://localhost:5000")
        token = os.getenv("BACKEND_JWT", "")
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        resp = httpx.get(f"{backend_url}/api/dashboard", headers=headers, timeout=5.0)
        if resp.status_code == 200:
            data = resp.json()
            seat_info = []
            for s in data.get("seatSummary", []):
                quotas = ", ".join(
                    f"{q['type']}: {q['available']}/{q['total']} available"
                    for q in s.get("quotas", [])
                )
                seat_info.append(f"{s['program']} ({s['programCode']}): {quotas}")
            live_answer = "Current Seat Availability:\n" + "\n".join(seat_info) if seat_info else "No seat data available."
        else:
            live_answer = "Could not fetch live seat data from the system."
    except Exception as e:
        live_answer = f"Live data unavailable: {str(e)}"
    return {**state, "live_data": live_answer}


def generate_response(state: AgentState) -> AgentState:
    """Combine RAG + live data into a final helpful response."""
    parts = []
    if state.get("live_data"):
        parts.append(state["live_data"])
    if state.get("rag_answer"):
        parts.append(state["rag_answer"])
    
    if parts:
        combined = "\n\n".join(parts)
    else:
        combined = "I'm sorry, I couldn't find an answer to your question."

    # Let the LLM polish the final response
    prompt = f"""You are a helpful admission assistant. 
    
User asked: {state['message']}

Available information:
{combined}

Provide a clear, concise, and helpful answer based on this information."""
    
    try:
        response = llm.invoke(prompt)
        final = response.content
    except Exception:
        final = combined
    
    return {**state, "final_answer": final}


# ── Routing ──────────────────────────────────────────────────────────────────

def route_by_intent(state: AgentState) -> str:
    return "live_data" if state["intent"] == "live_data" else "rag_answer"


# ── Build Graph ───────────────────────────────────────────────────────────────

def build_agent():
    graph = StateGraph(AgentState)
    graph.add_node("classify_intent", classify_intent)
    graph.add_node("rag_answer", rag_answer_node)
    graph.add_node("live_data", live_data_node)
    graph.add_node("generate_response", generate_response)

    graph.set_entry_point("classify_intent")
    graph.add_conditional_edges("classify_intent", route_by_intent, {
        "rag_answer": "rag_answer",
        "live_data": "live_data",
    })
    graph.add_edge("rag_answer", "generate_response")
    graph.add_edge("live_data", "generate_response")
    graph.add_edge("generate_response", END)

    return graph.compile()


admission_agent = build_agent()
