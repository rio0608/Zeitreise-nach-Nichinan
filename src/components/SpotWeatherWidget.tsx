import React, { useState, useEffect } from 'react';
import {
  fetchSpotWeather,
  SpotWeatherData,
  HourlyForecastItem,
} from '../services/weatherService';
import { Language, UI_TRANSLATIONS } from '../i18n/translations';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Umbrella,
  Thermometer,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

interface SpotWeatherWidgetProps {
  spotId: string;
  currentLanguage?: Language;
  defaultExpanded?: boolean;
}

export const SpotWeatherWidget: React.FC<SpotWeatherWidgetProps> = ({
  spotId,
  currentLanguage = 'ja',
  defaultExpanded = false,
}) => {
  const [weather, setWeather] = useState<SpotWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isHourlyOpen, setIsHourlyOpen] = useState<boolean>(defaultExpanded);

  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.ja;

  const loadWeather = async (force = false) => {
    if (force) {
      setIsRefreshing(true);
    }
    try {
      const data = await fetchSpotWeather(spotId, currentLanguage);
      setWeather(data);
    } catch (e) {
      console.error('Weather load error:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [spotId, currentLanguage]);

  // Weather Icon Component
  const renderWeatherIcon = (
    category: SpotWeatherData['weatherCategory'],
    className = 'w-5 h-5'
  ) => {
    switch (category) {
      case 'clear':
        return <Sun className={`${className} text-amber-500`} />;
      case 'partly_cloudy':
        return <CloudSun className={`${className} text-amber-600`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-500`} />;
      case 'rain':
        return <CloudRain className={`${className} text-sky-600`} />;
      case 'thunder':
        return <CloudLightning className={`${className} text-indigo-600`} />;
      case 'fog':
        return <Wind className={`${className} text-slate-400`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  // Mini hourly code to icon
  const renderHourlyIcon = (code: number) => {
    if (code === 0 || code === 1) {
      return <Sun className="w-3.5 h-3.5 text-amber-500 mx-auto" />;
    } else if (code === 2) {
      return <CloudSun className="w-3.5 h-3.5 text-amber-600 mx-auto" />;
    } else if (code === 3) {
      return <Cloud className="w-3.5 h-3.5 text-slate-400 mx-auto" />;
    } else if (code >= 51 && code <= 82) {
      return <CloudRain className="w-3.5 h-3.5 text-sky-500 mx-auto" />;
    } else if (code >= 95) {
      return <CloudLightning className="w-3.5 h-3.5 text-indigo-500 mx-auto" />;
    }
    return <Sun className="w-3.5 h-3.5 text-amber-500 mx-auto" />;
  };

  if (isLoading) {
    return (
      <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500 animate-pulse">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{t.weatherTitle}...</span>
        </div>
        <span className="text-[11px] text-slate-400">Loading</span>
      </div>
    );
  }

  if (!weather) return null;

  // POP badge style based on rain probability
  const pop = weather.precipitationProb;
  const popBadgeClass =
    pop >= 50
      ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
      : pop >= 25
      ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';

  return (
    <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/60 via-white to-amber-50/40 p-3 text-xs shadow-xs transition-all">
      {/* Top Header: Weather Title, Current Weather Icon & Live Info */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-sky-100/70">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🌤️</span>
          <span className="font-extrabold text-slate-800 text-xs">
            {t.weatherTitle}
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            ({weather.fetchedAt})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Refresh button */}
          <button
            type="button"
            onClick={() => loadWeather(true)}
            disabled={isRefreshing}
            className="p-1 rounded-md text-slate-400 hover:text-sky-700 hover:bg-sky-100/70 transition-colors cursor-pointer"
            title={t.weatherRefresh}
            aria-label={t.weatherRefresh}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`}
            />
          </button>

          {/* Toggle hourly detail */}
          <button
            type="button"
            onClick={() => setIsHourlyOpen(!isHourlyOpen)}
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-100/60 hover:bg-sky-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          >
            <span>{t.weatherDetailsToggle}</span>
            {isHourlyOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Main Meteorological Metrics Grid */}
      <div className="pt-2.5 pb-2 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Weather condition & Temperature */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-white border border-sky-200/80 shadow-inner shrink-0">
            {renderWeatherIcon(weather.weatherCategory, 'w-6 h-6')}
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {weather.temperature}°C
              </span>
              <span className="text-[11px] font-bold text-slate-700">
                {weather.weatherText}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
              <span>
                {t.weatherApparent} {weather.apparentTemperature}°C
              </span>
              <span className="text-slate-300">|</span>
              <span>
                {weather.dailyMin}° / {weather.dailyMax}°
              </span>
            </div>
          </div>
        </div>

        {/* Right: Chance of Precipitation & Wind/Humidity */}
        <div className="flex items-center gap-2">
          {/* Precipitation Chance Badge */}
          <div
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-xs shadow-2xs ${popBadgeClass}`}
            title={`${t.weatherPop}: ${pop}%`}
          >
            <Umbrella className="w-3.5 h-3.5 shrink-0" />
            <div>
              <span className="text-[10px] block opacity-80 leading-none">
                {t.weatherPop}
              </span>
              <span className="font-black text-xs leading-none">
                {pop}%
              </span>
            </div>
          </div>

          {/* Wind & Humidity Mini Block */}
          <div className="p-1.5 rounded-xl bg-white/90 border border-slate-200/80 text-[10px] text-slate-600 space-y-0.5 min-w-[70px]">
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-sky-500 shrink-0" />
              <span className="font-semibold">{weather.windSpeedKmH} km/h</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-teal-500 shrink-0" />
              <span className="font-semibold">{weather.humidity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tourism Planning Advice Box */}
      {weather.tourismAdvice && (
        <div className="mt-1.5 p-2 rounded-lg bg-sky-100/50 border border-sky-200/60 text-[11px] text-slate-700 leading-relaxed flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sky-900 font-bold mr-1">
              {t.weatherAdviceTitle}:
            </strong>
            <span>{weather.tourismAdvice}</span>
          </div>
        </div>
      )}

      {/* Expandable Upcoming Hourly Forecast Strip */}
      {isHourlyOpen && weather.hourly && weather.hourly.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-sky-100 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 px-0.5">
            <span>{t.weatherHourly}</span>
            <span className="text-[9px] text-slate-400 font-normal">
              時間 / 気温 / 降水確率
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-1 text-center">
            {weather.hourly.slice(0, 5).map((hour: HourlyForecastItem, idx: number) => (
              <div
                key={idx}
                className="p-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs space-y-1"
              >
                <p className="text-[10px] font-bold text-slate-500">{hour.time}</p>
                <div className="py-0.5">{renderHourlyIcon(hour.weatherCode)}</div>
                <p className="text-xs font-black text-slate-800">{hour.temp}°</p>
                <p
                  className={`text-[10px] font-bold rounded px-0.5 ${
                    hour.pop >= 40
                      ? 'text-rose-700 bg-rose-50'
                      : hour.pop >= 20
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-sky-700 bg-sky-50'
                  }`}
                >
                  {hour.pop}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
