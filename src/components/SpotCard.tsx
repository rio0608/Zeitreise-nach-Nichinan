import React from 'react';
import { NichinanSpot, TimeTheme, LiveCongestionInfo } from '../types';
import { calculateLiveCongestion, getSpotDistanceInfo } from '../services/congestionService';
import { Language, UI_TRANSLATIONS, getLocalizedSpot } from '../i18n/translations';
import { SpotWeatherWidget } from './SpotWeatherWidget';
import {
  MapPin,
  Clock,
  ExternalLink,
  CalendarCheck,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  Navigation,
  Car,
  Footprints,
  Users,
  Heart,
} from 'lucide-react';

interface SpotCardProps {
  spot: NichinanSpot;
  currentTheme: TimeTheme;
  onBookSpot: (spot: NichinanSpot) => void;
  liveCongestion?: LiveCongestionInfo;
  userLocation?: { latitude: number; longitude: number } | null;
  onRequestLocation?: () => void;
  currentLanguage?: Language;
  isFavorite?: boolean;
  onToggleFavorite?: (spotId: string) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  currentTheme,
  onBookSpot,
  liveCongestion,
  userLocation,
  onRequestLocation,
  currentLanguage = 'ja',
  isFavorite = false,
  onToggleFavorite,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.ja;
  const localizedSpot = getLocalizedSpot(spot, currentLanguage);

  // Use provided live congestion or compute real-time default with user location
  const congestion =
    liveCongestion ||
    calculateLiveCongestion(spot.id, {
      userCoords: userLocation
        ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
        : null,
    });

  // Compute distance from user location
  const distanceInfo = userLocation ? getSpotDistanceInfo(spot.id, userLocation) : null;

  // Localized congestion status text
  const localizedStatusText =
    congestion.level === 'smooth'
      ? t.statusSmooth
      : congestion.level === 'moderate'
      ? t.statusModerate
      : t.statusBusy;

  // Congestion Badge Component
  const renderCongestionBadge = (isOverlay = false) => {
    switch (congestion.level) {
      case 'smooth':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
              isOverlay
                ? 'bg-emerald-600/90 text-white backdrop-blur-xs border border-emerald-400/40'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
            }`}
            title={localizedStatusText}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.statusSmooth}</span>
          </span>
        );
      case 'moderate':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
              isOverlay
                ? 'bg-amber-600/90 text-white backdrop-blur-xs border border-amber-400/40'
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}
            title={localizedStatusText}
          >
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span>{t.statusModerate}</span>
          </span>
        );
      case 'busy':
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
              isOverlay
                ? 'bg-rose-600/90 text-white backdrop-blur-xs border border-rose-400/40'
                : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}
            title={localizedStatusText}
          >
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping" />
            <span>{t.statusBusy}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`spot-card-${spot.id}`}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all overflow-hidden"
    >
      {/* Spot Real Photograph Banner if available */}
      {spot.imageUrl && (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={spot.imageUrl}
            alt={localizedSpot.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
            }}
          />
          {/* Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/35 pointer-events-none" />

          {/* Top Left: Category */}
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20">
              {localizedSpot.categoryLabel}
            </span>
          </div>

          {/* Top Right: Live Congestion Badge & Favorite Heart Button */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {renderCongestionBadge(true)}
            {onToggleFavorite && (
              <button
                id={`btn-favorite-${spot.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(spot.id);
                }}
                aria-label={isFavorite ? t.removeFromFavorites : t.addToFavorites}
                aria-pressed={isFavorite}
                title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
                className={`p-2 rounded-full backdrop-blur-md border transition-all shadow-sm cursor-pointer active:scale-90 ${
                  isFavorite
                    ? 'bg-rose-500/95 border-rose-300 text-white hover:bg-rose-600'
                    : 'bg-black/45 border-white/30 text-white hover:bg-black/65 hover:border-rose-300/80'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    isFavorite ? 'fill-white text-white scale-110' : 'text-white'
                  }`}
                />
              </button>
            )}
          </div>

          {/* Bottom Overlay: Area & Distance info */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold flex items-center gap-1 drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {localizedSpot.area}
            </span>

            {/* Distance from user */}
            {distanceInfo ? (
              <span className="text-[11px] font-bold bg-sky-950/80 border border-sky-400/40 text-sky-200 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                <Navigation className="w-3 h-3 text-sky-300" />
                <span>{t.distFromLocation}{distanceInfo.distanceKm}km</span>
                <span className="text-white/80">{t.distCar}{distanceInfo.carMinutes}{t.distMin}</span>
              </span>
            ) : onRequestLocation ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestLocation();
                }}
                className="text-[10px] font-medium text-sky-200 hover:text-white bg-black/50 hover:bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/20 transition-colors flex items-center gap-1 cursor-pointer"
                title={t.measureDistBtn}
              >
                <Navigation className="w-2.5 h-2.5 text-sky-300" />
                <span>{t.measureDistBtn}</span>
              </button>
            ) : null}
          </div>
        </div>
      )}

      <div>
        {/* Card Header Top */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {spot.imageEmoji}
              </span>
              <div>
                {!spot.imageUrl && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                      {localizedSpot.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {localizedSpot.area}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {localizedSpot.name}
                </h3>
              </div>
            </div>

            {/* Reservation Badge, Fallback Congestion & Fallback Favorite if no image */}
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5">
                {!spot.imageUrl && onToggleFavorite && (
                  <button
                    id={`btn-favorite-fallback-${spot.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(spot.id);
                    }}
                    aria-label={isFavorite ? t.removeFromFavorites : t.addToFavorites}
                    aria-pressed={isFavorite}
                    title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer active:scale-90 ${
                      isFavorite
                        ? 'bg-rose-50 border-rose-300 text-rose-500 hover:bg-rose-100'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>
                )}
                {spot.requiresReservation ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold shadow-xs">
                    <CalendarCheck className="w-3 h-3 text-amber-600" />
                    {t.requiresBooking}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    {t.freeAdmission}
                  </span>
                )}
              </div>
              {!spot.imageUrl && renderCongestionBadge(false)}
            </div>
          </div>

          <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {localizedSpot.description}
          </p>

          {/* Real-time Status Information Strip with Telemetry & Google Maps Link */}
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500 text-[11px] font-semibold">{t.liveStatusLabel}</span>
                <span className="font-extrabold text-slate-900 text-xs">{localizedStatusText}</span>
                {/* Dynamic Crowd Gauge */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-black tracking-tight ${
                    congestion.level === 'busy'
                      ? 'bg-rose-100 text-rose-800'
                      : congestion.level === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {congestion.crowdPercentage}% 混雑度
                </span>
                {congestion.waitingMinutesEstimate > 0 ? (
                  <span className="text-[11px] text-amber-700 font-medium">
                    （{t.waitEstimated}{congestion.waitingMinutesEstimate}{t.distMin}）
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-medium">（{t.waitNone}）</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="font-semibold text-slate-500">
                  {congestion.trend === 'increasing'
                    ? '↗ 増加傾向'
                    : congestion.trend === 'decreasing'
                    ? '↘ 緩和傾向'
                    : '→ 安定'}
                </span>
                <span>•</span>
                <span>{t.updateTime} {congestion.lastUpdated}</span>
              </div>
            </div>

            {/* Parking Telemetry & Quick Google Maps Live Traffic Link */}
            <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between gap-2 text-[11px] text-slate-600 flex-wrap">
              <span className="font-bold text-slate-700">
                🅿️ {congestion.parkingText}
              </span>
              <a
                href={congestion.googleMapsTrafficUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 hover:underline"
                title="Googleマップでこのスポットの最新道路状況とルートを確認"
              >
                <span>Googleマップ交通状況</span>
                <ExternalLink className="w-3 h-3 text-sky-500" />
              </a>
            </div>

            {congestion.congestionReason && (
              <p className="text-[11px] text-slate-500 leading-tight">
                💡 {congestion.congestionReason}
              </p>
            )}
          </div>
        </div>

        {/* Spot Real-Time Weather & Precipitation Forecast */}
        <div className="px-5 pt-1 pb-1.5">
          <SpotWeatherWidget spotId={spot.id} currentLanguage={currentLanguage} />
        </div>

        {/* Day & Night Highlights Comparison Box */}
        <div className="px-5 py-2.5 space-y-2">
          {/* Day Highlight */}
          <div
            className={`p-2.5 rounded-xl border transition-colors ${
              currentTheme === 'day'
                ? 'bg-sky-50/80 border-sky-200 text-slate-800 shadow-xs ring-1 ring-sky-300/40'
                : 'bg-slate-50 border-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 mb-0.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.dayHighlightLabel}</span>
            </div>
            <p className="text-xs text-slate-600 leading-snug pl-5">{localizedSpot.daytimeHighlight}</p>
          </div>

          {/* Night Highlight */}
          <div
            className={`p-2.5 rounded-xl border transition-colors ${
              currentTheme === 'night' || currentTheme === 'sunset'
                ? 'bg-indigo-950/5 border-indigo-200 text-slate-800 shadow-xs ring-1 ring-indigo-300/40'
                : 'bg-slate-50 border-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-0.5">
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.nightHighlightLabel}</span>
            </div>
            <p className="text-xs text-slate-600 leading-snug pl-5">{localizedSpot.nighttimeHighlight}</p>
          </div>
        </div>

        {/* Practical Info (Hours, Tags) */}
        <div className="px-5 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {localizedSpot.hours}
          </span>
          {localizedSpot.nightHours && (
            <span className="text-indigo-700 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              {t.nightHoursLabel} {localizedSpot.nightHours}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="px-5 pt-1 pb-3 flex flex-wrap gap-1">
          {localizedSpot.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* External Map Link with Route if location exists */}
        <a
          href={
            userLocation
              ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${encodeURIComponent(spot.googleMapQuery)}&travelmode=driving`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.googleMapQuery)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-600 hover:text-sky-700 font-medium flex items-center gap-1 py-1"
          title={userLocation ? t.routeGuidance : t.viewMap}
        >
          <Navigation className="w-3 h-3 text-sky-600" />
          <span>{userLocation ? t.routeGuidance : t.viewMap}</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Booking or View Action */}
        {spot.requiresReservation ? (
          <button
            type="button"
            onClick={() => onBookSpot(localizedSpot)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all group-hover:scale-[1.02] cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{t.bookTicket}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        ) : (
          <span className="text-xs text-slate-500 font-medium">{t.noBookingNeeded}</span>
        )}
      </div>
    </div>
  );
};
