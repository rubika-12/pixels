# StoreOrSell 🌾
### Post-Harvest Hold-or-Sell Advisor for Farmers & Trader Groups

**Team: Pixel Punks**  
*Vijanthar M C • Rohith L • Rubika Devi P*  
*Built for AgriTech Innovation Hackathon 2026*

---

## 🌟 Overview
Every season, Indian farmers and aggregators holding tomatoes, onions, and perishable commodities make high-stakes marketing choices based solely on instinct. Waiting too long leads to catastrophic post-harvest rot and moisture shrinkage, while panic selling during peak arrivals surrenders valuable margin to middlemen right before price recovery.

**StoreOrSell** is a decision intelligence platform that combines **storage conditions**, **biological shelf-life curves**, and **mandi price momentum** to recommend an uncompromising **HOLD** or **SELL NOW** verdict. It calculates the exact expected net rupees in hand for each choice after deducting cumulative storage fees and projected spoilage loss.

---

## 🚀 Key Features

1. **AI Advisor Engine (`/src/lib/advisor.js`)**:
   - Non-linear acceleration spoilage curves calibrated to storage types (Open floor `0.6x`, Ventilated shed `1.0x`, Cold storage `1.8x`).
   - 7-day linear regression slope with momentum damping to model mandi rate trends.
   - 3% risk threshold filter to prevent risky holding when profit is marginal.
   - **Exact Benchmark Demo**: 1,000 kg Tomatoes, sell now at ₹18/kg = ₹18,000, vs hold 5 days in cold storage with 12% spoilage at ₹24/kg minus ₹1,500 storage = **₹19,620** (**HOLD** with **+₹1,620** net gain).

2. **Judges' Auto-Pilot Demo Mode (`⚡ Judges Demo`)**:
   - Single-click in the navigation bar automatically populates the 1,000 kg Tomato scenario, smoothly navigates to the advisor, displays animated analysis, renders Recharts graphs, and fires celebration confetti.

3. **Rich Visual Analytics**:
   - **Shelf-Life Gauge**: Radial circular SVG meter tracking remaining usable days in prime condition (Green / Amber / Red).
   - **Price Trend Chart**: Dual-series Recharts graph plotting verified 7-day history with 5-day projected momentum and peak sell marker.
   - **Net Value Curve**: Bar chart revealing how waiting past the peak causes net cash in pocket to decline rapidly due to rot and storage tariffs.
   - **Multi-Factor Breakdown**: Expandable progress meters for storage protection, freshness index, price momentum, and spoilage resistance.

4. **Bilingual Support (English & Tamil / தமிழ்)**:
   - Instant toggle for English and Tamil localization across all metrics, labels, explanations, and advice.

5. **Export & Sharing**:
   - **Printable Slip Modal (`window.print()`)**: Generates an official advisory slip for physical printing or PDF saving.
   - **Pre-formatted WhatsApp Dispatch**: 1-click share with emoji summary and formatted calculations ready to message farm clusters.

---

## 🎨 Design System

- **Forest Green (`#1F4D2B`)**: Dominant brand background & authority.
- **Leaf Green (`#2E7D45`)**: HOLD recommendation & positive margins.
- **Tomato Red (`#D8432B`)**: SELL NOW urgency & spoilage risk warnings.
- **Onion Amber (`#F2A93B`)**: Accents, highlights, and momentum cues.
- **Pale Harvest Tint (`#EEF5E9`)**: Soft background for cards in light mode.
- **Near-Black Green (`#1B2B1E`)**: High-contrast, WCAG AA compliant text.
- **Typography**: `Fraunces` / serif for headings; `Inter` for crisp tabular numbers and body text.
- **Dark Mode**: Integrated toggle with persistent `localStorage` support.

---

## 🛠️ Quick Start & Run Steps

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone or navigate into the project directory
cd Storeorsell

# Install dependencies
npm install

# Start local development server
npm run dev
```

The Vite dev server will start instantly at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔌 Connecting a Real Mandi Price API

`StoreOrSell` is architected with complete decoupling between UI components and mathematical logic. The calculation engine in [`src/lib/advisor.js`](file:///c:/Users/rubik/OneDrive/Desktop/Storeorsell/src/lib/advisor.js) currently consumes the historical prices from [`src/data/cropsData.js`](file:///c:/Users/rubik/OneDrive/Desktop/Storeorsell/src/data/cropsData.js).

To connect live government mandi data (e.g. [Agmarknet API](https://agmarknet.gov.in/) via [data.gov.in](https://data.gov.in/)):

1. Obtain an API Key from the Open Government Data (OGD) platform:
   ```env
   VITE_DATA_GOV_API_KEY=your_api_key_here
   ```

2. Replace the static `crop.priceHistory` lookup in `projectPriceTrend` with an async fetch helper:
   ```javascript
   // Example service function in src/lib/mandiApi.js:
   export async function fetchLiveMandiPrices(state, market, commodity) {
     const res = await fetch(
       `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${import.meta.env.VITE_DATA_GOV_API_KEY}&format=json&filters[state]=${state}&filters[commodity]=${commodity}&filters[market]=${market}`
     );
     const data = await res.json();
     // Extract the latest 7 modal prices (Rs/Quintal -> divide by 100 for Rs/kg)
     return data.records.map(r => Number(r.modal_price) / 100);
   }
   ```

3. Pass the fetched live price array and current modal price directly to `calculateRecommendation(...)`. The rest of the platform (holding curves, shelf-life modeling, and charts) will seamlessly adapt without any UI refactoring!

---

## 📁 Project File Structure

```
StoreOrSell/
├── index.html                     # Entry HTML, SEO meta, Google Fonts
├── package.json                   # Dependencies (React, Recharts, Framer Motion, Lucide)
├── vite.config.js                 # Vite bundler configuration
├── tailwind.config.js             # Fresh harvest color palette and tokens
├── postcss.config.js              # PostCSS plugins
├── README.md                      # Documentation & API integration guide
├── public/
│   └── favicon.svg                # Fresh produce SVG logo
└── src/
    ├── main.jsx                   # React root mount with AppProvider
    ├── index.css                  # Tailwind styles, print media rules, sliders
    ├── App.jsx                    # Single page assembly
    ├── context/
    │   └── ThemeContext.jsx       # Theme (Dark/Light), Language (EN/TA), Toasts, Demo signals
    ├── data/
    │   ├── cropsData.js           # 5 crops, 3 storage types, historical rates, 3 demo presets
    │   └── translations.js        # Comprehensive English & Tamil dictionaries
    ├── lib/
    │   ├── advisor.js             # Pure calculation logic (shelf life, spoilage curves, net profit)
    │   ├── formatters.js          # Indian currency (₹), compact lakhs, quantities, percentages
    │   └── exportSummary.js       # Print slip trigger and WhatsApp message builder
    └── components/
        ├── Navbar.jsx             # Sticky nav, theme/lang toggles, judges demo auto-pilot button
        ├── Hero.jsx               # Headline, floating produce animations, interactive preview card
        ├── ProblemStrip.jsx       # Dual dilemma cards (Spoilage vs Distress Sale)
        ├── HowItWorks.jsx         # 3-step visual workflow with animated connectors
        ├── Toast.jsx              # Floating notification alert component
        ├── ImpactRoadmap.jsx      # Field metrics + 3-phase strategic roadmap
        ├── Footer.jsx             # Team Pixel Punks credits and hackathon badge
        └── advisor/
            ├── AdvisorSection.jsx # Orchestrator container with confetti trigger
            ├── AdvisorForm.jsx    # Left panel: step-by-step interactive inputs
            ├── AdvisorResults.jsx # Right panel: verdict, side-by-side math, actions
            ├── ShelfLifeGauge.jsx # Radial SVG gauge with status colors
            ├── PriceTrendChart.jsx# Recharts dual-tone historical + projected line chart
            ├── NetValueChart.jsx  # Recharts bar chart showing net value by holding day
            ├── FactorsBreakdown.jsx# Expandable factor breakdown with progress bars
            └── SummaryModal.jsx   # Printable official advisory slip modal
```

---

## 🏆 Hackathon Winning Polish
- **Count-Up Numbers & Indian Rupee Formatting**: Formatted with standard Indian commas (`₹19,620`, `₹1.5L`).
- **Interactive Confetti Celebration**: Canvas particle celebration triggered whenever a HOLD recommendation produces notable net gains.
- **Judges Demo Mode**: Immediate evaluation in under 15 seconds without tedious manual typing.
- **Zero External Dead Weight**: Self-contained SVG icons, clean build, zero console errors, full mobile responsiveness.

---
*Created by **Pixel Punks** (Vijanthar M C, Rohith L, Rubika Devi P)*...
