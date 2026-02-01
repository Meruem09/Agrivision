# CropCare - Gujarat AgriTech Platform (CropCare) - Project Overview

## 1. Introduction
**CropCare** (internally named "CropCare") is a comprehensive React-based AgriTech web application designed to empower farmers and agricultural advisors in Gujarat, India. The platform combines satellite-based crop monitoring, real-time market intelligence, AI-powered advisory, and weather forecasting to help farmers make data-driven decisions and maximize their yields.

---

## 2. Technology Stack

### Core Framework & Build Tool
- **React 18.3**: Modern UI library with hooks
- **TypeScript 5.5**: Type-safe development
- **Vite 7.1**: Lightning-fast build tool and dev server

### Styling & UI
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Custom SVG Illustrations**: Hand-crafted farmer illustrations on landing page

### Maps & Geospatial
- **Leaflet 1.9**: Interactive mapping library
- **React-Leaflet 4.2**: React bindings for Leaflet
- **Leaflet-Draw 1.0**: Drawing tools for field selection

### State Management & Routing
- **React Context API**: Global state (Auth, Language, Alerts)
- **React Router DOM 7.9**: Client-side routing

### External APIs & Services
- **Google Gemini AI (1.5 Flash)**: Agricultural advisory chatbot
- **Open-Meteo API**: Real-time weather data and forecasts
- **data.gov.in API**: Live agricultural market prices
- **Google Input Tools API**: Hindi transliteration

### Backend (Configured but Mock)
- **Supabase Client 2.57**: Database SDK (installed, not yet integrated)
- **Clerk 5.51**: Authentication SDK (installed, not yet integrated)

---

## 3. Project Structure

```
c:/Projects/CropCare
├── src/
│   ├── components/          # React Components (12 files)
│   │   ├── LandingPage.tsx       # Public homepage with CropCare branding
│   │   ├── LoginPage.tsx         # Authentication
│   │   ├── FarmerDashboard.tsx   # Farmer's main dashboard
│   │   ├── AdminDashboard.tsx    # Admin overview
│   │   ├── MapView.tsx           # Satellite map with NDVI/EVI/NDMI
│   │   ├── MarketPlace.tsx       # Live market prices + AI predictions
│   │   ├── Advisory.tsx          # Dual AI + Human expert chat
│   │   ├── AlertsPage.tsx        # Notifications center
│   │   ├── WeatherWidget.tsx     # Real-time weather with search
│   │   ├── CropHealthCard.tsx    # Reusable crop status card
│   │   ├── RecommendationCard.tsx # Action recommendations
│   │   └── Header.tsx            # Navigation bar
│   │
│   ├── contexts/            # React Context Providers
│   │   ├── AuthContext.tsx       # User authentication state
│   │   ├── LanguageContext.tsx   # i18n translations (En/Hi/Gu)
│   │   └── AlertContext.tsx      # Alert notifications
│   │
│   ├── services/            # API Integration Layer
│   │   ├── aiService.ts          # Gemini AI integration
│   │   ├── marketApi.ts          # data.gov.in market data fetcher
│   │   └── predictionService.ts  # AI-powered price predictions
│   │
│   ├── assets/              # Static Resources
│   │   ├── hero_farmers.png      # Landing page illustration
│   │   └── hero_bg.png           # Background graphics
│   │
│   ├── App.tsx              # Main routing logic
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
│
├── public/                  # Public assets
├── .env                     # Environment variables (API keys)
├── package.json             # Dependencies
└── vite.config.ts           # Vite configuration
```

---

## 4. Major Features

### 🏠 Landing Page (CropCare Branding)
**File**: `LandingPage.tsx`

- **Custom SVG Illustrations**: Hand-drawn farmer characters (male/female) with traditional attire
- **Hero Section**: "Trusted Digital Partner for Farming Success" tagline
- **Feature Cards**: Satellite Monitoring, Data-Driven Insights, AI Advisory
- **CTA Section**: Sign-up encouragement
- **Responsive Design**: Mobile-first approach with gradient backgrounds

---

### 📊 MarketPlace - Live Commodity Prices
**File**: `MarketPlace.tsx` | **Service**: `marketApi.ts`, `predictionService.ts`

#### Real-Time Market Data
- **Source**: data.gov.in API (Gujarat state markets)
- **Display**: Commodity name, variety, quantity, min/max prices
- **Filters**: Category-based (Crops, Vegetables, Oilseeds, Cereal, Fruits)
- **Search**: Real-time filtering by commodity/variety name
- **Auto-refresh**: Timestamp tracking with manual reload

#### AI-Powered Market Insights
- **Price Forecasting**: 30-day trend predictions (Up/Down/Stable)
- **Smart Planting Recommendations**: Season-aware crop suggestions
- **Profit Potential Analysis**: High/Medium/Low profit indicators
- **Reasoning**: AI-generated explanations for each prediction
- **Visual Indicators**: Color-coded trends with icons

**Key Technologies**:
- Google Gemini AI for predictions
- Retry logic with exponential backoff for API reliability
- Skeleton loading states for UX

---

### 🤖 Advisory - Dual AI + Human Expert System
**File**: `Advisory.tsx` | **Service**: `aiService.ts`

#### AI Assistant (Right Panel - Blue Gradient)
- **Gemini AI Integration**: Agricultural expert chatbot
- **Voice Input**: Web Speech API for hands-free queries
- **Image Upload**: Crop disease/pest identification via photo
- **Text-to-Speech**: AI responses read aloud automatically
- **Hindi Transliteration**: Real-time English-to-Hindi conversion using Google Input Tools
- **Concise Responses**: AI instructed to keep answers under 50 words

#### Human Expert Chat (Left Panel - Green Theme)
- **Expert Directory**: 3 specialists (Soil, Plant Pathology, Agronomy)
- **Direct Messaging**: Text + image support
- **WhatsApp Integration**: One-click call button
- **Multi-conversation**: Separate chat threads per expert
- **Profile Cards**: Expert photos, roles, contact info

**Unique Features**:
- **Bilingual Mode Toggle**: Switch between English/Hindi mid-conversation
- **Live Transliteration**: Type in English, get Hindi suggestions
- **Voice Recognition**: Supports both languages
- **Dual Interface**: Compare AI vs human advice side-by-side

---

### 🌦️ Enhanced Weather Widget
**File**: `WeatherWidget.tsx`

#### Real-Time Weather Data
- **Source**: Open-Meteo API (free, no API key required)
- **Auto-location**: Uses browser geolocation on first load
- **City Search**: Manual location override with autocomplete
- **Current Conditions**: Temperature, humidity, wind speed, rainfall
- **3-Day Forecast**: Daily predictions with rain probability
- **WMO Weather Codes**: Accurate icon mapping (sun, cloud, rain, etc.)

**Improvements from Original**:
- ✅ Real API integration (was mock data)
- ✅ User location detection
- ✅ City search functionality
- ✅ Live weather updates

---

### 👨‍🌾 Farmer Dashboard - "Jankari" Voice Assistant
**File**: `FarmerDashboard.tsx`

#### Voice Summary Feature
- **"Jankari" Button**: Floating action button (bottom-right)
- **Comprehensive Summary**: Speaks dashboard overview in user's language
- **Content Included**:
  - Weather conditions (fetched live from Open-Meteo)
  - Crop health status (all fields)
  - Unread alerts count + high-priority warnings
  - Urgent recommendations
- **Multilingual TTS**: Uses Web Speech Synthesis API
- **Smart Aggregation**: Filters and prioritizes information

#### Dashboard Components
- **Quick Stats**: Total area, avg NDVI, alerts, irrigation needs
- **Crop Health Cards**: Visual status for each field
- **Recent Alerts**: Top 3 notifications with severity colors
- **Recommendations**: Actionable farming advice
- **Weather Widget**: Embedded real-time weather

---

### 🗺️ Interactive Map (MapView)
**File**: `MapView.tsx` (Enhanced - 850 lines)

#### Satellite Indices Visualization
- **NDVI**: Normalized Difference Vegetation Index (health/density)
- **EVI**: Enhanced Vegetation Index (atmospheric correction)
- **NDMI**: Normalized Difference Moisture Index (water content)
- **Color-Coded Fields**: Green (healthy), Yellow (warning), Red (critical)

#### Drawing & Analysis Tools
- **Shape Tools**: Rectangle, Polygon, Circle
- **Area Calculation**: Automatic hectare computation using geodesic math
- **Index Averaging**: Mock NDVI/EVI/NDMI for selected areas
- **Edit/Delete**: Modify or remove drawn shapes

#### Export & Reporting
- **JSON Export**: Coordinates + indices for all selected areas
- **HTML Report Generation**: Comprehensive farm monitoring report with:
  - Overview statistics
  - Field-by-field analysis with index tables
  - Selected areas summary
  - Index reference guide
  - Data source information
- **Auto-Print**: Opens print dialog after report generation

---

## 5. Services Layer (`src/services/`)

### `aiService.ts` - Gemini AI Integration
```typescript
getAIResponse(prompt: string, image?: string): Promise<string>
```
- **Model**: Gemini 1.5 Flash
- **Multimodal**: Supports text + image inputs
- **Prompt Engineering**: Instructs AI to act as agricultural expert
- **Error Handling**: Graceful fallback messages
- **Environment Variable**: `VITE_GEMINI_API_KEY`

### `marketApi.ts` - Market Data Fetcher
```typescript
fetchWithRetry(params: MarketParams): Promise<MarketResponse>
```
- **Endpoint**: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
- **Features**:
  - Retry logic (3 attempts)
  - Exponential backoff
  - Query parameter building
  - Price change calculation
  - Category classification
- **Filters**: State, district, market, commodity, date range

### `predictionService.ts` - AI Market Predictions
```typescript
getMarketPredictions(commodities: string[]): Promise<PricePrediction[]>
getCropRecommendations(month: string): Promise<CropRecommendation[]>
```
- **Uses**: Gemini AI via `aiService.ts`
- **Output**: Structured JSON predictions
- **Fallback**: Mock data if AI fails
- **Context-Aware**: Gujarat-specific, season-aware recommendations

---

## 6. Multilingual Support (i18n)

### Supported Languages
- **English** (en)
- **Hindi** (hi) - हिंदी
- **Gujarati** (gu) - ગુજરાતી

### Translation Keys
**File**: `LanguageContext.tsx` (211 lines)

**Coverage**:
- Navigation labels
- Dashboard stats
- Crop health statuses
- Alert messages
- Map indices
- Market categories
- Common actions (Submit, Cancel, Save, etc.)

**Storage**: `localStorage` for persistence

---

## 7. Authentication & User Roles

### Current Implementation (Mock)
**File**: `AuthContext.tsx`

**Demo Accounts**:
1. **Farmer**: `farmer@demo.com` / `demo123`
   - Name: રાજેશ પટેલ (Rajesh Patel)
   - Location: Sanand, Ahmedabad
   - Role: `farmer`

2. **Admin**: `admin@demo.com` / `demo123`
   - Name: Dr. Priya Sharma
   - Role: `admin`

**Features**:
- LocalStorage session persistence
- Role-based routing
- Mock 1-second login delay

**Future**: Replace with Clerk/Supabase integration

---

## 8. Routing Structure

**File**: `App.tsx`

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | `LandingPage` / Dashboard | Public / Auth | Landing for guests, dashboard for logged-in |
| `/login` | `LoginPage` | Public only | Authentication form |
| `/map` | `MapView` | Auth required | Satellite field monitoring |
| `/alerts` | `AlertsPage` | Auth required | Notifications center |
| `/marketplace` | `MarketPlace` | Auth required | Live market prices + AI |
| `/advisory` | `Advisory` | Auth required | AI + Human expert chat |

**Header Visibility**: Hidden on landing/login pages

---

## 9. Development Status

### ✅ Completed Features
- [x] Landing page with custom illustrations
- [x] Real-time weather integration (Open-Meteo)
- [x] Live market data (data.gov.in API)
- [x] AI chatbot (Gemini 1.5 Flash)
- [x] Voice input/output (Web Speech API)
- [x] Hindi transliteration (Google Input Tools)
- [x] AI market predictions
- [x] Crop planting recommendations
- [x] Interactive satellite map
- [x] Field drawing & analysis tools
- [x] HTML report generation
- [x] Multilingual support (3 languages)
- [x] "Jankari" voice dashboard summary

### 🚧 Using Mock Data
- User authentication (demo accounts)
- Farm field coordinates
- Crop health indices (NDVI/EVI/NDMI)
- Alert notifications
- Expert advisor responses

### 📋 Next Steps
1. **Backend Integration**:
   - Replace mock auth with Clerk
   - Set up Supabase database
   - Store user farms and crop data

2. **Real Satellite Data**:
   - Integrate Sentinel-2 API
   - Calculate actual NDVI/EVI/NDMI from imagery
   - Historical trend analysis

3. **Production Readiness**:
   - Error boundaries
   - Loading states optimization
   - API rate limiting
   - Security hardening (API key management)

---

## 10. Environment Variables

**File**: `.env` (not in git)

```env
VITE_GEMINI_API_KEY=your_google_ai_studio_key
```

**Required for**:
- AI Advisory chatbot
- Market price predictions
- Crop recommendations

---

## 11. Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.3.1 | UI framework |
| `react-router-dom` | 7.9.3 | Routing |
| `leaflet` | 1.9.4 | Maps |
| `react-leaflet` | 4.2.1 | React map bindings |
| `leaflet-draw` | 1.0.4 | Drawing tools |
| `axios` | 1.12.2 | HTTP client |
| `lucide-react` | 0.545.0 | Icons |
| `@supabase/supabase-js` | 2.57.4 | Database (future) |
| `@clerk/clerk-react` | 5.51.0 | Auth (future) |

---

## 12. Design Philosophy

### User-Centric
- **Accessibility**: Voice features for low-literacy users
- **Multilingual**: Support for local languages
- **Offline-First**: Minimal external dependencies where possible

### Data-Driven
- **Real APIs**: Live weather, market, and AI data
- **Transparency**: Show data sources and update times
- **Actionable**: Every insight leads to a recommendation

### Modern Tech
- **Fast**: Vite for instant HMR
- **Type-Safe**: TypeScript throughout
- **Responsive**: Mobile-first design with Tailwind

---

## 13. Credits & Data Sources

- **Weather**: [Open-Meteo](https://open-meteo.com/) - Free weather API
- **Market Data**: [data.gov.in](https://data.gov.in/) - Indian government open data
- **AI**: [Google Gemini](https://ai.google.dev/) - Generative AI
- **Maps**: [OpenStreetMap](https://www.openstreetmap.org/) contributors
- **Satellite Imagery**: ESRI World Imagery (via ArcGIS)

---

**Last Updated**: January 31, 2026  
**Version**: 2.0 (Major Feature Update)  
**Maintainer**: CropCare Development Team
