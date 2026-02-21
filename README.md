# AgriVision - Gujarat AgriVision Platform

A comprehensive React-based AgriVision web application designed to empower farmers in Gujarat, India with satellite-based crop monitoring, real-time market intelligence, AI-powered advisory, and weather forecasting.

## 🚀 Features

- **Satellite Crop Monitoring**: NDVI, EVI, and NDMI indices visualization
- **Live Market Prices**: Real-time commodity prices from data.gov.in
- **AI Advisory**: Google Gemini-powered agricultural chatbot with voice input
- **Human Expert Chat**: Connect with agricultural specialists
- **Weather Forecasting**: Real-time weather data with 3-day forecasts
- **Multilingual Support**: English, Hindi, and Gujarati
- **Voice Features**: Speech-to-text and text-to-speech capabilities
- **Interactive Maps**: Draw and analyze farm fields with area calculations

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (for AI features)
- Modern web browser with geolocation support

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgriVision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # Required for AI features
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional - for future Clerk authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   ```
   
   Get your Gemini API key from: https://ai.google.dev/

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Type check
npm run typecheck

# Lint code
npm run lint

# Build production bundle
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.tsx       # Public homepage
│   ├── FarmerDashboard.tsx   # Farmer dashboard
│   ├── MapView.tsx           # Satellite map viewer
│   ├── MarketPlace.tsx       # Market prices
│   ├── Advisory.tsx          # AI + Human advisory
│   ├── WeatherWidget.tsx     # Weather display
│   └── ErrorBoundary.tsx     # Error handling
├── contexts/            # React Context providers
│   ├── AuthContext.tsx       # Authentication
│   ├── LanguageContext.tsx   # i18n translations
│   └── AlertContext.tsx      # Notifications
├── services/            # API integrations
│   ├── aiService.ts          # Gemini AI
│   ├── marketApi.ts          # Market data
│   └── predictionService.ts  # AI predictions
└── App.tsx              # Main routing

```

## 🔑 Demo Accounts

For testing purposes, use these demo credentials:

**Farmer Account:**
- Email: `farmer@demo.com`
- Password: `demo123`

**Admin Account:**
- Email: `admin@demo.com`
- Password: `demo123`

## 🌐 API Integrations

- **Google Gemini AI**: Agricultural advisory chatbot
- **Open-Meteo**: Weather data (no API key required)
- **data.gov.in**: Indian agricultural market prices
- **Google Input Tools**: Hindi transliteration
- **Sentinel Hub**: Satellite imagery (WMS)

## 🔒 Security Notes

- Never commit `.env` file to version control
- API keys are exposed in client-side code - use backend proxy for production
- Implement rate limiting for API calls
- Use environment-specific API keys

## 🚧 Current Limitations

- Mock authentication (Clerk/Supabase not yet integrated)
- Mock satellite indices (real Sentinel-2 API integration pending)
- Mock farm field data
- Client-side API key exposure (needs backend proxy)

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Weather data: [Open-Meteo](https://open-meteo.com/)
- Market data: [data.gov.in](https://data.gov.in/)
- AI: [Google Gemini](https://ai.google.dev/)
- Maps: [OpenStreetMap](https://www.openstreetmap.org/)
- Satellite imagery: ESRI & Sentinel Hub

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Version**: 2.0  
**Last Updated**: January 2026
