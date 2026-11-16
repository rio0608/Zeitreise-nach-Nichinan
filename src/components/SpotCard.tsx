import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  Navigation,
  Heart,
  Users,
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
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);

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

  // Google Maps Directions URL from current location
  const directionsFromCurrentLocationUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${encodeURIComponent(spot.googleMapQuery)}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot.googleMapQuery)}&travelmode=driving`;

  // Localized congestion status text
  const localizedStatusText =
    congestion.level === 'smooth'
      ? t.statusSmooth
      : congestion.level === 'moderate'
      ? t.statusModerate
      : t.statusBusy;

  const congestionStatusColor =
    congestion.level === 'smooth'
      ? 'text-emerald-700'
      : congestion.level === 'moderate'
      ? 'text-amber-700'
      : 'text-rose-700';

  const congestionOverlayClass =
    congestion.level === 'smooth'
      ? 'bg-emerald-600/90 text-white border-emerald-400/40'
      : congestion.level === 'moderate'
      ? 'bg-amber-600/90 text-white border-amber-400/40'
      : 'bg-rose-600/90 text-white border-rose-400/40';

  return (
    <div
      id={`spot-card-${spot.id}`}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all overflow-hidden"
    >
      {/* Spot Photograph Banner */}
      {spot.imageUrl && (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={spot.imageUrl}
            alt={localizedSpot.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/35 pointer-events-none" />

          {/* Top Left: Category */}
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-bold text-white bg-black/55 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/15">
              {localizedSpot.categoryLabel}
            </span>
          </div>

          {/* Top Right: Live Congestion + Favorite Heart */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-xs border shadow-xs ${congestionOverlayClass}`}
            >
              <span>{localizedStatusText}</span>
            </span>

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

          {/* Bottom Overlay: Area & Distance */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-white text-xs">
            <span className="font-semibold flex items-center gap-1 drop-shadow-md truncate">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{localizedSpot.area}</span>
            </span>

            {distanceInfo ? (
              <span className="text-[11px] font-bold bg-sky-950/85 border border-sky-400/40 text-sky-100 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 shrink-0 tabular-nums">
                <Navigation className="w-3 h-3 text-sky-300" />
                <span>{distanceInfo.distanceKm}km</span>
                <span className="text-white/80">
                  ({distanceInfo.carMinutes}
                  {t.distMin})
                </span>
              </span>
            ) : onRequestLocation ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestLocation();
                }}
                className="text-[11px] font-semibold text-sky-100 hover:text-white bg-black/55 hover:bg-black/75 px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-white/20 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title={t.measureDistBtn}
              >
                <Navigation className="w-2.5 h-2.5 text-sky-300" />
                <span>{t.measureDistBtn}</span>
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          {/* Header: Title & Quick Reservation / Favorite fallback */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {!spot.imageUrl && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-sky-700">{localizedSpot.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{localizedSpot.area}</span>
                </div>
              )}
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">
                {spot.imageEmoji} {localizedSpot.name}
              </h3>
            </div>

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
                className={`p-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-300 text-rose-500'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
          </div>

          {/* Unboxed Quiet Metadata Row (Hours + Reservation requirement) */}
          <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-slate-600">
            <span
              className={`font-bold ${
                spot.requiresReservation ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {spot.requiresReservation ? t.requiresBooking : t.freeAdmission}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[230px]">{localizedSpot.hours}</span>
            </span>
          </div>

          {/* Concise 2-Line Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {localizedSpot.description}
          </p>

          {/* Clean Compact Live Summary (Congestion + Weather in 2 uncluttered lines) */}
          <div className="pt-2.5 pb-1 border-t border-slate-100 space-y-2">
            {/* Congestion 1-Line Summary */}
            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
              <div className="flex items-center gap-1.5 min-w-0">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className={`font-bold ${congestionStatusColor}`}>
                  {localizedStatusText}
                </span>
                <span className="text-slate-500">({congestion.crowdPercentage}%)</span>
              </div>
              <span className="text-[11px] text-slate-500 shrink-0">
                {congestion.waitingMinutesEstimate > 0
                  ? `${t.waitEstimated}${congestion.waitingMinutesEstimate}${t.distMin}`
                  : t.waitNone}
              </span>
            </div>

            {/* Live Weather Summary (Compact when collapsed, Full when expanded) */}
            <SpotWeatherWidget
              spotId={spot.id}
              currentLanguage={currentLanguage}
              compact={!isDetailsExpanded}
            />
          </div>

          {/* Expandable Detailed Info Section */}
          {isDetailsExpanded && (
            <div className="pt-2 border-t border-slate-100 space-y-3 text-xs">
              {/* Parking & Google Maps Live Traffic Info */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-slate-700">🅿️ {congestion.parkingText}</span>
                  <a
                    href={congestion.googleMapsTrafficUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:text-sky-900 font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Googleマップ交通状況</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {congestion.congestionReason && (
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {congestion.congestionReason}
                  </p>
                )}
              </div>

              {/* Day & Night Highlights */}
              <div className="space-y-2">
                <div
                  className={`p-2.5 rounded-xl border ${
                    currentTheme === 'day'
                      ? 'bg-sky-50/70 border-sky-200 text-slate-800'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sky-800 mb-0.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{t.dayHighlightLabel}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">
                    {localizedSpot.daytimeHighlight}
                  </p>
                </div>

                <div
                  className={`p-2.5 rounded-xl border ${
                    currentTheme === 'night' || currentTheme === 'sunset'
                      ? 'bg-indigo-50/70 border-indigo-200 text-slate-800'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-indigo-800 mb-0.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{t.nightHighlightLabel}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">
                    {localizedSpot.nighttimeHighlight}
                  </p>
                </div>
              </div>

              {/* Night Hours & Clean Unboxed Tags */}
              {localizedSpot.nightHours && (
                <div className="text-indigo-700 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>
                    {t.nightHoursLabel} {localizedSpot.nightHours}
                  </span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 leading-relaxed">
                {localizedSpot.tags.map((tag: string, idx: number) => (
                  <span key={idx}>
                    #{tag}
                    {idx < localizedSpot.tags.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Details Button */}
          <button
            id={`btn-toggle-details-${spot.id}`}
            type="button"
            onClick={() => setIsDetailsExpanded((prev) => !prev)}
            className="w-full py-1.5 px-2 rounded-lg text-xs font-bold text-sky-700 hover:text-sky-900 hover:bg-sky-50/70 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isDetailsExpanded ? t.hideSpotDetails : t.showSpotDetails}</span>
            {isDetailsExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Clear & Prominent Action Buttons Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-50/90 border-t border-slate-200/80 space-y-2">
        {/* Map & Route Buttons (Large, distinct, easy to tap) */}
        <div className="grid grid-cols-2 gap-2">
          <a
            id={`link-google-maps-route-${spot.id}`}
            href={directionsFromCurrentLocationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
            title={t.routeFromCurrentLocationTitle}
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t.routeFromCurrentLocation}</span>
          </a>

          <a
            id={`link-google-maps-spot-${spot.id}`}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.googleMapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-colors whitespace-nowrap"
            title={t.viewMap}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{t.viewMap}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>
        </div>

        {/* Booking Action CTA (Full-width when reservation is needed) */}
        {spot.requiresReservation ? (
          <button
            id={`btn-book-spot-${spot.id}`}
            type="button"
            onClick={() => onBookSpot(localizedSpot)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <CalendarCheck className="w-4 h-4 shrink-0" />
            <span>{t.bookTicket}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        ) : (
          <div className="text-[11px] text-slate-500 font-medium text-center pt-0.5">
            {t.noBookingNeeded}
          </div>
        )}
      </div>
    </div>
  );
};
