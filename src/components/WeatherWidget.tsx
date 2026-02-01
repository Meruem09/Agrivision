import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Droplets, Wind, Search, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherData {
  location: string;
  temperature: number;
  condition: number; // WMO Weather Code
  humidity: number;
  windSpeed: number;
  rainfall: number;
  forecast: {
    day: string;
    temp: number;
    condition: number;
    rain: number;
  }[];
}

const WeatherWidget: React.FC = () => {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cityInput, setCityInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WMO Weather Code Mapping to Icons
  const getWeatherIcon = (code: number, className = "h-6 w-6 text-gray-500") => {
    // 0: Clear sky, 1, 2, 3: Mainly clear, partly cloudy, and overcast
    if (code === 0 || code === 1) return <Sun className={`text-yellow-500 ${className}`} />;
    if (code === 2 || code === 3) return <Cloud className={`text-gray-500 ${className}`} />;

    // 45, 48: Fog
    if (code === 45 || code === 48) return <Wind className={`text-gray-400 ${className}`} />;

    // 51, 53, 55: Drizzle
    // 61, 63, 65: Rain
    // 80, 81, 82: Rain showers
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return <Droplets className={`text-blue-500 ${className}`} />;
    }

    // 95, 96, 99: Thunderstorm
    if ([95, 96, 99].includes(code)) return <Cloud className={`text-purple-600 ${className}`} />;

    // Default
    return <Cloud className={className} />;
  };

  const fetchWeather = async (lat: number, lon: number, locationName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,precipitation_sum,precipitation_probability_max&timezone=auto`
      );

      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data = await response.json();

      const formatDay = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      };

      setWeatherData({
        location: locationName,
        temperature: Math.round(data.current.temperature_2m),
        condition: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        rainfall: data.current.precipitation,
        forecast: data.daily.time.slice(0, 3).map((time: string, index: number) => ({
          day: formatDay(time),
          temp: Math.round(data.daily.temperature_2m_max[index]),
          condition: data.daily.weather_code[index],
          rain: data.daily.precipitation_probability_max?.[index] || 0
        }))
      });
    } catch (err) {
      console.error(err);
      setError('Could not load weather');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!cityInput.trim()) return;

    try {
      setLoading(true);
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found');
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      await fetchWeather(latitude, longitude, `${name}, ${country || ''}`);
    } catch {
      setError('Search failed');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    // Initial load: Try to get user device location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Since we don't have a reverse geocode API easy to use for free without key in this setup,
          // we'll just say "Current Location" or leave it vague until they search.
          // Or we could try to call an open API for reverse geocoding if needed, but let's stick to simple first.
          fetchWeather(latitude, longitude, "Your Location");
        },
        (err) => {
          console.log("Geolocation denied or error:", err);
          // Default fallback (e.g., Ahmedabad as used in mock)
          fetchWeather(23.0225, 72.5714, "Ahmedabad, India");
        }
      );
    } else {
      fetchWeather(23.0225, 72.5714, "Ahmedabad, India");
    }
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {t('dashboard.weather')}
        </h2>
      </div>

      {/* Current Weather & Search */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-800">{weatherData?.temperature}°C</p>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City..."
                className="pl-3 pr-8 py-1 text-sm border border-gray-300 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-green-600"
              >
                <Search size={14} />
              </button>
            </div>
          </div>

          {/* Weather Icon & Location Name */}
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-sm font-medium text-gray-600 truncate max-w-[150px]">
                {loading ? 'Locating...' : weatherData?.location}
              </p>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            {weatherData && getWeatherIcon(weatherData.condition, "h-10 w-10")}
          </div>
        </div>

        {/* Weather Details */}
        {weatherData && (
          <>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-600">Humidity</p>
                  <p className="text-sm font-medium text-gray-800">{weatherData.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Wind</p>
                  <p className="text-sm font-medium text-gray-800">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Rainfall: {weatherData.rainfall}mm
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3-Day Forecast */}
      {weatherData && (
        <div>
          <h3 className="font-medium text-gray-700 mb-2">3-Day Forecast</h3>
          <div className="space-y-2">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getWeatherIcon(day.condition, "h-6 w-6")}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{day.day}</p>
                    <p className="text-xs text-gray-600">{day.temp}°C</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Rain risk</p>
                  <p className="text-sm font-medium text-blue-600">{day.rain}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default/Disclaimer Alert */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
        <p className="text-xs text-yellow-800">
          Data provided by Open-Meteo. Forecasts are estimates.
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;