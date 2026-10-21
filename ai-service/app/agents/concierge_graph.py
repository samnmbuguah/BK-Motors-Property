from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from ..config import get_llm
from ..tools.catalog_tools import search_cars, search_properties
from ..tools.finance_tools import calculate_car_finance, calculate_mortgage

class ChatMessage(TypedDict):
    role: str  # "user" or "assistant"
    content: str

class ConciergeState(TypedDict, total=False):
    portal: str  # "motors" or "properties"
    user_message: str
    chat_history: List[ChatMessage]
    catalog_context: str
    finance_context: str
    response: str
    recommended_cards: List[Dict[str, Any]]

def retrieve_context_node(state: ConciergeState) -> Dict[str, Any]:
    portal = state.get("portal", "motors")
    msg = state.get("user_message", "").lower()
    
    catalog_text = ""
    finance_text = ""
    cards = []

    if portal == "motors":
        # Search relevant cars
        cars = search_cars(msg)
        cards = cars[:3]
        catalog_text = "CURRENT IN-STOCK VEHICLES AT BK MOTORS:\n"
        for c in cars[:3]:
            catalog_text += f"- {c.get('title')}: KES {c.get('price'):,}, {c.get('mileage'):,} km, {c.get('transmission')}, {c.get('location')}. Key features: {', '.join(c.get('features', [])[:3])}\n"

        # Check if user asks about finance, loan, installment, payment
        if any(w in msg for w in ["loan", "finance", "monthly", "installment", "interest", "deposit", "afford"]):
            sample_price = cars[0].get("price", 4000000) if cars else 4000000
            fin = calculate_car_finance(sample_price)
            finance_text = f"KENYA COMMERCIAL BANK FINANCING (13% APR, 48 Months) for KES {sample_price:,}: Down Payment: KES {fin['down_payment_kes']:,} (20%), Monthly Installment: KES {fin['monthly_repayment_kes']:,}/month."
    else:
        # Search properties
        props = search_properties(msg)
        cards = props[:3]
        catalog_text = "CURRENT AVAILABLE REAL ESTATE AT BK PROPERTIES:\n"
        for p in props[:3]:
            catalog_text += f"- {p.get('title')} ({p.get('listingStatus')}): KES {p.get('price'):,}, {p.get('propertyType')}, {p.get('suburb')}, {p.get('county')}. Amenities: {', '.join(p.get('amenities', [])[:3])}\n"

        # Check if user asks about mortgage, payment, loan
        if any(w in msg for w in ["mortgage", "finance", "monthly", "loan", "interest", "rate"]):
            sample_price = props[0].get("price", 50000000) if props else 50000000
            m = calculate_mortgage(sample_price)
            finance_text = f"KENYA MORTGAGE (14% APR, 15 Years) for KES {sample_price:,}: Down Payment: KES {m['down_payment_kes']:,} (20%), Monthly Payment: KES {m['monthly_repayment_kes']:,}/month."

    return {
        "catalog_context": catalog_text,
        "finance_context": finance_text,
        "recommended_cards": cards,
    }

def generate_response_node(state: ConciergeState) -> Dict[str, Any]:
    llm = get_llm(temperature=0.3)
    portal = state.get("portal", "motors")
    msg = state.get("user_message", "")
    catalog = state.get("catalog_context", "")
    finance = state.get("finance_context", "")
    history = state.get("chat_history", [])

    if portal == "motors":
        system_prompt = f"""You are 'BK Motors AI Concierge', an automotive sales specialist representing BK Motors Kenya (showrooms along Ngong Road and Kiambu Road, Nairobi).
You assist clients in selecting the best vehicles from our showroom, understanding our 150-point mechanical inspection badge, calculating Kenyan commercial bank asset financing (Stanbic, KCB, Equity), and booking test drives.

Catalog Information:
{catalog}

Financing Calculations:
{finance}

Guidelines:
1. Be warm, professional, and knowledgeable about Kenyan roads and driving conditions (fuel economy, ground clearance for upcountry, Nairobi traffic).
2. Quote prices in Kenyan Shillings (KES).
3. If the user expresses interest in a vehicle, invite them to schedule a weekend test drive along Ngong Road or Kiambu Road.
4. Keep responses concise (2-4 paragraphs max) with clear bullet points.
"""
    else:
        system_prompt = f"""You are 'BK Properties AI Real Estate Advisor', a property consultant representing BK Properties Kenya (prime locations in Karen, Westlands, Kilimani, Runda, Ruiru).
You advise clients on residential homes, luxury villas, land & plots due diligence (Freehold vs Leasehold, Sectional Properties Act, red soil vs black cotton), and mortgage planning.

Catalog Information:
{catalog}

Mortgage Calculations:
{finance}

Guidelines:
1. Be sophisticated, trustworthy, and advisory.
2. Emphasize title safety, ready deed verification, gated community amenities, and strategic capital appreciation.
3. Invite clients to book a private VIP walkthrough with our senior consultant Sarah Wanjiku.
4. Keep responses concise (2-4 paragraphs max) with clear bullet points.
"""

    messages = [SystemMessage(content=system_prompt)]
    for h in history[-4:]:
        if h.get("role") == "user":
            messages.append(HumanMessage(content=h.get("content", "")))
        else:
            messages.append(AIMessage(content=h.get("content", "")))

    messages.append(HumanMessage(content=msg))

    ai_reply = llm.invoke(messages).content

    return {
        "response": ai_reply,
    }

# Build LangGraph workflow
def build_concierge_graph():
    builder = StateGraph(ConciergeState)
    builder.add_node("retrieve_context", retrieve_context_node)
    builder.add_node("generate_response", generate_response_node)

    builder.add_edge(START, "retrieve_context")
    builder.add_edge("retrieve_context", "generate_response")
    builder.add_edge("generate_response", END)

    return builder.compile()

concierge_agent = build_concierge_graph()
