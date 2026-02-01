import React from 'react';
import { Sprout, Droplets, AlertTriangle, TrendingUp, MapPin, Calendar, Volume2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlerts } from '../contexts/AlertContext';
import CropHealthCard from './CropHealthCard';
import WeatherWidget from './WeatherWidget';
import RecommendationCard from './RecommendationCard';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { alerts } = useAlerts();

  const cropData = [
    {
      id: '1',
      name: 'wheat',
      area: '5.2 ha',
      health: 'healthy' as const,
      ndvi: 0.76,
      lastUpdate: '2 hours ago'
    },
    {
      id: '2',
      name: 'cotton',
      area: '3.8 ha',
      health: 'warning' as const,
      ndvi: 0.54,
      lastUpdate: '4 hours ago'
    },
    {
      id: '3',
      name: 'rice',
      area: '2.1 ha',
      health: 'critical' as const,
      ndvi: 0.31,
      lastUpdate: '6 hours ago'
    }
  ];

  const recommendations = [
    {
      id: '1',
      type: 'irrigation',
      priority: 'high' as const,
      crop: 'rice',
      message: t('rec.irrigation')
    },
    {
      id: '2',
      type: 'fertilizer',
      priority: 'medium' as const,
      crop: 'cotton',
      message: t('rec.fertilizer')
    },
    {
      id: '3',
      type: 'harvest',
      priority: 'low' as const,
      crop: 'wheat',
      message: t('rec.harvest')
    }
  ];

  const recentAlerts = alerts.slice(0, 3);

  const handleJankariClick = async () => {
    if (!window.speechSynthesis) {
      alert(t('dashboard.jankari.notSupported'));
      return;
    }

    let speechText = `${t('dashboard.jankari.greeting', { name: user?.name || '' })}. `;

    // 1. Fetch Weather Data (simplified for speech)
    let weatherText = "";
    try {
      // Default to Ahmedabad if no location (mimicking WeatherWidget)
      const lat = 23.0225;
      const lon = 72.5714;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
      );
      const data = await response.json();
      const temp = Math.round(data.current.temperature_2m);
      weatherText = t('dashboard.jankari.weather', { temp });
    } catch (e) {
      console.error("Weather fetch failed for speech", e);
      weatherText = t('dashboard.jankari.weather.unavailable');
    }
    speechText += weatherText;

    // 2. Summarize Crops
    speechText += ` ${t('dashboard.jankari.crops.intro', { count: cropData.length })}`;
    cropData.forEach(crop => {
      const cropName = t(`crop.${crop.name}`);
      const healthStatus = t(`crop.${crop.health}`);
      speechText += ` ${t('dashboard.jankari.crop.detail', { name: cropName, area: crop.area, health: healthStatus })}`;
    });

    // 3. Summarize Alerts
    const unreadAlertsCount = alerts.filter(a => !a.read).length;
    if (unreadAlertsCount > 0) {
      speechText += ` ${t('dashboard.jankari.alerts', { count: unreadAlertsCount })}`;
      const highPriorityAlerts = alerts.filter(a => !a.read && a.severity === 'high');
      if (highPriorityAlerts.length > 0) {
        speechText += ` ${t('dashboard.jankari.alerts.highPriority', { count: highPriorityAlerts.length })}`;
      }
    } else {
      speechText += ` ${t('dashboard.jankari.alerts.none')}`;
    }

    // 4. Summarize Recommendations
    const highPriorityRecommendations = recommendations.filter(rec => rec.priority === 'high');
    if (highPriorityRecommendations.length > 0) {
      speechText += ` ${t('dashboard.jankari.recommendations', { count: highPriorityRecommendations.length })}`;
      highPriorityRecommendations.forEach(rec => {
        speechText += ` ${t('dashboard.jankari.recommendation.detail', { crop: rec.crop, message: rec.message })}`;
      });
    } else {
      speechText += ` ${t('dashboard.jankari.recommendations.none')}`;
    }

    // 5. Speak the summary
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language; // Use the current language from context
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 relative">
      {/* Welcome Section */}
      <div className="bg-green-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t('dashboard.welcome')}, {user?.name}!
        </h1>
        <div className="flex items-center space-x-4 text-green-100">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{user?.farmLocation?.village}, {user?.farmLocation?.district}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.stats.area')}</p>
              <p className="text-2xl font-bold text-gray-800">11.1 ha</p>
            </div>
            <Sprout className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.stats.ndvi')}</p>
              <p className="text-2xl font-bold text-blue-600">0.54</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.stats.alerts')}</p>
              <p className="text-2xl font-bold text-red-600">{alerts.filter(a => !a.read).length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.stats.irrigation')}</p>
              <p className="text-2xl font-bold text-orange-600">2 Fields</p>
            </div>
            <Droplets className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Health Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('dashboard.farm.health')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {cropData.map((crop) => (
                <CropHealthCard key={crop.id} crop={crop} />
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('dashboard.recent.alerts')}
            </h2>
            {recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${alert.severity === 'high'
                      ? 'bg-red-50 border-red-500'
                      : alert.severity === 'medium'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{alert.message}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.location} • {alert.confidence}% confidence
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">{t('dashboard.alerts.none')}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <WeatherWidget />

          {/* Recommendations */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('dashboard.recommendations')}
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jankari Floating Button */}
      <button
        onClick={handleJankariClick}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 z-50 animate-bounce-subtle"
      >
        <Volume2 className="h-6 w-6" />
        <span className="font-bold text-lg">{t('dashboard.jankari')}</span>
      </button>
    </div>
  );
};

export default FarmerDashboard;