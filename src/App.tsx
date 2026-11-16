/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TimeTheme, OperationInfo, Reservation, NichinanSpot } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { BookingView } from './components/BookingView';
import { TicketView } from './components/TicketView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { QrScannerModal } from './components/QrScannerModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { CoursePlanView } from './components/CoursePlanView';
import { Language } from './i18n/translations';
import { Palmtree, MapPin, HelpCircle } from 'lucide-react';
import nichinanMascotIcon from './assets/images/nichinan_yuruchara_icon_1794187068875.jpg';

type ActiveView = 'home' | 'booking' | 'tickets' | 'admin' | 'course';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nichinan_lang');
      if (saved === 'en' || saved === 'zh' || saved === 'ja') return saved;
    } catch {}
    return 'ja';
  });

  const handleSetLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('nichinan_lang', lang);
    } catch {}
  };

  const [manualThemeOverride, setManualThemeOverride] = useState<TimeTheme | null>(null);
  const [operationInfo, setOperationInfo] = useState<OperationInfo>(storageService.getOperationInfo());
  const [spots, setSpots] = useState<NichinanSpot[]>(storageService.getSpots());
  const [reservations, setReservations] = useState<Reservation[]>(storageService.getAllReservations());
  const [myReservationIds, setMyReservationIds] = useState<string[]>(storageService.getMyReservationIds());
  const [selectedBookingSpot, setSelectedBookingSpot] = useState<NichinanSpot | null>(null);

  // Help guide modal state
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Staff authentication modals
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);

  // Auto theme detection according to time
  const getAutoTheme = useCallback((): TimeTheme => {
    const currentHour = new Date().getHours();
    // 06:00 ~ 15:59 -> day
    // 16:00 ~ 17:59 -> sunset
    // 18:00 ~ 05:59 -> night
    if (currentHour >= 6 && currentHour < 16) {
      return 'day';
    } else if (currentHour >= 16 && currentHour < 18) {
      return 'sunset';
    } else {
      return 'night';
    }
  }, []);

  const [activeTheme, setActiveTheme] = useState<TimeTheme>(getAutoTheme());

  // Keep theme updated
  useEffect(() => {
    if (manualThemeOverride) {
      setActiveTheme(manualThemeOverride);
    } else {
      setActiveTheme(getAutoTheme());
    }

    const interval = setInterval(() => {
      if (!manualThemeOverride) {
        setActiveTheme(getAutoTheme());
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [manualThemeOverride, getAutoTheme]);

  // Sync state across local changes and cross-tabs
  const reloadData = useCallback(() => {
    setOperationInfo(storageService.getOperationInfo());
    setSpots(storageService.getSpots());
    setReservations(storageService.getAllReservations());
    setMyReservationIds(storageService.getMyReservationIds());
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      reloadData();
    };

    window.addEventListener('nichinan_data_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('nichinan_data_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [reloadData]);

  // Filter user's own tickets
  const myReservations = reservations.filter((r) => myReservationIds.includes(r.id));

  // Handler for booking navigation
  const handleGoToBooking = (spot?: NichinanSpot) => {
    if (spot) {
      setSelectedBookingSpot(spot);
    }
    setCurrentView('booking');
  };

  // Handler for booking completed
  const handleBookingCompleted = (newRes: Reservation) => {
    reloadData();
    setCurrentView('tickets');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-700 font-sans ${
        activeTheme === 'night'
          ? 'bg-slate-950 text-slate-100'
          : activeTheme === 'sunset'
          ? 'bg-amber-50/60 text-slate-800'
          : 'bg-amber-50/35 text-slate-800'
      }`}
    >
      {/* Header */}
      <Header
        currentTheme={activeTheme}
        manualOverride={manualThemeOverride}
        onSetOverride={(theme) => setManualThemeOverride(theme)}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setCurrentView('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenMyTickets={() => setCurrentView('tickets')}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenCourse={() => setCurrentView('course')}
        myTicketCount={myReservations.filter((r) => r.status === 'valid').length}
        onGoHome={() => setCurrentView('home')}
        onGoToBooking={() => handleGoToBooking()}
        currentLanguage={currentLanguage}
        onSetLanguage={handleSetLanguage}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
        {/* VIEW 1: Home & Day/Night Spot Catalog */}
        {currentView === 'home' && (
          <HomeView
            operationInfo={operationInfo}
            spots={spots}
            currentTheme={activeTheme}
            onGoToBooking={handleGoToBooking}
            onOpenMyTickets={() => setCurrentView('tickets')}
            onOpenHelp={() => setIsHelpModalOpen(true)}
            onOpenCourse={() => setCurrentView('course')}
            hasMyTickets={myReservations.length > 0}
            currentLanguage={currentLanguage}
          />
        )}

        {/* VIEW 2: Pre-booking Screen */}
        {currentView === 'booking' && (
          <BookingView
            initialSpot={selectedBookingSpot}
            spots={spots}
            onBack={() => setCurrentView('home')}
            onBookingCompleted={handleBookingCompleted}
            currentLanguage={currentLanguage}
          />
        )}

        {/* VIEW 3: Digital Ticket (QR Code) Screen */}
        {currentView === 'tickets' && (
          <TicketView
            reservations={myReservations}
            onBack={() => setCurrentView('home')}
            onBookMore={() => handleGoToBooking()}
            onRefresh={reloadData}
          />
        )}

        {/* VIEW 4: Admin / Staff Dashboard */}
        {currentView === 'admin' && (
          <AdminDashboard
            operationInfo={operationInfo}
            reservations={reservations}
            spots={spots}
            onUpdateOperation={(info) => {
              setOperationInfo(info);
              reloadData();
            }}
            onOpenScanner={() => setIsQrScannerOpen(true)}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setCurrentView('home');
            }}
            onRefresh={reloadData}
          />
        )}

        {/* VIEW 5: Model Course Auto-Suggestion Planner */}
        {currentView === 'course' && (
          <CoursePlanView
            spots={spots}
            onBack={() => setCurrentView('home')}
            onGoToBooking={handleGoToBooking}
            currentLanguage={currentLanguage}
            onSelectSpotDetail={(spotId) => {
              setCurrentView('home');
              setTimeout(() => {
                const el = document.getElementById(`spot-card-${spotId}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('ring-4', 'ring-amber-400');
                  setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2000);
                }
              }, 150);
            }}
          />
        )}
      </main>

      {/* Floating Help Button for Quick Access */}
      <button
        id="btn-floating-help"
        onClick={() => setIsHelpModalOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-xl hover:shadow-2xl border-2 border-white ring-2 ring-amber-300/70 transition-all group hover:scale-105 cursor-pointer"
        title="操作説明・使い方ガイドを開く"
        aria-label="操作説明・使い方ガイドを開く"
      >
        <HelpCircle className="w-4 h-4 text-orange-700 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">操作説明・使い方</span>
        <span className="sm:hidden">使い方</span>
      </button>

      {/* Help Guide Modal */}
      <HelpGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onNavigateToBooking={() => handleGoToBooking()}
        onNavigateToTickets={() => setCurrentView('tickets')}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminLoggedIn(true);
          setCurrentView('admin');
        }}
      />

      {/* QR Code Scanner / Verification Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanSuccess={() => {
          reloadData();
        }}
        reservations={reservations}
      />

      {/* Footer */}
      <footer
        className={`mt-16 py-8 border-t transition-colors ${
          activeTheme === 'night'
            ? 'border-slate-800 bg-slate-900/60 text-slate-400'
            : 'border-slate-200 bg-white/70 text-slate-500'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <img
              src={nichinanMascotIcon}
              alt="日南ゆるキャラ にちなんちゃん"
              className="w-7 h-7 rounded-lg object-cover border border-amber-300 shadow-2xs"
            />
            <span className={`font-bold ${activeTheme === 'night' ? 'text-slate-200' : 'text-slate-800'}`}>
              ときめぐり日南
            </span>
            <span className="font-bold text-amber-600 bg-amber-100/90 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-md text-[11px] border border-amber-300/60 shadow-2xs">
              DAY＆NIGHT
            </span>
            <span className="text-slate-400 font-medium">
              — DAY＆NIGHT
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="hover:underline text-sky-700 font-bold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>操作説明・使い方</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="hover:underline"
            >
              スポット一覧
            </button>
            <button
              onClick={() => handleGoToBooking()}
              className="hover:underline"
            >
              事前予約
            </button>
            <button
              onClick={() => setCurrentView('tickets')}
              className="hover:underline"
            >
              マイチケット
            </button>
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setCurrentView('admin');
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              className="font-bold text-sky-600 hover:underline"
            >
              施設受付コンソール
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
