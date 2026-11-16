import React, { useState, useMemo, useCallback } from 'react';
import { NichinanSpot, OperationInfo, TimeTheme, SpotTimeFilter, SpotCategory, CongestionLevel, LiveCongestionInfo } from '../types';
import { NichinanScenicVisual } from './NichinanScenicVisual';
import { SpotCard } from './SpotCard';
import { calculateLiveCongestion, getSpotDistanceInfo, getNichinanTrafficOverview } from '../services/congestionService';
import { calculateDistanceKm, SPOT_COORDINATES } from '../services/coursePlannerService';
import { storageService } from '../services/storageService';
import {
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CalendarCheck,
  Compass,
  MapPin,
  Filter,
  CheckCircle2,
  Ticket,
  ChevronRight,
  Info,
  HelpCircle,
  Navigation,
  RotateCw,
  Locate,
  AlertCircle,
  Activity,
  ArrowUpDown,
  X,
  Car,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { Language, UI_TRANSLATIONS, getLocalizedSpot } from '../i18n/translations';

interface HomeViewProps {
  operationInfo: OperationInfo;
  spots: NichinanSpot[];
  currentTheme: TimeTheme;
  onGoToBooking: (spot?: NichinanSpot) => void;
  onOpenMyTickets: () => void;
  onOpenHelp?: () => void;
  onOpenCourse: () => void;
  hasMyTickets: boolean;
  currentLanguage?: Language;
}

// Preset departure locations for easy one-click testing or when browser GPS permission is denied
const PRESET_LOCATIONS: { id: string; name: string; lat: number; lng: number }[] = [
  { id: 'nichinan-stn', name: '日南駅', lat: 31.6025, lng: 131.3789 },
  { id: 'miyazaki-apt', name: '宮崎ブーゲンビリア空港', lat: 31.8767, lng: 131.4489 },
  { id: 'obi-castle', name: '飫肥城下町', lat: 31.6288, lng: 131.3524 },
  { id: 'udo-shrine', name: '鵜戸神宮', lat: 31.6508, lng: 131.4667 },
];

export const HomeView: React.FC<HomeViewProps> = ({
  operationInfo,
  spots,
  currentTheme,
  onGoToBooking,
  onOpenMyTickets,
  onOpenHelp,
  onOpenCourse,
  hasMyTickets,
  currentLanguage = 'ja',
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.ja;
  // Tab filter: 'all' | 'day' | 'sunset' | 'night'
  const [timeFilter, setTimeFilter] = useState<SpotTimeFilter>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [favoriteSpotIds, setFavoriteSpotIds] = useState<string[]>(() =>
    storageService.getFavoriteSpotIds()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyReservationRequired, setOnlyReservationRequired] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keep favorites synced across tabs/updates
  React.useEffect(() => {
    const syncFavorites = () => {
      setFavoriteSpotIds(storageService.getFavoriteSpotIds());
    };
    window.addEventListener('nichinan_data_update', syncFavorites);
    window.addEventListener('storage', syncFavorites);
    return () => {
      window.removeEventListener('nichinan_data_update', syncFavorites);
      window.removeEventListener('storage', syncFavorites);
    };
  }, []);

  const handleToggleFavorite = useCallback((spotId: string) => {
    const updated = storageService.toggleFavoriteSpot(spotId);
    setFavoriteSpotIds(updated);
  }, []);

  // Real-time congestion & location states
  const [congestionFilter, setCongestionFilter] = useState<'all' | CongestionLevel>('all');
  const [sortBy, setSortBy] = useState<'default' | 'nearest' | 'least_crowded'>('default');
  const [congestionRefreshVersion, setCongestionRefreshVersion] = useState<number>(0);
  const [isRefreshingCongestion, setIsRefreshingCongestion] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // User location state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    label?: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  // Request user GPS location
  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationNotice({
        type: 'error',
        text: 'お使いのブラウザは位置情報取得に対応していません。下記の代表地点をお選びください。',
      });
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: '現在地（GPS）',
        });
        setIsLocating(false);
        setLocationNotice({
          type: 'success',
          text: '現在地を取得しました！各スポットカードに距離と車での移動時間をリアルタイム表示しています。',
        });
        setSortBy('nearest');
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = '位置情報の取得に失敗しました。';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = '位置情報の利用が許可されていませんでした。下記の代表地点（日南駅・空港など）から選択できます。';
        }
        setLocationNotice({
          type: 'error',
          text: errorMsg,
        });
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, []);

  // Preset location handler
  const handleSelectPresetLocation = (preset: typeof PRESET_LOCATIONS[0]) => {
    setUserLocation({
      latitude: preset.lat,
      longitude: preset.lng,
      label: preset.name,
    });
    setLocationNotice({
      type: 'success',
      text: `出発地を「${preset.name}」に設定しました。各スポットへの距離・移動時間を計算しています。`,
    });
    setSortBy('nearest');
  };

  // Clear location
  const handleClearLocation = () => {
    setUserLocation(null);
    setLocationNotice(null);
    if (sortBy === 'nearest') {
      setSortBy('default');
    }
  };

  // Manual refresh of live congestion
  const handleRefreshCongestion = () => {
    setIsRefreshingCongestion(true);
    setTimeout(() => {
      setCongestionRefreshVersion((v) => v + 1);
      const d = new Date();
      setLastRefreshedAt(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
      );
      setIsRefreshingCongestion(false);
    }, 400);
  };

  // Auto-refresh timer to keep telemetry freshly synced
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCongestionRefreshVersion((v) => v + 1);
      const d = new Date();
      setLastRefreshedAt(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
      );
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  // Congestion mapping for all spots with real-time location & seed
  const congestionMap = useMemo(() => {
    const map = new Map<string, LiveCongestionInfo>();
    spots.forEach((spot) => {
      map.set(
        spot.id,
        calculateLiveCongestion(spot.id, {
          userCoords: userLocation
            ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
            : null,
          refreshSeed: congestionRefreshVersion,
        })
      );
    });
    return map;
  }, [spots, congestionRefreshVersion, userLocation]);

  // Congestion summary counts
  const congestionCounts = useMemo(() => {
    let smooth = 0;
    let moderate = 0;
    let busy = 0;
    spots.forEach((s) => {
      const cong = congestionMap.get(s.id);
      if (cong?.level === 'smooth') smooth++;
      else if (cong?.level === 'moderate') moderate++;
      else if (cong?.level === 'busy') busy++;
    });
    return { smooth, moderate, busy };
  }, [spots, congestionMap]);

  // Filter spots & sort
  const filteredSpots = useMemo(() => {
    const list = spots.filter((spot) => {
      // Bookmarked Favorites filter
      if (onlyFavorites && !favoriteSpotIds.includes(spot.id)) {
        return false;
      }

      // Time suitability filter
      if (timeFilter !== 'all') {
        if (!spot.timeSuitability.includes(timeFilter)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (spot.category !== selectedCategory) {
          return false;
        }
      }

      // Reservation required filter
      if (onlyReservationRequired) {
        if (!spot.requiresReservation) {
          return false;
        }
      }

      // Live Congestion Filter
      if (congestionFilter !== 'all') {
        const cong = congestionMap.get(spot.id);
        if (cong?.level !== congestionFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = spot.name.toLowerCase().includes(q);
        const matchKana = spot.kana.toLowerCase().includes(q);
        const matchArea = spot.area.toLowerCase().includes(q);
        const matchTag = spot.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchKana && !matchArea && !matchTag) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === 'nearest' && userLocation) {
      return [...list].sort((a, b) => {
        const distA = getSpotDistanceInfo(a.id, userLocation)?.distanceKm ?? 9999;
        const distB = getSpotDistanceInfo(b.id, userLocation)?.distanceKm ?? 9999;
        return distA - distB;
      });
    } else if (sortBy === 'least_crowded') {
      const orderWeight: Record<CongestionLevel, number> = {
        smooth: 1,
        moderate: 2,
        busy: 3,
      };
      return [...list].sort((a, b) => {
        const cA = congestionMap.get(a.id)?.level || 'smooth';
        const cB = congestionMap.get(b.id)?.level || 'smooth';
        return orderWeight[cA] - orderWeight[cB];
      });
    }

    return list;
  }, [
    spots,
    onlyFavorites,
    favoriteSpotIds,
    timeFilter,
    selectedCategory,
    onlyReservationRequired,
    congestionFilter,
    searchQuery,
    sortBy,
    userLocation,
    congestionMap,
  ]);

  // Spots requiring reservation for quick-booking highlight
  const reservationSpots = spots.filter((s) => s.requiresReservation);

  // Scroll to spot card handler
  const handleSelectSpotFromSlide = (spotId: string) => {
    const el = document.getElementById(`spot-card-${spotId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-amber-400', 'transition-all');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-amber-400');
      }, 2000);
    }
  };

  const handleBookSpotFromSlide = (spotId: string) => {
    const target = spots.find((s) => s.id === spotId);
    if (target) {
      onGoToBooking(target);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Dynamic Scenic Day & Night Visual with Daytime Real Photo Slide */}
      <section className="relative">
        <NichinanScenicVisual
          theme={currentTheme}
          weatherCondition={operationInfo.weatherCondition}
          sunsetTime={operationInfo.sunsetTime}
          onSelectSpot={handleSelectSpotFromSlide}
          onBookSpot={handleBookSpotFromSlide}
          currentLanguage={currentLanguage}
        />
      </section>

      {/* 2. Today's Nichinan Status & Notice Banner */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                {t.infoBadge}
              </span>
              <span className="text-xs text-slate-500">{t.infoUpdate}: {operationInfo.lastUpdated}</span>
              {onOpenHelp && (
                <button
                  id="btn-home-help-guide"
                  onClick={onOpenHelp}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200 transition-colors ml-auto sm:ml-0 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t.infoHelpBtn}</span>
                </button>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {operationInfo.featuredTheme}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {operationInfo.generalNotice}
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <div className="flex-1 md:flex-none p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-2.5">
              <Sunset className="w-4 h-4 text-orange-600 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-900 font-semibold block">{t.sunsetLabel}</span>
                <span className="text-xs font-black text-amber-950">{operationInfo.sunsetTime} {t.sunsetSuffix}</span>
              </div>
            </div>

            <div className="flex-1 md:flex-none p-3 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-indigo-900 font-semibold block">{t.stargazingLabel}</span>
                <span className="text-xs font-black text-indigo-950">{operationInfo.stargazingForecast}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Ticket Quick Banner if exists */}
        {hasMyTickets && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>{t.ticketSavedNotice}</span>
            </div>
            <button
              onClick={onOpenMyTickets}
              className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t.ticketViewBtn}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* 2.5 Model Course Auto-Suggestion Banner */}
      <section className="bg-gradient-to-r from-teal-700 via-sky-700 to-indigo-800 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-amber-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.courseBadge}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              {t.courseTitle}
            </h3>
            <p className="text-xs text-sky-100 leading-relaxed font-medium">
              {t.courseDesc}
            </p>
          </div>

          <button
            id="btn-home-open-course"
            onClick={onOpenCourse}
            className="shrink-0 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>{t.courseCreateBtn}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 3. Pre-booking Highlights Carousel / Quick Section */}
      <section className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-teal-500/10 rounded-3xl p-5 border border-amber-200/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              {t.prebookingTitle}
            </h3>
          </div>
          <span className="text-xs text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-full">
            {t.prebookingBadge}
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          {t.prebookingDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reservationSpots.slice(0, 3).map((spot) => {
            const locSpot = getLocalizedSpot(spot, currentLanguage);
            return (
              <div
                key={spot.id}
                className="bg-white rounded-xl p-3.5 border border-slate-200/80 flex items-start justify-between gap-3 shadow-xs hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {spot.imageUrl ? (
                      <img
                        src={spot.imageUrl}
                        alt={locSpot.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-xl bg-amber-50">
                        {spot.imageEmoji}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{locSpot.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{locSpot.area}</p>
                    <p className="text-xs font-extrabold text-amber-700 mt-1">
                      ¥{spot.reservationPriceAdult?.toLocaleString()}〜{' '}
                      <span className="text-[10px] font-normal text-slate-500">{t.adultUnit}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onGoToBooking(locSpot)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {t.bookNowBtn}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Day & Night Tourism Spots Showcase & Interactive Filter */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🗺️</span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {t.spotsTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.spotsSubtitle}
            </p>
          </div>

          {/* Result Count */}
          <span className="text-xs text-slate-500 font-semibold">
            {t.matchingCount} <strong className="text-sky-700 font-bold text-sm">{filteredSpots.length}</strong> {t.itemsCount}
          </span>
        </div>

        {/* Primary Filter Tabs: All / Day / Sunset / Night / Favorites */}
        <div className="bg-slate-200/60 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto shadow-inner">
          <button
            onClick={() => {
              setOnlyFavorites(false);
              setTimeFilter('all');
            }}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              !onlyFavorites && timeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>{t.tabAll}</span>
          </button>

          <button
            onClick={() => {
              setOnlyFavorites(false);
              setTimeFilter('day');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              !onlyFavorites && timeFilter === 'day'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.tabDay}</span>
          </button>

          <button
            onClick={() => {
              setOnlyFavorites(false);
              setTimeFilter('sunset');
            }}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              !onlyFavorites && timeFilter === 'sunset'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
            <span>{t.tabSunset}</span>
          </button>

          <button
            onClick={() => {
              setOnlyFavorites(false);
              setTimeFilter('night');
            }}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              !onlyFavorites && timeFilter === 'night'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
            <span>{t.tabNight}</span>
          </button>

          <button
            id="tab-filter-favorites"
            onClick={() => {
              setOnlyFavorites(true);
              setTimeFilter('all');
            }}
            className={`flex-1 min-w-[125px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              onlyFavorites
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-rose-700 hover:bg-white/60'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                onlyFavorites ? 'fill-white text-white' : 'fill-rose-100 text-rose-500'
              }`}
            />
            <span>{t.tabFavorites}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                onlyFavorites
                  ? 'bg-white/25 text-white'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {favoriteSpotIds.length}
            </span>
          </button>
        </div>

        {/* Sub-Filters: Category & Reservation Only & Search */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-semibold text-[11px] shrink-0">{t.categoryLabel}</span>
            {[
              { id: 'all', label: t.catAll },
              { id: 'sightseeing', label: t.catSightseeing },
              { id: 'experience', label: t.catExperience },
              { id: 'historic', label: t.catHistoric },
              { id: 'gourmet', label: t.catGourmet },
              { id: 'onsen', label: t.catOnsen },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Reservation Toggle & Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-bold">
              <input
                type="checkbox"
                checked={onlyReservationRequired}
                onChange={(e) => setOnlyReservationRequired(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-amber-800">{t.reservationOnly}</span>
            </label>

            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 w-36 sm:w-44"
            />
          </div>
        </div>

        {/* Real-time Congestion & Location Live Console */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-700/60 space-y-3.5">
          {/* Header Row: Title & Congestion Refresh Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Activity className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    {t.consoleTitle}
                  </h3>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono border border-slate-700">
                    {lastRefreshedAt} {t.infoUpdate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t.consoleDesc}
                </p>
              </div>
            </div>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={handleRefreshCongestion}
              disabled={isRefreshingCongestion}
              className="shrink-0 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer hover:text-white"
              title={t.refreshBtn}
            >
              <RotateCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshingCongestion ? 'animate-spin' : ''}`} />
              <span>{isRefreshingCongestion ? t.refreshing : t.refreshBtn}</span>
            </button>
          </div>

          {/* Row 1: Congestion Level Quick Filter Chips */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>{t.filterLabel}</span>
            </span>

            <button
              type="button"
              onClick={() => setCongestionFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                congestionFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {t.filterAll} ({spots.length})
            </button>

            <button
              type="button"
              onClick={() => setCongestionFilter(congestionFilter === 'smooth' ? 'all' : 'smooth')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                congestionFilter === 'smooth'
                  ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300'
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-700/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.filterSmooth} ({congestionCounts.smooth})</span>
            </button>

            <button
              type="button"
              onClick={() => setCongestionFilter(congestionFilter === 'moderate' ? 'all' : 'moderate')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                congestionFilter === 'moderate'
                  ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-300'
                  : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 border border-amber-700/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{t.filterModerate} ({congestionCounts.moderate})</span>
            </button>

            <button
              type="button"
              onClick={() => setCongestionFilter(congestionFilter === 'busy' ? 'all' : 'busy')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                congestionFilter === 'busy'
                  ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-300'
                  : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-700/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>{t.filterBusy} ({congestionCounts.busy})</span>
            </button>
          </div>

          {/* Row 2: Location Status & Preset Departure Selector */}
          <div className="pt-2 border-t border-slate-800/80">
            {userLocation ? (
              <div className="bg-sky-950/60 border border-sky-600/40 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="font-bold text-sky-200">
                      {t.locationActive} {userLocation.label || 'GPS'}
                    </span>
                    <span className="text-[11px] text-sky-300/80 block sm:inline sm:ml-2">
                      {t.locationCalculating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleRequestLocation}
                    disabled={isLocating}
                    className="px-2.5 py-1 rounded-lg bg-sky-900/80 hover:bg-sky-800 text-sky-200 font-bold border border-sky-600/50 transition-colors cursor-pointer"
                  >
                    {isLocating ? t.locationLocating : t.locationReacquire}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Clear location"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                {/* GPS Get Button */}
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={isLocating}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? t.locationLocating : t.locationGetBtn}</span>
                </button>

                {/* Preset Options for quick test */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="text-slate-400 text-[11px] shrink-0">{t.presetLabel}</span>
                  {PRESET_LOCATIONS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPresetLocation(preset)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Location Notice/Alert */}
            {locationNotice && (
              <div
                className={`mt-2 p-2 rounded-lg text-xs flex items-center justify-between gap-2 ${
                  locationNotice.type === 'error'
                    ? 'bg-rose-950/80 text-rose-200 border border-rose-800'
                    : 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{locationNotice.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLocationNotice(null)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Row: Google Maps Real-Time Highway Traffic & Coastal Arteries */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-400" />
                <span>Googleマップ連携 主要幹線・道路リアルタイム交通状況</span>
              </span>

              {/* Direct Link to Google Maps Live Traffic */}
              <a
                href={
                  userLocation
                    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=31.62,131.40&travelmode=driving`
                    : 'https://www.google.com/maps/@31.62,131.40,12z/data=!5m1!1e1'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white bg-sky-900/60 hover:bg-sky-800/80 px-2.5 py-1 rounded-lg border border-sky-600/50 transition-colors"
                title="Googleマップで日南全域の渋滞・混雑レイヤーを全画面で開く"
              >
                <span>Googleマップ交通状況を開く</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {getNichinanTrafficOverview(congestionRefreshVersion).map((highway, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-slate-200 truncate">{highway.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        highway.status === 'congested'
                          ? 'bg-rose-900/80 text-rose-300'
                          : highway.status === 'moderate'
                          ? 'bg-amber-900/80 text-amber-300'
                          : 'bg-emerald-900/80 text-emerald-300'
                      }`}
                    >
                      {highway.speedKmH}km/h
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{highway.statusText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Sort Selector Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px] font-semibold">{t.sortLabel}</span>
              <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setSortBy('default')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    sortBy === 'default'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.sortDefault}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!userLocation) {
                      handleRequestLocation();
                    } else {
                      setSortBy('nearest');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    sortBy === 'nearest'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={userLocation ? t.sortNearest : t.sortNearestNeedsGps}
                >
                  {t.sortNearest} {userLocation ? '' : t.sortNearestNeedsGps}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('least_crowded')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    sortBy === 'least_crowded'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.sortLeastCrowded}
                </button>
              </div>
            </div>

            {/* Active filtered count */}
            <span className="text-[11px] text-slate-400">
              {t.displayCount} <strong className="text-white font-bold">{filteredSpots.length}</strong> / {spots.length} {t.itemsCount}
            </span>
          </div>
        </div>

        {/* Active Bookmarked Spots Filtered View Banner */}
        {onlyFavorites && (
          <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">
                    {t.favoritesBannerTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                    {favoriteSpotIds.length} {t.itemsCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{t.favoritesBannerDesc}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOnlyFavorites(false)}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              {t.showAllSpotsBtn}
            </button>
          </div>
        )}

        {/* Spot Cards Grid */}
        {filteredSpots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                currentTheme={currentTheme}
                onBookSpot={(s) => onGoToBooking(s)}
                liveCongestion={congestionMap.get(spot.id)}
                userLocation={userLocation}
                onRequestLocation={handleRequestLocation}
                currentLanguage={currentLanguage}
                isFavorite={favoriteSpotIds.includes(spot.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
            {onlyFavorites && favoriteSpotIds.length === 0 ? (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {t.noFavoritesFound}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t.noFavoritesHint}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOnlyFavorites(false);
                    setTimeFilter('all');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                >
                  {t.showAllSpotsBtn}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-600">
                  {t.noSpotsFound}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {t.noSpotsHint}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOnlyFavorites(false);
                    setTimeFilter('all');
                    setSelectedCategory('all');
                    setOnlyReservationRequired(false);
                    setCongestionFilter('all');
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold hover:bg-sky-200 cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
