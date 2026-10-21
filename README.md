# BK Group: BK Motors & BK Properties Digital Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg?logo=react)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-5.x-007FFF.svg?logo=mui)](https://mui.com/)
[![Strapi](https://img.shields.io/badge/Strapi-v4-4945FF.svg?logo=strapi)](https://strapi.io/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Python_3.10+-black.svg?logo=python)](https://github.com/langchain-ai/langgraph)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A commercial, production-ready TypeScript and Python monorepo powering two high-trust digital portals in Kenya alongside an autonomous **LangGraph AI Sales Engine**:

1. **BK Motors**: Modern automotive dealership platform inspired by [motifiti.co.ke](https://motifiti.co.ke), featuring vehicle inventory search, 150-point inspection certificates, commercial bank financing calculators (13% APR), trade-in valuations, and 1-click WhatsApp inquiry integration.
2. **BK Properties**: Luxury real estate & property portal with Buy vs. Rent filtering, context-aware Land & Plots display (Acreage, Title Deed types, Zoning, Topography, Soil Type), neighborhood exploration (Karen, Westlands, Kilimani, Runda), and private viewing booking.
3. **LangGraph AI Engine (`ai-service`)**: Autonomous multi-agent sales qualification, personalized WhatsApp pitch generator, executive email proposals, SPIN interview call scripts, and an interactive conversational AI concierge with loan calculator tools.
4. **Dealer & Seller Document Vault**: Secure multi-angle photo gallery, NTSA logbook upload, Ministry of Lands title deed verification, sales agreement generator, and AI document integrity verification.
5. **Escrow Financial Ledger**: End-to-end transparent transaction tracking for booking deposits (M-PESA Paybill), bank escrow holds (KCB / Stanbic Bank), asset finance disbursements, seller payouts, and printable official receipts.

---

## Live Deployments (SSL via Caddy)

| Service | Public URL | Description |
| :--- | :--- | :--- |
| **BK Motors** | [bkmotors.169-58-102-217.sslip.io](https://bkmotors.169-58-102-217.sslip.io) | Automotive Dealership Portal |
| **BK Properties** | [bkproperties.169-58-102-217.sslip.io](https://bkproperties.169-58-102-217.sslip.io) | Luxury Real Estate & Land Portal |
| **Motors Admin** | [motors-admin.169-58-102-217.sslip.io/admin](https://motors-admin.169-58-102-217.sslip.io/admin) | Automotive Management Panel |
| **Properties Admin** | [properties-admin.169-58-102-217.sslip.io/admin](https://properties-admin.169-58-102-217.sslip.io/admin) | Real Estate Management Panel |
| **AI Engine API** | [bkai.169-58-102-217.sslip.io](https://bkai.169-58-102-217.sslip.io) | LangGraph FastAPI Service |
| **Strapi CMS Hub** | [bkapi.169-58-102-217.sslip.io/admin](https://bkapi.169-58-102-217.sslip.io/admin) | Master Headless CMS Admin |

---

## Monorepo Architecture

```plaintext
BK-Motors-Property/
├── frontend/                     # React 19 + TypeScript + Vite + MUI 5
│   ├── src/
│   │   ├── apps/
│   │   │   ├── motors/           # Car dealership portal (Motifiti-inspired)
│   │   │   └── properties/       # Real estate portal (Luxury & Land)
│   │   └── shared/               # Shared libraries, UI components, context providers
│   │       ├── components/       # DealerDocumentVault, TransactionTracker, AiAssistantWidget
│   │       ├── context/          # AuthContext, CurrencyContext (KES/USD), FavoritesContext
│   │       ├── services/         # Strapi client, JWT Auth provider, mock fallback catalog
│   │       └── types/            # TypeScript schemas for Vehicles, Properties, Docs, Ledger
│   ├── Dockerfile.motors         # Nginx container for BK Motors
│   ├── Dockerfile.properties     # Nginx container for BK Properties
│   └── vite.config.ts            # Dual build target pipeline (--mode motors / --mode properties)
│
├── cms/                          # Strapi Headless CMS (Node 22 / v4)
│   ├── src/api/                  # Car, Property, Inquiry schemas and controllers
│   ├── config/                   # Multi-environment database (SQLite / MySQL)
│   └── server.js                 # cPanel Phusion Passenger entrypoint
│
├── ai-service/                   # LangGraph AI Engine (Python 3.10+ / FastAPI)
│   ├── app/
│   │   ├── graphs/
│   │   │   ├── outreach_graph.py # Multi-node sales lead qualification & outreach generator
│   │   │   └── concierge_graph.py# Client-facing interactive conversational assistant
│   │   ├── config.py             # NVIDIA NIM & OpenRouter configuration
│   │   └── main.py               # FastAPI endpoints (/health, /api/chat, /api/outreach/generate)
│   ├── Dockerfile                # Python container
│   └── requirements.txt          # LangGraph, LangChain, FastAPI, Uvicorn
│
├── docker-compose.yml            # Multi-service container orchestration
├── ARCHITECTURE.md               # Detailed system architecture document
├── CPANEL_DEPLOYMENT_GUIDE.md    # Traditional cPanel / Apache deployment guide
└── package.json                  # Root workspace scripts
```

For complete technical specifications, review [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Seed Data & Demo Accounts

The system includes pre-seeded accounts across all user roles:

| Role | Username / Identifier | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin` (`admin@bkmotors.co.ke`) | `AdminPassword2026!` | Strapi CMS Admin Panel (`/admin`) |
| **Motors Sales Agent** | `james.kamau` (`james@bkmotors.co.ke`) | `AgentPassword2026!` | Lead management, vehicle consignment desk |
| **Properties Sales Agent** | `sarah.wanjiku` (`sarah@bkproperties.co.ke`) | `AgentPassword2026!` | Private viewing schedules, property listings desk |
| **Verified Client / Buyer** | `david.mwangi` (`david@example.com`) | `ClientPassword2026!` | Client Dashboard, Document Vault, Escrow Ledger |

> [!TIP]
> Clients can also register self-serve via the **Sign In / Register** modal on either website.

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js**: v20 or v22 LTS
- **Python**: v3.10 or higher
- **npm**: v10+

### 1. Clone & Configure Environment
```bash
git clone https://github.com/samnmbuguah/BK-Motors-Property.git
cd BK-Motors-Property

# Create local environment file from template
cp .env.example .env
```

Add your free **NVIDIA NIM API key** (available at [build.nvidia.com](https://build.nvidia.com)) to `.env`.

### 2. Install Dependencies
```bash
# Install frontend and CMS dependencies
npm install
cd frontend && npm install && cd ..
```

### 3. Run Applications
```bash
# Terminal 1: Run Frontend Dev Server (Dual Portal Switcher)
npm run dev
# Accessible at http://localhost:3000

# Terminal 2: Run Strapi Headless CMS
npm run cms:dev
# Accessible at http://localhost:1337/admin

# Terminal 3: Run LangGraph AI Engine
cd ai-service
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Accessible at http://localhost:8000/docs
```

---

## Docker Deployment (Production)

Deploy the entire stack with a single command:

```bash
docker compose up -d --build
```

This launches:
- `bk-motors-web`: Nginx serving the compiled BK Motors web application (Port 80)
- `bk-properties-web`: Nginx serving the compiled BK Properties web application (Port 80)
- `bk-strapi-api`: Strapi CMS API and Admin panel (Port 1337)
- `bk-ai-service`: LangGraph FastAPI engine (Port 8000)

---

## Traditional cPanel Deployment

Both frontend web apps can be built into standalone static bundles with Apache `.htaccess` rewrites:

```bash
cd frontend
npm run build:all
```

- Upload `dist/motors/*` to your Car Dealership `public_html`.
- Upload `dist/properties/*` to your Real Estate `public_html`.
- Deploy `cms/` via cPanel **Setup Node.js App** (Phusion Passenger) connected to a MySQL database.

Follow the step-by-step guide in [CPANEL_DEPLOYMENT_GUIDE.md](./CPANEL_DEPLOYMENT_GUIDE.md).

---

## Key Features

### 🚗 BK Motors
- **Motifiti Kenya Design**: High-contrast dark automotive aesthetic (#0F172A slate & #D97706 amber).
- **150-Point Inspection Badges**: Mechanical, interior, exterior, diagnostic, and road test certification scores.
- **Kenyan Bank Financing Calculator**: Real-time down payment, tenure (12 to 60 months), and monthly installment calculations based on 13% APR commercial bank rates.
- **Trade-In / Consignment Portal**: Authenticated intake form for vehicle owners with NTSA logbook upload and physical inspection booking.

### 🏡 BK Properties
- **Luxury Real Estate Theme**: Emerald teal (#0D9488) and deep navy palette.
- **Context-Aware Land & Plots UI**: Dedicated display fields for Acreage, Title Deed tenure (Freehold vs. Leasehold), Zoning approval, Topography, Soil type, Water & Electricity infrastructure.
- **Mortgage Calculator**: Computes down payments, loan repayment amortization, and estimated monthly payments.
- **Private Viewing Bookings**: Authenticated scheduling for on-site agent-guided tours.

### 🤖 LangGraph AI Engine
- **Lead Qualification Graph**: Evaluates lead readiness, estimated budget, urgency, and purchase timeline.
- **WhatsApp Pitch Generator**: Auto-generates polite, professional WhatsApp pitches tailored for Kenyan business culture.
- **Executive Email Proposal**: Generates detailed vehicle and property proposals ready for executive and corporate buyers.
- **SPIN Selling Interview Script**: Equips sales agents with Situation, Problem, Implication, and Need-Payoff talking points.
- **Interactive Sales Concierge**: Client-facing floating chatbot capable of live inventory queries and loan calculations.

### 📂 Dealer & Buyer Portals
- **Document Vault**: Upload multi-angle photos, NTSA logbooks, land title deeds, and official land registry searches.
- **AI Document Verification**: Automated checks for document legibility, VIN/chassis consistency, land parcel registry formats, and NTSA TIMS transfer compliance.
- **Escrow & Transactions**: Full monetary audit trail for booking deposits, bank escrow holds, asset finance releases, and seller payouts with downloadable/printable official receipts.

---

## Contributing & License

Contributions are welcome! Please open an issue or submit a pull request.

This project is licensed under the **MIT License**.
