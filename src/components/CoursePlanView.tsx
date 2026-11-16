import React, { useState, useEffect } from 'react';
import {
  NichinanSpot,
  ModelCourse,
  StartLocationId,
  TransportMode,
  TripDuration,
  TripPreference,
} from '../types';
import {
  START_LOCATION_PRESETS,
  CURATED_PRESET_COURSES,
  generateSmartCourse,
  generateGoogleMapsRouteUrl,
  findNearestPreset,
} from '../services/coursePlannerService';
import {
  MapPin,
  Navigation,
  Compass,
  Clock,
  Car,
  Bus,
  Bike,
  Sparkles,
  CalendarCheck,
  ExternalLink,
  ChevronRight,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Sun,
  Sunset,
  Moon,
  ChevronLeft,
  Info,
} from 'lucide-react';

import { Language, getLocalizedSpot } from '../i18n/translations';
import { SpotWeatherWidget } from './SpotWeatherWidget';

interface CoursePlanViewProps {
  spots: NichinanSpot[];
  onBack: () => void;
  onGoToBooking: (spot?: NichinanSpot) => void;
  onSelectSpotDetail?: (spotId: string) => void;
  currentLanguage?: Language;
}

export const CoursePlanView: React.FC<CoursePlanViewProps> = ({
  spots,
  onBack,
  onGoToBooking,
  onSelectSpotDetail,
  currentLanguage = 'ja',
}) => {
  // Generator Inputs
  const [startLocationId, setStartLocationId] = useState<StartLocationId>('miyazaki_airport');
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('');
  const [isGettingGps, setIsGettingGps] = useState<boolean>(false);

  const [duration, setDuration] = useState<TripDuration>('full_day');
  const [transport, setTransport] = useState<TransportMode>('car');
  const [preferences, setPreferences] = useState<TripPreference[]>(['scenic', 'gourmet']);

  // Selected Active Course (Defaults to Classic 1-Day Course)
  const [activeCourse, setActiveCourse] = useState<ModelCourse>(CURATED_PRESET_COURSES[0]);
  const [selectedCuratedId, setSelectedCuratedId] = useState<string>(CURATED_PRESET_COURSES[0].id);

  // Copy notification state
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Toggle preference helper
  const handleTogglePreference = (pref: TripPreference) => {
    if (preferences.includes(pref)) {
      if (preferences.length > 1) {
        setPreferences(preferences.filter((p) => p !== pref));
      }
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  // GPS Geolocation Handler
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('お使いのブラウザは位置情報に対応していません。');
      return;
    }

    setIsGettingGps(true);
    setGpsStatus('現在地（GPS）を取得中...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setGpsCoords(coords);
        setStartLocationId('current_gps');

        const { preset, distanceKm } = findNearestPreset(coords.latitude, coords.longitude);
        setGpsStatus(`現在地を検出しました（最寄エリア: ${preset.shortLabel} / 直線約${distanceKm}km）`);
        setIsGettingGps(false);

        // Auto-generate course from GPS immediately
        const newCourse = generateSmartCourse({
          startLocationId: 'current_gps',
          gpsCoords: coords,
          duration,
          transport,
          preferences,
        });
        setActiveCourse(newCourse);
        setSelectedCuratedId('');
      },
      (err) => {
        setIsGettingGps(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('位置情報の利用が許可されませんでした。下の候補から出発地を選択してください。');
        } else {
          setGpsStatus('位置情報の取得に失敗しました。下の候補から出発地を選択してください。');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Generate Smart Course Button Handler
  const handleGenerateCourse = () => {
    const newCourse = generateSmartCourse({
      startLocationId,
      gpsCoords: startLocationId === 'current_gps' && gpsCoords ? gpsCoords : undefined,
      duration,
      transport,
      preferences,
    });
    setActiveCourse(newCourse);
    setSelectedCuratedId('');

    // Smooth scroll down to course result
    setTimeout(() => {
      document.getElementById('course-result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Select Curated Preset
  const handleSelectCuratedPreset = (course: ModelCourse) => {
    setActiveCourse(course);
    setSelectedCuratedId(course.id);
  };

  // Copy Itinerary Text
  const handleCopyItinerary = () => {
    const lines = [
      `【日南観光モデルコース】${activeCourse.title}`,
      `所要時間: ${activeCourse.estimatedTotalHours} | 移動距離: 約${activeCourse.totalDistanceKm}km | 推奨: ${activeCourse.recommendedTransport}`,
      `コース概要: ${activeCourse.catchphrase}`,
      '',
      '■ タイムスケジュール:',
      ...activeCourse.steps.map((step, idx) => {
        const s = spots.find((spot) => spot.id === step.spotId);
        return `${idx + 1}. [${step.timeSlot}] ${s?.name || step.spotId} (${s?.area})\n   - ${step.activityNote}\n   - ${step.transferNoteBefore || ''}`;
      }),
      '',
      `Googleマップルート: ${generateGoogleMapsRouteUrl(activeCourse.startLocationName, activeCourse.steps.map((s) => s.spotId))}`,
      '#ときめぐり日南 #日南観光 #宮崎旅行',
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Spot lookup helper
  const getSpot = (spotId: string) => spots.find((s) => s.id === spotId);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200 transition-colors shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ホームへ戻る</span>
        </button>

        <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
          🗺️ 日南モデルコース自動提案
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-300 via-yellow-200 to-orange-200 border border-amber-300/80 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/35 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-amber-900 text-xs font-bold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>現在地＆好みから最短・最適ルートを即時作成</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-950">
            日南 観光モデルコース自動提案
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            現在地や出発場所、滞在時間、旅のテーマを選ぶだけで、日南の絶景・名物グルメ・歴史スポットをスムーズに巡るあなただけのモデルコースを瞬時に組み立てます。
          </p>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: COURSE GENERATION FORM
         ========================================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            <span>あなたの条件を入力してコースを生成</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            現在地やお好みに合わせてカスタマイズできます
          </p>
        </div>

        {/* 1. STARTING LOCATION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <span>出発地 または 現在地</span>
            </label>

            {/* GPS Button */}
            <button
              type="button"
              onClick={handleGetGpsLocation}
              disabled={isGettingGps}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-colors shadow-xs disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-sky-600 ${isGettingGps ? 'animate-spin' : ''}`} />
              <span>{isGettingGps ? '位置取得中...' : '📍 現在地（GPS）から探す'}</span>
            </button>
          </div>

          {gpsStatus && (
            <p className="text-xs text-sky-700 bg-sky-50/80 p-2 rounded-xl border border-sky-100 font-medium">
              {gpsStatus}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {START_LOCATION_PRESETS.map((preset) => {
              const isSelected = startLocationId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setStartLocationId(preset.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{preset.shortLabel}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. DURATION & TRANSPORT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <span>滞在時間・ボリューム</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'half_day', label: '半日', desc: '約3〜4時間' },
                { id: 'full_day', label: '1日満喫', desc: '約6〜8時間' },
                { id: 'night_stay', label: '夕景〜夜', desc: '星空＆夜温泉' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDuration(item.id as TripDuration)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    duration === item.id
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black flex items-center justify-center">
                3
              </span>
              <span>移動手段</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'car', label: 'レンタカー・車', icon: Car },
                { id: 'bus', label: 'バス・公共交通', icon: Bus },
                { id: 'bicycle', label: '自転車・E-Bike', icon: Bike },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = transport === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTransport(item.id as TransportMode)}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. TRAVEL PREFERENCES / THEMES */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black flex items-center justify-center">
              4
            </span>
            <span>旅の好み・楽しみたいこと（複数選択可）</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'scenic', label: '🌊 絶景オーシャンビュー＆モアイ' },
              { id: 'historic', label: '🏯 九州の小京都・歴史と武家屋敷' },
              { id: 'gourmet', label: '🐟 一本釣りカツオ＆名物グルメ' },
              { id: 'night_stars', label: '🌙 夕景サンセット＆星空露天風呂' },
              { id: 'activity', label: '🛶 クリアSUP＆猪八重渓谷森林浴' },
              { id: 'family', label: '👨‍👩‍👧‍👦 ファミリー・子どもと楽しむ' },
            ].map((theme) => {
              const isSelected = preferences.includes(theme.id as TripPreference);
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleTogglePreference(theme.id as TripPreference)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {theme.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerateCourse}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-teal-600 to-amber-500 hover:from-sky-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>この条件であなただけのモデルコースを自動生成</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: POPULAR CURATED PRESET COURSES QUICK PICK
         ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>✨ 定番＆おすすめのモデルコースから選ぶ</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">全4コース</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CURATED_PRESET_COURSES.map((course) => {
            const isSelected = selectedCuratedId === course.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => handleSelectCuratedPreset(course)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/50 shadow-md ring-2 ring-amber-400/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                    <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      {course.durationLabel}
                    </span>
                    <span className="text-slate-500 font-medium">{course.estimatedTotalHours}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {course.catchphrase}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>{course.recommendedTransport}</span>
                  <span className="text-sky-700 font-bold flex items-center gap-0.5">
                    表示 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ACTIVE MODEL COURSE RESULT DETAILS
         ========================================================================= */}
      <section
        id="course-result-section"
        className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 sm:p-7 space-y-6"
      >
        {/* Course Banner Header */}
        <div className="space-y-3 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-white bg-sky-700 px-3 py-1 rounded-full">
                {activeCourse.durationLabel}
              </span>
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                出発: {activeCourse.startLocationName}
              </span>
            </div>

            {/* Quick Actions: Google Maps & Copy */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyItinerary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title="旅程テキストをクリップボードにコピー"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{isCopied ? 'コピー完了！' : '旅程をコピー'}</span>
              </button>

              <a
                href={generateGoogleMapsRouteUrl(
                  activeCourse.startLocationName,
                  activeCourse.steps.map((s) => s.spotId)
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Googleマップで全ルート開く</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {activeCourse.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {activeCourse.catchphrase}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">想定所要時間</span>
                <span className="text-xs font-black text-slate-900">{activeCourse.estimatedTotalHours}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">総移動距離</span>
                <span className="text-xs font-black text-slate-900">約 {activeCourse.totalDistanceKm} km</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <Car className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">推奨移動</span>
                <span className="text-xs font-black text-slate-900 truncate block max-w-[110px]">
                  {activeCourse.recommendedTransport}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <CalendarCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">概算予算 / 大人</span>
                <span className="text-xs font-black text-slate-900">
                  ¥{activeCourse.estimatedBudgetAdult.toLocaleString()}〜
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP-BY-STEP INTERACTIVE TIMELINE */}
        <div className="space-y-4">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <span>🗺️ スポット巡回タイムスケジュール＆見どころ</span>
          </h3>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {activeCourse.steps.map((step, idx) => {
              const rawSpot = getSpot(step.spotId);
              if (!rawSpot) return null;
              const spot = getLocalizedSpot(rawSpot, currentLanguage);

              return (
                <div key={idx} className="relative space-y-3 group">
                  {/* Step Number Dot */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-xs border-2 border-white ring-2 ring-sky-100">
                    {idx + 1}
                  </div>

                  {/* Transfer Note Before */}
                  {step.transferNoteBefore && (
                    <div className="text-[11px] font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 inline-flex items-center gap-1.5">
                      <Car className="w-3 h-3 text-slate-400" />
                      <span>{step.transferNoteBefore}</span>
                    </div>
                  )}

                  {/* Spot Card in Timeline */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Photo Thumbnail */}
                      <div className="md:w-56 h-40 md:h-auto relative bg-slate-900 shrink-0">
                        {spot.imageUrl ? (
                          <img
                            src={spot.imageUrl}
                            alt={spot.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            {spot.imageEmoji}
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                            {spot.categoryLabel}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs font-black text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                              ⏱️ 滞在目安: {step.timeSlot}（約{step.durationMinutes}分）
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {spot.area}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 mt-1">{spot.name}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {step.activityNote}
                          </p>
                        </div>

                        {/* Real-time Weather info for the itinerary stop */}
                        <div className="pt-1">
                          <SpotWeatherWidget spotId={spot.id} currentLanguage={currentLanguage} />
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.googleMapQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:text-sky-700 font-medium flex items-center gap-1"
                          >
                            <span>地図で開く</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <div className="flex items-center gap-2">
                            {spot.requiresReservation && (
                              <button
                                type="button"
                                onClick={() => onGoToBooking(spot)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors"
                              >
                                <CalendarCheck className="w-3.5 h-3.5" />
                                <span>事前予約へ進む</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights & Tips Box */}
        <div className="bg-sky-50/60 rounded-2xl p-4 sm:p-5 border border-sky-100 space-y-2">
          <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-600" />
            <span>日南めぐりのポイント・ドライブのアドバイス</span>
          </h4>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
            <li>
              日南海岸（国道220号）は南国らしいパームツリーとオーシャンビューが続く絶景ロードです。道の駅なんごうやサンメッセでの休憩がおすすめ。
            </li>
            <li>
              「鵜戸神宮」の参拝時は石段や海岸沿いを歩くため、歩きやすい靴でのご来場が推奨されます。
            </li>
            <li>
              夕方以降は「油津赤レンガ館」のライトアップや「南郷・海辺の星空温泉」でゆったり疲れを癒やすのが日南ならではの過ごし方です。
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
