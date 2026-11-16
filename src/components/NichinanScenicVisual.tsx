import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TimeTheme, ScenicSlide } from '../types';
import { nichinanDaytimeSlides } from '../data/initialData';
import { Language, SPOT_TRANSLATIONS } from '../i18n/translations';
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

  // Reset slide index when category filter changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [slideCategoryFilter]);

  // Auto-play interval timer
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, slides.length]);

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
          REAL PHOTOGRAPHIC SLIDER (実際の日南観光スポット写真スライド)
         ========================================================================= */}
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
                  className="w-full h-full object-cover object-center scale-100 brightness-110 contrast-[1.02] transition-transform duration-7000 ease-out"
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

                {/* Soft bottom scrim only for text legibility without darkening the photo */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />
              </div>
            );
          })}

          {/* Top Header Bar inside Visual */}
          <div className="absolute top-4 inset-x-4 sm:top-5 sm:inset-x-6 z-20 flex items-center justify-between gap-3">
            {/* Mode & Theme Badge + Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
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
            </div>

            {/* Auto-play controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white/90 hover:text-white backdrop-blur-md border border-white/20 text-xs transition-colors shadow-md cursor-pointer"
                title={isAutoPlay ? '自動スライド一時停止' : '自動スライド再開'}
                aria-label={isAutoPlay ? 'スライドショーを一時停止' : 'スライドショーを再生'}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
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

      {/* =========================================================================
          INTERACTIVE THUMBNAIL BAR (ALL 11 SPOTS QUICK JUMP)
         ========================================================================= */}
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
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all text-left shrink-0 cursor-pointer ${
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
    </div>
  );
};
