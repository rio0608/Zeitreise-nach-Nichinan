import React, { useState } from 'react';
import { Reservation } from '../types';
import { DigitalTicketCard } from './DigitalTicketCard';
import { storageService } from '../services/storageService';
import { ChevronLeft, Ticket, AlertCircle, X, Sparkles, PlusCircle } from 'lucide-react';
import QRCode from 'qrcode';

interface TicketViewProps {
  reservations: Reservation[];
  onBack: () => void;
  onBookMore: () => void;
  onRefresh: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({
  reservations,
  onBack,
  onBookMore,
  onRefresh,
}) => {
  const [activeReservationId, setActiveReservationId] = useState<string>(
    reservations[0]?.id || ''
  );
  const [fullscreenQr, setFullscreenQr] = useState<Reservation | null>(null);
  const [fullscreenQrImg, setFullscreenQrImg] = useState<string>('');

  const activeRes = reservations.find((r) => r.id === activeReservationId) || reservations[0];

  const handleOpenFullscreen = (res: Reservation) => {
    setFullscreenQr(res);
    QRCode.toDataURL(
      JSON.stringify({
        id: res.id,
        ticket: res.ticketNumber,
        spot: res.spotName,
        name: res.customerName,
        date: res.date,
        slot: res.timeRange,
        guests: res.adultCount + res.childCount,
      }),
      { width: 360, margin: 2 }
    ).then((url) => setFullscreenQrImg(url));
  };

  const handleMarkUsed = (id: string) => {
    storageService.updateReservationStatus(id, 'used');
    onRefresh();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-ticket-view-back"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-sky-700 hover:text-sky-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>観光スポット一覧へ戻る</span>
        </button>

        <button
          id="btn-ticket-book-another"
          onClick={onBookMore}
          className="flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-full border border-sky-200 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>他のスポットを予約</span>
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-slate-100 space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-2xl">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">デジタルチケットがありません</h3>
          <p className="text-xs text-slate-500">
            日南の対象観光スポット・体験を事前予約すると、こちらにQRコード付きの入場・利用チケットが即時発行されます。
          </p>
          <button
            onClick={onBookMore}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all"
          >
            日南の観光スポット・体験を予約する
          </button>
        </div>
      ) : (
        <>
          {/* Multiple Ticket Switcher Tabs if user has more than 1 ticket */}
          {reservations.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {reservations.map((res, idx) => (
                <button
                  key={res.id}
                  id={`tab-ticket-${res.id}`}
                  onClick={() => setActiveReservationId(res.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
                    activeRes?.id === res.id
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{res.spotName.split(' ')[0]}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        res.status === 'valid' ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Active Ticket Card */}
          {activeRes && (
            <DigitalTicketCard
              reservation={activeRes}
              onOpenFullscreen={() => handleOpenFullscreen(activeRes)}
            />
          )}
        </>
      )}

      {/* Fullscreen QR Modal */}
      {fullscreenQr && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative space-y-4">
            <button
              onClick={() => setFullscreenQr(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                ときめぐり日南 デジタルチケット拡大表示
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-2">{fullscreenQr.spotName}</h4>
              <p className="text-xs text-slate-500">
                {fullscreenQr.customerName} 様 / {fullscreenQr.date} {fullscreenQr.timeRange}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-2xl flex justify-center shadow-inner">
              {fullscreenQrImg ? (
                <img
                  src={fullscreenQrImg}
                  alt="拡大QRコード"
                  className="w-64 h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center">生成中...</div>
              )}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              チケット番号: <strong className="font-mono text-slate-800">{fullscreenQr.ticketNumber}</strong>
            </div>

            <button
              onClick={() => setFullscreenQr(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
