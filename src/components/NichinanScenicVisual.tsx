import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TimeTheme, ScenicSlide } from '../types';
import { nichinanDaytimeSlides } from '../data/initialData';
import { Language, SPOT_TRANSLATIONS } from '../i18n/translations';
import nichinanMascotIcon from '../assets/images/nichinan_yuruchara_icon_1794187068875.jpg';
import {
  Sun,
  Sunset,
  Moon,
  Compass,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MapPin,
  CalendarCheck,
  Camera,
  Layers,
  Sparkles,
  Filter,
} from 'lucide-react';

interface NichinanScenicVisualProps {
  theme: TimeTheme;
  weatherCondition: string;
  sunsetTime: string;
  onSelectSpot?: (spotId: string) => void;
  onBookSpot?: (spotId: string) => void;
  currentLanguage?: Language;
}

export const NichinanScenicVisual: React.FC<NichinanScenicVisualProps> = ({
  theme,
  weatherCondition,
  sunsetTime,
  onSelectSpot,
  onBookSpot,
  currentLanguage = 'ja',
}) => {
  const allSlides = nichinanDaytimeSlides;
  const [slideCategoryFilter, setSlideCategoryFilter] = useState<'all' | 'day' | 'night'>('all');

  // Filter slides according to category tab
  const slides = useMemo(() => {
    if (slideCategoryFilter === 'day') {
      return allSlides.filter((s) =>
        ['slide-sunmesse', 'slide-udo', 'slide-obi', 'slide-coast', 'slide-michi-nango', 'slide-inohae', 'slide-horikawa', 'slide-katsuo'].includes(s.id)
      );
    }
    if (slideCategoryFilter === 'night') {
      return allSlides.filter((s) =>
        ['slide-aburatsu-bar', 'slide-nango-onsen', 'slide-stargazing', 'slide-obi', 'slide-horikawa'].includes(s.id)
      );
    }
    return allSlides;
  }, [allSlides, slideCategoryFilter]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // In day mode, default to photo slide view ('photos').
  // Can also toggle to 'graphic' (vector scenery).
  const [viewMode, setViewMode] = useState<'photos' | 'graphic'>('photos');

  // Sync default view mode with theme
  useEffect(() => {
    if (theme === 'day') {
      setViewMode('photos');
    }
  }, [theme]);

  // Keep current index in bounds if filter changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [slideCategoryFilter]);

  // Auto-play interval timer
  useEffect(() => {
    if (!isAutoPlay || isHovered || (theme !== 'day' && viewMode !== 'photos')) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, slides.length, theme, viewMode]);

  // Navigation handlers
  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevSlide();
    } else if (e.key === 'ArrowRight') {
      handleNextSlide();
    }
  };

  const currentSlide: ScenicSlide = slides[currentSlideIndex] || slides[0];
  const slideTrans =
    currentLanguage !== 'ja' && currentSlide
      ? SPOT_TRANSLATIONS[currentSlide.spotId]?.[currentLanguage]
      : null;
  const slideTitle = slideTrans?.name || currentSlide?.title || '';
  const slideArea = slideTrans?.area || currentSlide?.area || '';
  const slideHighlight = slideTrans?.daytimeHighlight || currentSlide?.highlight || '';

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 select-none bg-slate-900 border border-slate-800/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="日南 観光絶景スライダー"
    >
      {/* =========================================================================
          VIEW A: REAL PHOTOGRAPHIC SLIDER (実際の日南観光スポット写真スライド)
         ========================================================================= */}
      {viewMode === 'photos' ? (
        <div
          className="relative h-80 sm:h-96 md:h-[420px] w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Photos Slides Stack with Crossfade */}
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.imageUrl}
                  alt={`${slide.title} - ${slide.subTitle}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center scale-100 transition-transform duration-7000 ease-out"
                  style={{
                    transform: isActive ? 'scale(1.04)' : 'scale(1.0)',
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.classList.add(
                        'bg-gradient-to-br',
                        'from-sky-700',
                        'via-teal-800',
                        'to-slate-900'
                      );
                    }
                  }}
                />

                {/* Measured Contrast Scrims for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })}

          {/* Top Header Bar inside Visual */}
          <div className="absolute top-4 inset-x-4 sm:top-5 sm:inset-x-6 z-20 flex items-center justify-between gap-3">
            {/* Mode & Theme Badge + Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>日南 昼の絶景モード（青い海と南国の太陽）</span>
              </div>

              {/* Slide Filter Pills: All (11) | Day (8) | Night (5) */}
              <div className="hidden sm:inline-flex items-center p-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
                <button
                  type="button"
                  onClick={() => setSlideCategoryFilter('all')}
                  className={`px-2.5 py-0.5 rounded-full transition-colors ${
                    slideCategoryFilter === 'all'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  全{allSlides.length}スポット
                </button>
                <button
                  type="button"
                  onClick={() => setSlideCategoryFilter('day')}
                  className={`px-2.5 py-0.5 rounded-full transition-colors ${
                    slideCategoryFilter === 'day'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ☀️ 昼の絶景
                </button>
                <button
                  type="button"
                  onClick={() => setSlideCategoryFilter('night')}
                  className={`px-2.5 py-0.5 rounded-full transition-colors ${
                    slideCategoryFilter === 'night'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🌙 夕景・夜
                </button>
              </div>

              {/* Slide Counter */}
              <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/70 backdrop-blur-md border border-sky-300/30 text-sky-200 text-xs font-semibold">
                <Camera className="w-3 h-3 text-sky-300" />
                <span>実写写真</span>
                <span className="text-white/80 font-mono ml-0.5">
                  {currentSlideIndex + 1}/{slides.length}
                </span>
              </div>
            </div>

            {/* View Mode Toggle & Auto-play controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white/90 hover:text-white backdrop-blur-md border border-white/20 text-xs transition-colors shadow-md"
                title={isAutoPlay ? '自動スライド一時停止' : '自動スライド再開'}
                aria-label={isAutoPlay ? 'スライドショーを一時停止' : 'スライドショーを再生'}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              {/* Toggle to Graphic / Animated View */}
              <button
                type="button"
                onClick={() => setViewMode('graphic')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 text-xs font-medium transition-all shadow-md hover:border-amber-300/50"
                title="パノラマ・グラフィック表示に切り替え"
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">イラスト背景</span>
              </button>
            </div>
          </div>

          {/* Left / Right Navigation Arrow Buttons */}
          <button
            type="button"
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl"
            aria-label="前の絶景写真へ"
            title="前の絶景写真へ"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl"
            aria-label="次の絶景写真へ"
            title="次の絶景写真へ"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Overlay: Active Spot Details & Quick Actions */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 pb-4 flex flex-col justify-end">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              {/* Spot Information */}
              <div className="space-y-1 max-w-2xl text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {currentSlide.tag}
                  </span>
                  <span className="text-[11px] text-white/90 font-medium flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    {slideArea}
                  </span>
                  <span className="text-[10px] text-white/70 sm:hidden">
                    {currentSlideIndex + 1}/{slides.length}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-lg flex items-center gap-2">
                  <span>{slideTitle}</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow font-medium leading-relaxed">
                  {slideHighlight}
                </p>
              </div>

              {/* Action Buttons for this spot */}
              <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
                {currentSlide.requiresReservation && onBookSpot ? (
                  <button
                    type="button"
                    onClick={() => onBookSpot(currentSlide.spotId)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{currentLanguage === 'en' ? 'Book in Advance' : currentLanguage === 'zh' ? '前往预约' : '事前予約へ進む'}</span>
                  </button>
                ) : null}

                {onSelectSpot && (
                  <button
                    type="button"
                    onClick={() => onSelectSpot(currentSlide.spotId)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md border border-white/30 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  >
                    <span>{currentLanguage === 'en' ? 'Spot Details' : currentLanguage === 'zh' ? '查看详情' : 'スポット詳細へ'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Controls Row: Dots + Weather Badge */}
            <div className="mt-3.5 pt-2 border-t border-white/15 flex items-center justify-between gap-3">
              {/* Live Weather Indicator */}
              <div className="flex items-center gap-1.5 text-xs text-white/90 drop-shadow font-medium">
                <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none text-[11px] sm:text-xs">
                  {weatherCondition}
                </span>
              </div>

              {/* Slide Thumbnail Dots (Interactive) */}
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[180px] sm:max-w-none">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 shrink-0 ${
                      idx === currentSlideIndex
                        ? 'w-6 sm:w-8 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                        : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
                    }`}
                    title={`${idx + 1}: ${s.title}`}
                    aria-label={`スライド ${idx + 1}: ${s.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW B: DYNAMIC ATMOSPHERE GRAPHIC (時間帯で姿を変えるイラスト絶景)
           ========================================================================= */
        <div
          className={`relative h-64 sm:h-72 md:h-80 w-full overflow-hidden transition-all duration-1000 ${
            theme === 'day'
              ? 'bg-gradient-to-b from-sky-400 via-sky-300 to-cyan-100'
              : theme === 'sunset'
              ? 'bg-gradient-to-b from-orange-600 via-amber-500 to-rose-300'
              : 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900'
          }`}
        >
          {/* Celestial Body: Sun or Moon */}
          {theme === 'day' && (
            <div className="absolute top-6 right-10 sm:right-20 animate-pulse">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.8)] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-200/90" />
              </div>
            </div>
          )}

          {theme === 'sunset' && (
            <div className="absolute bottom-16 sm:bottom-20 right-12 sm:right-28">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-t from-orange-500 to-amber-200 shadow-[0_0_60px_rgba(249,115,22,0.9)] opacity-95" />
            </div>
          )}

          {theme === 'night' && (
            <>
              {/* Stars */}
              <div className="absolute inset-0 opacity-80 pointer-events-none">
                <div className="absolute top-5 left-12 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                <div className="absolute top-12 left-1/4 w-1 h-1 bg-amber-200 rounded-full" />
                <div className="absolute top-8 left-1/2 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-pulse" />
                <div className="absolute top-16 right-1/3 w-1 h-1 bg-white rounded-full" />
                <div className="absolute top-6 right-16 w-2 h-2 bg-yellow-100 rounded-full animate-ping" />
                <div className="absolute top-20 right-1/4 w-1.5 h-1.5 bg-purple-200 rounded-full" />
                <div className="absolute top-10 left-3/4 w-1 h-1 bg-white rounded-full animate-pulse" />
              </div>

              {/* Crescent Moon */}
              <div className="absolute top-6 right-12 sm:right-20">
                <div className="relative w-14 h-14 rounded-full bg-amber-100 shadow-[0_0_35px_rgba(254,240,138,0.7)] flex items-center justify-center overflow-hidden">
                  <div className="absolute -top-1 -right-1 w-11 h-11 rounded-full bg-indigo-950" />
                </div>
              </div>
            </>
          )}

          {/* Clouds & Atmosphere */}
          <div className="absolute top-8 left-6 sm:left-14 opacity-75">
            <div
              className={`w-28 h-7 rounded-full blur-xs ${
                theme === 'night'
                  ? 'bg-indigo-900/40'
                  : theme === 'sunset'
                  ? 'bg-orange-300/60'
                  : 'bg-white/80'
              }`}
            />
          </div>

          {/* Ocean & Horizon Silhouette */}
          <div className="absolute bottom-0 inset-x-0 h-32 sm:h-36">
            <svg
              className="absolute bottom-12 inset-x-0 w-full h-16 opacity-40"
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
            >
              <path
                d="M0,120 L0,60 Q150,15 350,70 T700,50 T1050,65 T1200,80 L1200,120 Z"
                fill={theme === 'night' ? '#0f172a' : theme === 'sunset' ? '#431407' : '#0369a1'}
              />
            </svg>

            <div
              className={`absolute bottom-0 inset-x-0 h-16 sm:h-20 transition-colors duration-700 ${
                theme === 'night'
                  ? 'bg-gradient-to-t from-slate-900 via-indigo-950/80 to-slate-900/30'
                  : theme === 'sunset'
                  ? 'bg-gradient-to-t from-rose-900 via-amber-700/80 to-amber-500/20'
                  : 'bg-gradient-to-t from-teal-600 via-cyan-500/80 to-sky-300/30'
              }`}
            >
              <svg
                className="absolute top-0 inset-x-0 w-full h-6 opacity-60 animate-pulse"
                preserveAspectRatio="none"
                viewBox="0 0 800 40"
              >
                <path
                  d="M0,20 C150,40 250,0 400,20 C550,40 650,0 800,20 L800,40 L0,40 Z"
                  fill={theme === 'night' ? '#1e1b4b' : theme === 'sunset' ? '#b45309' : '#0284c7'}
                />
              </svg>
            </div>

            {/* Coastal Foreground Elements */}
            <div className="absolute bottom-2 inset-x-0 px-6 sm:px-12 flex items-end justify-between pointer-events-none">
              <div className="flex items-end gap-1 text-2xl sm:text-4xl opacity-85">
                <span>🌴</span>
                <span className="text-xl sm:text-2xl -ml-2 mb-1">🌴</span>
              </div>

              <div className="flex items-end gap-3 sm:gap-6 pb-1 opacity-95">
                <div className="flex flex-col items-center">
                  <img
                    src={nichinanMascotIcon}
                    alt="にちなんちゃん"
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-md object-cover drop-shadow"
                  />
                  <span className="text-[9px] sm:text-[11px] font-black text-amber-300 drop-shadow">
                    にちなんちゃん
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl drop-shadow-md">🗿</span>
                  <span className="text-[10px] sm:text-xs font-bold text-white/90 drop-shadow">
                    サンメッセ
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl drop-shadow-md">⛩️</span>
                  <span className="text-[10px] sm:text-xs font-bold text-white/90 drop-shadow">
                    鵜戸神宮
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl drop-shadow-md">🏯</span>
                  <span className="text-[10px] sm:text-xs font-bold text-white/90 drop-shadow">
                    飫肥城下町
                  </span>
                </div>
              </div>

              <div className="flex items-end gap-1 text-2xl sm:text-3xl opacity-85">
                {theme === 'night' ? <span>🏮</span> : <span>🏄</span>}
                <span className="text-xl sm:text-2xl">🌴</span>
              </div>
            </div>
          </div>

          {/* Floating Overlay Header Badge */}
          <div className="absolute top-4 inset-x-4 sm:top-5 sm:inset-x-6 z-10 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/65 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
              {theme === 'day' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>日南 昼の絶景モード（青い海と南国の太陽）</span>
                </>
              ) : theme === 'sunset' ? (
                <>
                  <Sunset className="w-3.5 h-3.5 text-orange-400" />
                  <span>日南 夕景サンセット（茜色の水平線・日没 {sunsetTime}）</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                  <span>日南 夜の探訪モード（竹灯籠ライトアップ＆満天の星）</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setViewMode('photos')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-900 text-amber-300 hover:text-amber-200 backdrop-blur-md border border-amber-300/40 text-xs font-bold transition-all shadow-md hover:scale-105"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>全観光スポットの実写スライドを見る</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6 z-10">
            <p className="text-xs text-white drop-shadow-md font-medium flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>{weatherCondition}</span>
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE THUMBNAIL BAR (ALL 11 SPOTS QUICK JUMP)
         ========================================================================= */}
      {viewMode === 'photos' && (
        <div className="bg-slate-950/95 border-t border-slate-800 px-4 py-2.5 sm:px-6">
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold shrink-0">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">全スポット写真一覧 ({slides.length}):</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {slides.map((slide, idx) => {
                const isSelected = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setIsAutoPlay(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all text-left shrink-0 ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/50'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className="w-8 h-6 sm:w-10 sm:h-7 object-cover rounded-md shrink-0 border border-white/10"
                    />
                    <div className="max-w-[120px] sm:max-w-[140px] truncate">
                      <p className="text-[11px] font-bold leading-tight truncate">{slide.title}</p>
                      <p className="text-[9px] text-slate-400 truncate">{slide.area}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
