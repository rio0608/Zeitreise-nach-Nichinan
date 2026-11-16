import React from 'react';
import { TimeTheme } from '../types';
import { Language, UI_TRANSLATIONS } from '../i18n/translations';
import { Sun, Sunset, Moon, ShieldCheck, Ticket, Palmtree, Sparkles, Compass, Languages, Globe } from 'lucide-react';
import nichinanMascotIcon from '../assets/images/nichinan_yuruchara_icon_1794187068875.jpg';

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
      className="sticky top-0 z-40 w-full bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 text-slate-900 border-b border-amber-200/90 shadow-sm transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <button
            id="btn-nav-home"
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-white p-0.5 border-2 border-amber-300 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0 overflow-hidden ring-2 ring-orange-200/70">
              <img
                src={nichinanMascotIcon}
                alt="日南観光 ゆるキャラ にちなんちゃん"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-['M_PLUS_Rounded_1c']">
                  {t.brandTitle}
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white tracking-wider shadow-2xs">
                  {t.brandSub}
                </span>
              </div>
              <p className="text-[10px] text-amber-900/80 font-medium tracking-wider line-clamp-1">
                {t.brandTagline}
              </p>
            </div>
          </button>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Segmented Control */}
            <div
              className="flex items-center gap-0.5 bg-white/90 backdrop-blur-xs p-1 rounded-full border border-amber-200 text-xs shadow-2xs"
              role="group"
              aria-label={t.langLabel}
            >
              <Globe className="w-3.5 h-3.5 text-orange-500 ml-1 mr-0.5 shrink-0 hidden sm:inline" />
              <button
                type="button"
                onClick={() => onSetLanguage('ja')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  currentLanguage === 'ja'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
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
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
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
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
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
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-800 text-xs font-bold border border-amber-200 transition-all shadow-2xs cursor-pointer"
              title={t.courseBadge}
            >
              <Compass className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">{t.navCourse}</span>
            </button>

            {/* Direct Booking button */}
            <button
              id="btn-header-booking"
              onClick={onGoToBooking}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <span>{t.navBooking}</span>
            </button>

            {/* My Ticket button if user has reservations */}
            <button
              id="btn-header-my-tickets"
              onClick={onOpenMyTickets}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-800 text-xs font-bold border border-amber-200 transition-all shadow-2xs cursor-pointer"
              title={t.ticketSavedNotice}
            >
              <Ticket className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden md:inline">{t.navMyTickets}</span>
              {myTicketCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {myTicketCount}
                </span>
              )}
            </button>

            {/* Staff / Admin Login Button */}
            <button
              id="btn-header-admin-login"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-900 text-amber-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              title={t.navAdmin}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">{t.navAdmin}</span>
            </button>
          </div>
        </div>

        {/* Time-linked Theme Switcher Bar */}
        <div className="mt-2 pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 text-[11px]">
            <Sparkles className="w-3 h-3 text-orange-500 shrink-0" />
            <span className="line-clamp-1">
              {t.themeLabel}{' '}
              <strong className="text-slate-900 font-bold">
                {currentTheme === 'day'
                  ? t.themeDayDesc
                  : currentTheme === 'sunset'
                  ? t.themeSunsetDesc
                  : t.themeNightDesc}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/85 p-1 rounded-full border border-amber-200/90 text-[11px] shadow-2xs">
            <button
              onClick={() => onSetOverride(null)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                manualOverride === null
                  ? 'bg-orange-500 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.themeAuto}
            </button>

            <button
              onClick={() => onSetOverride('day')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                currentTheme === 'day' && manualOverride === 'day'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className={`w-3 h-3 ${currentTheme === 'day' && manualOverride === 'day' ? 'text-slate-900' : 'text-amber-500'}`} />
              <span>{t.themeDay}</span>
            </button>

            <button
              onClick={() => onSetOverride('sunset')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                currentTheme === 'sunset' && manualOverride === 'sunset'
                  ? 'bg-orange-500 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sunset className={`w-3 h-3 ${currentTheme === 'sunset' && manualOverride === 'sunset' ? 'text-white' : 'text-orange-500'}`} />
              <span>{t.themeSunset}</span>
            </button>

            <button
              onClick={() => onSetOverride('night')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                currentTheme === 'night' && manualOverride === 'night'
                  ? 'bg-indigo-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className={`w-3 h-3 ${currentTheme === 'night' && manualOverride === 'night' ? 'text-indigo-200' : 'text-indigo-500'}`} />
              <span>{t.themeNight}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
