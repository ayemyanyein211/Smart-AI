# 🌱 SmartWaste AI

> **Camera-guided smart waste sorting ecosystem, live collection fleet telemetry, citizen rewards, and municipal circular economy platform.**

SmartWaste AI bridges citizen recycling habits with municipal waste infrastructure. Using AI-assisted material recognition, real-time IoT bin monitoring, collection truck telemetry, and a gamified circular economy reward loop, the platform helps cities reduce waste stream contamination and incentivize sustainable daily habits.

---

## 🌟 Key Features

### 1. 📷 AI-Guided Waste Scanner & Recognition
- **Multi-Stream Material Sorting**: Classifies items into 6 municipal streams:
  - 🟡 **Plastic & PET**
  - ⚪ **Metal & Aluminum Cans**
  - 🔵 **Paper & Cardboard**
  - 🟤 **Organic / Bio-Waste**
  - 🟢 **Glass Containers**
  - 🔴 **Specialist / E-Waste & Hazardous**
- **Contamination Prevention**: Real-time preparation guidance (e.g., rinse containers, remove bottle caps, flatten cardboard).
- **Gamified Deposit Points**: Automatic reward calculations based on material type and weight.

### 2. 🗺️ Live Smart Bins & Fleet Telemetry
- **Interactive Geospatial Map**: View municipal smart bin kiosks across Bucharest and Cluj-Napoca.
- **IoT Fill-Level Telemetry**: Real-time fill percentages, sensor statuses, and accessibility indicators (24/7 access, wheelchair accessibility).
- **Collection Truck Dispatch**: Live truck route monitoring, capacity tracking, and one-click municipal service simulations.

### 3. 🎁 Circular Economy & Rewards Store
- **Citizen Points Economy**: Earn points for everyday recycling deposits and daily login streaks.
- **Redeemable Vouchers**: Exchange points for public transit passes (e.g., STB Bucharest), local café discounts, zero-waste grocery credits, and student benefits.
- **Digital Voucher Wallet**: Instant QR/alphanumeric voucher codes with expiration timers.

### 4. 🪪 Digital Smart Waste Citizen Pass
- **Contactless Public Bin Authentication**: Personalized alphanumeric code (e.g., `SW-RO-84920`) and 4-digit PIN for street kiosk touchscreens.
- **Deposit Audit Trail**: Detailed ledger of past recycling deposits with CO₂ offset and weight metrics.

### 5. 🤖 AI Eco Sorting Assistant (Gemini)
- **Natural Language Inquiries**: Powered by `@google/genai` to answer sorting dilemmas (e.g., pizza boxes, blister packs, electronics).
- **Grounded Municipal Advice**: Complies with EU and Romanian waste sorting regulations.

### 6. 🤝 Community Hub & Social Impact
- **Impact Crowdfunding**: Donate points or funds to community initiatives:
  - Roma Recycling Education Academy
  - Micro-Cooperative Upcycling Workshops
  - Youth Green Tech Labs
  - Urban Tree Planting Campaigns
- **Eco Events**: Discover and RSVP to local community clean-ups and repair cafés.

### 7. 🌐 Dual-Language Support & Accessibility
- **Bilingual Interface**: Seamless one-click toggling between **Romanian (RO)** and **English (EN)**.
- **High Contrast & Font Settings**: Configurable accessibility modes and privacy settings.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)

---

## 📁 Project Structure

```text
├── index.html                # HTML entry point with metadata & fonts
├── metadata.json             # AI Studio applet capabilities and configuration
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite & Tailwind CSS plugins
├── .env.example              # Template for environment variables
└── src/
    ├── main.tsx              # React root mount
    ├── App.tsx               # Main application controller & state management
    ├── index.css             # Global styles & Tailwind CSS theme
    ├── types.ts              # TypeScript interfaces (Bins, Trucks, Rewards, Users)
    ├── data/
    │   └── mockData.ts       # Initial telemetry, bins, rewards, and impact data
    ├── assets/
    │   └── images/           # Curated environmental imagery
    └── components/
        ├── Header.tsx                 # Navigation bar, points summary, language toggle
        ├── HomeFeed.tsx               # Dashboard feed, daily streaks, quick stats
        ├── ScannerModal.tsx           # Camera scanner simulation & material detection
        ├── NearbyBinsMap.tsx          # Interactive GIS map, bin statuses & truck fleet
        ├── RewardsStore.tsx           # Rewards catalog & redeemed voucher wallet
        ├── CommunityHub.tsx           # Community crowdfunding, leaderboards & events
        ├── AIChatDrawer.tsx           # AI Sorting Assistant drawer powered by Gemini
        ├── UserPassModal.tsx          # Citizen Digital Pass & deposit ledger
        ├── DonationCardModal.tsx      # Community program contribution modal
        ├── EmergencyNotificationBar.tsx # City alerts banner
        ├── SettingsModal.tsx          # User preferences & accessibility
        └── AuthModal.tsx              # Citizen sign-in and registration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` or `bun` package manager

### 1. Installation

Clone or open the repository, then install dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory (based on `.env.example`):

```bash
cp .env.example .env
```

Set your Gemini API key in `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

> **Note**: In Google AI Studio, `GEMINI_API_KEY` is automatically injected via the workspace environment.

### 3. Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the application.

### 4. Building for Production

Compile TypeScript and build the optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### 5. Type Checking / Linting

Verify TypeScript types across the codebase:

```bash
npm run lint
```

---

## 💡 Recommended Next Steps & Roadmap

If you are extending or deploying this project, consider:
1. **Hardware / IoT Integration**: Connecting MQTT or WebSockets to physical ultrasonic bin level sensors.
2. **Real WebRTC Camera Feed**: Enabling live camera stream inference with on-device TF.js or Gemini Vision server streaming.
3. **Database & Auth Persistence**: Connecting Firebase Firestore or PostgreSQL for cloud user accounts and real transaction receipts.
4. **Municipal Open Data APIs**: Integrating live public transit and GPS feeds from local city portals (e.g., Bucharest Open Data / Cluj-Napoca Smart City).

---

## 📄 License

This project is created for educational, municipal research, and smart city prototyping purposes.
