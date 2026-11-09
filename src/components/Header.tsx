import React from 'react';
import { TimeTheme } from '../types';
import { Language, UI_TRANSLATIONS } from '../i18n/translations';
import { Sun, Sunset, Moon, ShieldCheck, Ticket, Palmtree, Sparkles, Compass, Languages, Globe } from 'lucide-react';

interface HeaderProps {
  currentTheme: TimeTheme;
  manualOverride: TimeTheme | null;
  onSetOverride: (theme: TimeTheme | null) => void;
  onOpenAdmin: () => void;
  onOpenMyTickets: () => void;
  onOpenHelp?: () => void;
  onOpenCourse: () => void;
  myTicketCount: number;
  onGoHome: () => void;
  onGoToBooking: () => void;
  currentLanguage: Language;
  onSetLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  manualOverride,
  onSetOverride,
  onOpenAdmin,
  onOpenMyTickets,
  onOpenCourse,
  myTicketCount,
  onGoHome,
  onGoToBooking,
  currentLanguage,
  onSetLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.ja;
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 text-white shadow-md transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <button
            id="btn-nav-home"
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform text-xl shrink-0">
              <span>🌴</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm font-['M_PLUS_Rounded_1c']">
                  {t.brandTitle}
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 tracking-wider shadow-2xs">
                  {t.brandSub}
                </span>
              </div>
              <p className="text-[10px] text-sky-100 font-medium tracking-wider line-clamp-1">
                {t.brandTagline}
              </p>
            </div>
          </button>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Segmented Control */}
            <div
              className="flex items-center gap-0.5 bg-black/25 backdrop-blur-xs p-1 rounded-full border border-white/20 text-xs shadow-xs"
              role="group"
              aria-label={t.langLabel}
            >
              <Globe className="w-3.5 h-3.5 text-amber-300 ml-1 mr-0.5 shrink-0 hidden sm:inline" />
              <button
                type="button"
                onClick={() => onSetLanguage('ja')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  currentLanguage === 'ja'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="日本語に切り替え"
              >
                日
              </button>
              <button
                type="button"
                onClick={() => onSetLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  currentLanguage === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onSetLanguage('zh')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  currentLanguage === 'zh'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="切换为中文"
              >
                中文
              </button>
            </div>

            {/* Model Course Suggestion button */}
            <button
              id="btn-header-course"
              onClick={onOpenCourse}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm border border-white/30 transition-all shadow-sm cursor-pointer"
              title={t.courseBadge}
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{t.navCourse}</span>
            </button>

            {/* Direct Booking button */}
            <button
              id="btn-header-booking"
              onClick={onGoToBooking}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>{t.navBooking}</span>
            </button>

            {/* My Ticket button if user has reservations */}
            <button
              id="btn-header-my-tickets"
              onClick={onOpenMyTickets}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm border border-white/30 transition-all shadow-sm cursor-pointer"
              title={t.ticketSavedNotice}
            >
              <Ticket className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">{t.navMyTickets}</span>
              {myTicketCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {myTicketCount}
                </span>
              )}
            </button>

            {/* Staff / Admin Login Button */}
            <button
              id="btn-header-admin-login"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-sky-200 text-xs font-semibold backdrop-blur-sm border border-sky-300/30 transition-all cursor-pointer"
              title={t.navAdmin}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline">{t.navAdmin}</span>
            </button>
          </div>
        </div>

        {/* Time-linked Theme Switcher Bar */}
        <div className="mt-2 pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-sky-100 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="line-clamp-1">
              {t.themeLabel}{' '}
              <strong className="text-white font-bold">
                {currentTheme === 'day'
                  ? t.themeDayDesc
                  : currentTheme === 'sunset'
                  ? t.themeSunsetDesc
                  : t.themeNightDesc}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/10 text-[11px]">
            <button
              onClick={() => onSetOverride(null)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                manualOverride === null
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              {t.themeAuto}
            </button>

            <button
              onClick={() => onSetOverride('day')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                currentTheme === 'day' && manualOverride === 'day'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3 text-amber-300" />
              <span>{t.themeDay}</span>
            </button>

            <button
              onClick={() => onSetOverride('sunset')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                currentTheme === 'sunset' && manualOverride === 'sunset'
                  ? 'bg-orange-500 text-white font-bold shadow-xs'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              <Sunset className="w-3 h-3 text-orange-300" />
              <span>{t.themeSunset}</span>
            </button>

            <button
              onClick={() => onSetOverride('night')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                currentTheme === 'night' && manualOverride === 'night'
                  ? 'bg-indigo-700 text-white font-bold shadow-xs'
                  : 'text-sky-200 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3 text-indigo-300" />
              <span>{t.themeNight}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
