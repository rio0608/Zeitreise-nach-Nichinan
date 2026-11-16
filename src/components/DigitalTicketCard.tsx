import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Reservation } from '../types';
import { CheckCircle2, Clock, Users, Sparkles, AlertCircle, Maximize2, Ticket, Trash2 } from 'lucide-react';

interface DigitalTicketCardProps {
  reservation: Reservation;
  onOpenFullscreen?: () => void;
  onMarkAsUsed?: () => void;
  onDelete?: () => void;
  showAdminAction?: boolean;
}

export const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({
  reservation,
  onOpenFullscreen,
  onMarkAsUsed,
  onDelete,
  showAdminAction = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR payload containing ticket details
    const qrPayload = JSON.stringify({
      id: reservation.id,
      ticket: reservation.ticketNumber,
      spot: reservation.spotName,
      name: reservation.customerName,
      date: reservation.date,
      slot: reservation.timeRange,
      guests: reservation.adultCount + reservation.childCount,
      type: 'NICHINAN_TOURISM_DIGITAL_TICKET',
    });

    QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [reservation]);

  const isUsed = reservation.status === 'used';

  return (
    <div
      id={`ticket-card-${reservation.id}`}
      className={`relative overflow-hidden rounded-3xl border ${
        isUsed
          ? 'bg-slate-50 border-slate-200 text-slate-500'
          : 'bg-white border-sky-100 shadow-xl text-slate-800'
      } transition-all`}
    >
      {/* Top Header of Ticket */}
      <div
        className={`px-6 py-4 flex items-center justify-between ${
          isUsed
            ? 'bg-slate-300 text-slate-700'
            : reservation.slotCategory === 'night'
            ? 'bg-gradient-to-r from-indigo-900 via-blue-900 to-sky-900 text-white'
            : reservation.slotCategory === 'sunset'
            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 text-white'
            : 'bg-gradient-to-r from-sky-600 to-teal-600 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-base shadow-inner">
            <Ticket className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-[10px] font-medium tracking-wide uppercase opacity-90">
              ときめぐり日南 デジタル利用・入場パス
            </div>
            <div className="text-base font-black tracking-tight line-clamp-1">
              {reservation.spotName}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold ${
              isUsed
                ? 'bg-slate-400 text-white'
                : 'bg-emerald-400 text-slate-950 shadow-sm'
            }`}
          >
            {isUsed ? '利用済' : '✓ 有効（受付待機中）'}
          </span>
          <div className="text-[10px] font-mono mt-1 opacity-90">{reservation.ticketNumber}</div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6">
        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative p-3 bg-white rounded-2xl shadow-inner border border-slate-100 group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="入場用QRコード"
                className={`w-44 h-44 object-contain ${isUsed ? 'opacity-25 grayscale' : ''}`}
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                QRコード生成中...
              </div>
            )}

            {isUsed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-1" />
                <span className="text-sm font-bold text-slate-800">利用・入場完了</span>
                <span className="text-[11px] text-slate-500">{reservation.usedAt || '受付済'}</span>
              </div>
            )}

            {!isUsed && onOpenFullscreen && (
              <button
                id={`btn-expand-qr-${reservation.id}`}
                onClick={onOpenFullscreen}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 transition-colors shadow"
                title="QRコードを拡大表示"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="mt-2.5 text-xs text-slate-500 font-medium">
            {isUsed
              ? 'このチケットは利用済みです'
              : '施設の受付・窓口でスタッフにこちらのQRコードをご提示ください'}
          </p>
        </div>

        {/* Dashed divider ticket style with notch circles */}
        <div className="relative my-5">
          <div className="border-t-2 border-dashed border-slate-200" />
          <div className="absolute -left-9 -top-3 w-6 h-6 bg-slate-100 rounded-full" />
          <div className="absolute -right-9 -top-3 w-6 h-6 bg-slate-100 rounded-full" />
        </div>

        {/* Ticket Details Grid */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4 text-sky-500" />
              利用日時
            </span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              {reservation.date} / {reservation.timeRange}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs">
              <Users className="w-4 h-4 text-sky-500" />
              人数
            </span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              大人 {reservation.adultCount}名
              {reservation.childCount > 0 && ` / 小人 ${reservation.childCount}名`}
              （計 {reservation.adultCount + reservation.childCount}名）
            </span>
          </div>

          {reservation.selectedOption && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500" />
                選択プラン・特典
              </span>
              <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-xs truncate max-w-[200px]">
                {reservation.selectedOption}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500 text-xs">ご予約者様</span>
            <span className="font-medium text-slate-800 text-xs sm:text-sm">
              {reservation.customerName} 様
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs">お支払額（税込）</span>
            <span className="font-bold text-base text-slate-900">
              ¥{reservation.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Staff note */}
        <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">受付時のお願い</p>
            <p className="text-sky-700 mt-0.5">
              スムーズな読み取りのため、画面の明るさを上げて受付スタッフへご提示ください。
            </p>
          </div>
        </div>

        {/* Staff override action if allowed */}
        {showAdminAction && !isUsed && onMarkAsUsed && (
          <button
            id={`btn-admin-mark-used-${reservation.id}`}
            onClick={onMarkAsUsed}
            className="w-full mt-4 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            スタッフ操作：受付完了（QRコード読取済みにする）
          </button>
        )}

        {/* Delete Ticket Action */}
        {onDelete && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <button
              id={`btn-delete-ticket-${reservation.id}`}
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>このチケットを削除</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
