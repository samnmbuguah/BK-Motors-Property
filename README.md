# BK Motors & BK Properties — Dual Monorepo Platform

A high-performance monorepo featuring two distinct commercial web applications built with **TypeScript**, **MUI (Material UI)**, and **Strapi Headless CMS**, tailored for deployment on **cPanel**.

1. **BK Motors** (`/apps/motors`): Modern automotive dealership platform inspired by [motifiti.co.ke](https://motifiti.co.ke). Includes vehicle search & filters, high-resolution photo galleries, technical spec sheets, Kenyan bank asset financing calculator, trade-in consignment valuation, and 1-click WhatsApp inquiry integration.
2. **BK Properties** (`/apps/properties`): Luxury real estate & property portal. Features Buy vs. Rent filtering, suburb/enclave discovery (Karen, Kilimani, Westlands, etc.), property specs, floor amenities, mortgage downpayment calculator, and private viewing booking.

---

## Repository Structure

```plaintext
BK-Motors-Property/
├── frontend/                     # TypeScript + React + Vite + MUI
│   ├── public/
│   │   └── .htaccess             # Apache SPA rewrite rules for cPanel
│   ├── src/
│   │   ├── apps/
│   │   │   ├── motors/           # BK Motors portal (Motifiti-style)
│   │   │   │   ├── components/   # VehicleCard, FinancingCalculator, CarFilterBar, etc.
│   │   │   │   ├── pages/        # Home, Inventory, Detail, SellCar, Contact
│   │   │   │   └── theme.ts      # Amber & Slate automotive theme
│   │   │   └── properties/       # BK Properties portal (Real estate)
│   │   │       ├── components/   # PropertyCard, PropertyFilterBar, etc.
│   │   │       ├── pages/        # Home, Listings, Detail, ListProperty, Contact
│   │   │       └── theme.ts      # Emerald Teal & Dark Navy luxury theme
│   │   ├── shared/               # Shared across both applications
│   │   │   ├── components/       # InquiryModal, WhatsAppButton, PortalSwitcher
│   │   │   ├── services/         # Strapi REST client + rich offline mock catalog
│   │   │   ├── types/            # Car, Property, Inquiry, Filter interfaces
│   │   │   └── utils/            # Kenyan currency formatter & loan mathematics
│   │   ├── App.tsx               # Router & dynamic multi-tenant domain switcher
│   │   └── main.tsx
│   ├── vite.config.ts            # Dual-target isolated build configuration
│   └── package.json
│
├── cms/                          # Strapi Headless CMS
│   ├── config/                   # Server, MySQL/SQLite database, and admin configs
│   ├── src/api/
│   │   ├── car/                  # Car collection schema & controllers
│   │   ├── property/             # Property collection schema & controllers
│   │   └── inquiry/              # Leads, test drives & viewing bookings
│   ├── server.js                 # cPanel Phusion Passenger entry point
│   └── package.json
│
├── CPANEL_DEPLOYMENT_GUIDE.md    # Complete cPanel production deployment guide
└── package.json                  # Root monorepo workspace scripts
```

---

## Quick Start (Development)

### 1. Install Dependencies
```bash
# In frontend directory
cd frontend
npm install
```

### 2. Run Applications

- **Run Unified Portal Preview** (with top portal switcher):
  ```bash
  npm run dev
  # Accessible at: http://localhost:3000
  ```

- **Run BK Motors directly**:
  ```bash
  npm run dev:motors
  # Or visit http://localhost:3000?portal=motors
  ```

- **Run BK Properties directly**:
  ```bash
  npm run dev:properties
  # Or visit http://localhost:3000?portal=properties
  ```

---

## Production Builds for cPanel

To deploy to two distinct domains on cPanel:

```bash
# Build both isolated application bundles
cd frontend
npm run build:all
```

This generates two separate, ready-to-deploy folders in `frontend/dist/`:
- `frontend/dist/motors/`: Complete static site with `.htaccess` for the **Car Dealership** domain.
- `frontend/dist/properties/`: Complete static site with `.htaccess` for the **Property Sales** domain.

---

## cPanel Deployment Quick Overview

1. **Deploying Frontends**:
   - In cPanel File Manager:
     - Upload `frontend/dist/motors/*` to your Car Dealership domain's `public_html` (e.g. `bkmotors.co.ke`).
     - Upload `frontend/dist/properties/*` to your Real Estate domain's `public_html` (e.g. `bkproperties.co.ke`).
   - The included `.htaccess` automatically manages client-side URL routing and browser caching on Apache/LiteSpeed.

2. **Deploying Strapi CMS**:
   - Use cPanel's **Setup Node.js App** (Phusion Passenger) pointing to the `cms/` folder with `server.js` as the startup file and connect to a cPanel MySQL database.
   - For step-by-step instructions, see the dedicated [CPANEL_DEPLOYMENT_GUIDE.md](./CPANEL_DEPLOYMENT_GUIDE.md).
