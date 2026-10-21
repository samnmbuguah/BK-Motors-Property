from typing import TypedDict, Optional, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import SystemMessage, HumanMessage
from ..config import get_llm
from ..tools.catalog_tools import search_cars, search_properties
from ..tools.finance_tools import calculate_car_finance, calculate_mortgage

class LeadState(TypedDict, total=False):
    inquiry_id: Optional[int]
    customer_name: str
    email: str
    phone: str
    inquiry_type: str
    item_title: Optional[str]
    message: str
    portal: str  # "motors" or "properties"
    
    # Generated outputs
    lead_score: str  # "HIGH", "MEDIUM", "WARM"
    lead_summary: str
    recommended_items: List[Dict[str, Any]]
    whatsapp_pitch: str
    email_pitch: str
    call_script: Dict[str, Any]

def qualify_lead_node(state: LeadState) -> Dict[str, Any]:
    llm = get_llm(temperature=0.1)
    prompt = f"""You are a senior commercial sales director in Kenya evaluating incoming leads for BK Group (BK Motors & BK Properties).
Analyze the following lead inquiry:
Customer Name: {state.get('customer_name')}
Email: {state.get('email')}
Phone: {state.get('phone')}
Inquiry Type: {state.get('inquiry_type')}
Subject / Item: {state.get('item_title')}
Message: {state.get('message')}

Determine:
1. Lead Intent & Priority Score (HIGH / MEDIUM / WARM). (High if they request test drive, private viewing, specific budget or phone number).
2. Key Pain Points & Buying Motivation (e.g., family upgrade, fuel efficiency, land investment title safety, Nairobi traffic comfort).
3. 2-sentence qualification summary for the sales consultant.

Format output exactly like:
SCORE: <HIGH|MEDIUM|WARM>
SUMMARY: <2-sentence summary>
"""
    response = llm.invoke([HumanMessage(content=prompt)])
    content = response.content

    score = "HIGH" if "HIGH" in content else ("MEDIUM" if "MEDIUM" in content else "WARM")
    summary = content.split("SUMMARY:")[-1].strip() if "SUMMARY:" in content else content[:200]

    return {
        "lead_score": score,
        "lead_summary": summary,
    }

def match_catalog_node(state: LeadState) -> Dict[str, Any]:
    inquiry_type = state.get("inquiry_type", "")
    is_motors = "car" in inquiry_type or "test_drive" in inquiry_type
    query = state.get("item_title") or state.get("message") or ""

    if is_motors:
        matches = search_cars(query)[:2]
    else:
        matches = search_properties(query)[:2]

    return {"recommended_items": matches}

def compose_outreach_node(state: LeadState) -> Dict[str, Any]:
    llm = get_llm(temperature=0.3)
    name = state.get("customer_name")
    item = state.get("item_title") or "our premium listings"
    inq_type = state.get("inquiry_type")
    msg = state.get("message")
    rec = state.get("recommended_items", [])
    rec_titles = ", ".join([r.get("title", "") for r in rec]) or item
    portal = "BK Motors" if "car" in inq_type or "test_drive" in inq_type else "BK Properties"
    rep_name = "James Kamau" if portal == "BK Motors" else "Sarah Wanjiku"

    prompt = f"""You are {rep_name}, Lead Sales Specialist at {portal} in Nairobi, Kenya.
Customer Name: {name}
Inquiry Subject: {item}
Inquiry Message: {msg}
Recommended Inventory: {rec_titles}

Draft three high-converting sales assets tailored to Kenyan executives/buyers:
---WHATSAPP_START---
A warm, professional WhatsApp message with appropriate emojis, addressing the customer by first name, referencing their interest in {item}, mentioning our showroom availability this week, and asking for a convenient 15-minute slot. Sign off with {rep_name}, {portal}.
---WHATSAPP_END---

---EMAIL_START---
Subject: [Clear, compelling subject line]
A formal, high-trust executive proposal. Highlight:
- Vehicle/Property condition & key specifications.
- Flexible Kenyan commercial bank financing / mortgage options.
- Exclusive invitation for a private physical walkthrough or test drive at our hub.
Sign off: {rep_name}, {portal}.
---EMAIL_END---

---SCRIPT_START---
SPIN Interview Call Script for the consultant:
- Situation Question:
- Problem Question:
- Implication Question:
- Need-Payoff Question:
- Objection Handler (price / market comparison):
- Closing Call to Action:
---SCRIPT_END---
"""
    resp = llm.invoke([HumanMessage(content=prompt)]).content

    # Parse sections
    whatsapp = ""
    if "---WHATSAPP_START---" in resp and "---WHATSAPP_END---" in resp:
        whatsapp = resp.split("---WHATSAPP_START---")[1].split("---WHATSAPP_END---")[0].strip()
    else:
        whatsapp = f"Hello {name}, thank you for inquiring about {item} with {portal}. This is {rep_name}. Are you available for a brief walkthrough this weekend?"

    email = ""
    if "---EMAIL_START---" in resp and "---EMAIL_END---" in resp:
        email = resp.split("---EMAIL_START---")[1].split("---EMAIL_END---")[0].strip()
    else:
        email = f"Dear {name},\n\nThank you for contacting {portal} regarding {item}. We would be delighted to arrange a private consultation and viewing for you.\n\nWarm regards,\n{rep_name}"

    script_raw = ""
    if "---SCRIPT_START---" in resp and "---SCRIPT_END---" in resp:
        script_raw = resp.split("---SCRIPT_START---")[1].split("---SCRIPT_END---")[0].strip()
    else:
        script_raw = resp

    return {
        "whatsapp_pitch": whatsapp,
        "email_pitch": email,
        "call_script": {
            "representative": rep_name,
            "raw_guide": script_raw,
        },
    }

# Build LangGraph workflow
def build_outreach_graph():
    builder = StateGraph(LeadState)
    builder.add_node("qualify_lead", qualify_lead_node)
    builder.add_node("match_catalog", match_catalog_node)
    builder.add_node("compose_outreach", compose_outreach_node)

    builder.add_edge(START, "qualify_lead")
    builder.add_edge("qualify_lead", "match_catalog")
    builder.add_edge("match_catalog", "compose_outreach")
    builder.add_edge("compose_outreach", END)

    return builder.compile()

outreach_agent = build_outreach_graph()
