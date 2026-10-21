from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os

from .config import NVIDIA_API_KEY, OPENROUTER_API_KEY, get_llm
from .agents.concierge_graph import concierge_agent
from .agents.outreach_graph import outreach_agent
from .tools.catalog_tools import search_cars, search_properties
from .tools.finance_tools import calculate_car_finance, calculate_mortgage

app = FastAPI(
    title="BK Motors & BK Properties AI Engine",
    description="LangGraph-powered AI Sales Outreach & Automotive/Property Concierge",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message to the AI concierge")
    portal: str = Field("motors", description="'motors' or 'properties'")
    history: Optional[List[Dict[str, str]]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    response: str
    portal: str
    recommended_items: List[Dict[str, Any]]

class OutreachRequest(BaseModel):
    inquiry_id: Optional[int] = None
    customer_name: str
    email: Optional[str] = ""
    phone: str
    inquiry_type: str = "car_purchase"
    item_title: Optional[str] = ""
    message: str = ""

class OutreachResponse(BaseModel):
    lead_score: str
    lead_summary: str
    recommended_items: List[Dict[str, Any]]
    whatsapp_pitch: str
    email_pitch: str
    call_script: Dict[str, Any]

class FinanceRequest(BaseModel):
    type: str = "car"  # "car" or "mortgage"
    price: float
    down_payment_pct: Optional[float] = 20.0
    tenure: Optional[int] = None  # months for car, years for mortgage

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BK LangGraph AI Service",
        "nvidia_nim_configured": bool(NVIDIA_API_KEY),
        "openrouter_configured": bool(OPENROUTER_API_KEY),
    }

@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(request: ChatRequest):
    try:
        inputs = {
            "portal": request.portal,
            "user_message": request.message,
            "chat_history": request.history or [],
        }
        res = concierge_agent.invoke(inputs)
        return ChatResponse(
            response=res.get("response", "How can I assist you further?"),
            portal=request.portal,
            recommended_items=res.get("recommended_cards", []),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Concierge error: {str(e)}")

@app.post("/api/outreach/generate", response_model=OutreachResponse)
def handle_outreach_generation(request: OutreachRequest):
    try:
        inputs = {
            "inquiry_id": request.inquiry_id,
            "customer_name": request.customer_name,
            "email": request.email or "",
            "phone": request.phone,
            "inquiry_type": request.inquiry_type,
            "item_title": request.item_title or "",
            "message": request.message,
        }
        res = outreach_agent.invoke(inputs)
        return OutreachResponse(
            lead_score=res.get("lead_score", "MEDIUM"),
            lead_summary=res.get("lead_summary", ""),
            recommended_items=res.get("recommended_items", []),
            whatsapp_pitch=res.get("whatsapp_pitch", ""),
            email_pitch=res.get("email_pitch", ""),
            call_script=res.get("call_script", {}),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outreach generation error: {str(e)}")

@app.post("/api/finance/calculate")
def handle_finance_calc(req: FinanceRequest):
    if req.type == "car":
        tenure = req.tenure or 48
        return calculate_car_finance(req.price, req.down_payment_pct or 20.0, tenure)
    else:
        tenure = req.tenure or 15
        return calculate_mortgage(req.price, req.down_payment_pct or 20.0, tenure)
