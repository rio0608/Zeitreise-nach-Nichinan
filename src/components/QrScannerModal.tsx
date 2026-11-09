import React, { useState, useRef, useEffect } from 'react';
import { Reservation } from '../types';
import { storageService } from '../services/storageService';
import {
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
  Users,
  Clock,
  Sparkles,
  RefreshCw,
  Ticket,
} from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (reservation: Reservation) => void;
  reservations: Reservation[];
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  reservations,
}) => {
  const [manualCode, setManualCode] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'already_used' | 'not_found';
    reservation?: Reservation;
    message: string;
  } | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play pleasant chime on check-in success
  const playSuccessChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio not supported or blocked
    }
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } else {
        setCameraError('お使いのブラウザではカメラAPIが非対応です。番号照合をご利用ください。');
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable', err);
      setCameraError('カメラの起動に失敗しました（権限がブロックされているか未接続）。手動入力またはワンタップ照合をお使いいただけます。');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScanResult(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const processTicketVerification = (codeOrPayload: string) => {
    let searchTicketNum = codeOrPayload.trim();
    let searchId = codeOrPayload.trim();

    try {
      const parsed = JSON.parse(codeOrPayload);
      if (parsed.ticket) searchTicketNum = parsed.ticket;
      if (parsed.id) searchId = parsed.id;
    } catch {
      // plain text string code
    }

    const currentList = storageService.getAllReservations();
    const target = currentList.find(
      (r) =>
        r.ticketNumber.toLowerCase() === searchTicketNum.toLowerCase() ||
        r.id.toLowerCase() === searchId.toLowerCase()
    );

    if (!target) {
      setScanResult({
        status: 'not_found',
        message: `該当するチケットが見つかりませんでした（入力値: ${codeOrPayload}）`,
      });
      return;
    }

    if (target.status === 'used') {
      setScanResult({
        status: 'already_used',
        reservation: target,
        message: `このチケットはすでに受付・利用済みです。（利用日時: ${target.usedAt || '本日'}）`,
      });
      return;
    }

    // Success: mark as used
    const updated = storageService.updateReservationStatus(target.id, 'used');
    if (updated) {
      playSuccessChime();
      setScanResult({
        status: 'success',
        reservation: updated,
        message: `受付照合完了！【${updated.spotName}】 ${updated.customerName}様（${updated.adultCount + updated.childCount}名様）をご案内ください。`,
      });
      onScanSuccess(updated);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processTicketVerification(manualCode.trim());
    setManualCode('');
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-qr-scanner"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
              施設スタッフ受付端末
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-600" />
              ときめぐり日南 入場・利用QRコードスキャナー
            </h3>
          </div>
          <button
            id="btn-close-scanner-modal"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Box */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border-2 border-slate-800">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Scan target reticle overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-sky-400/80 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-300 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-300 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-300 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-300 -mb-1 -mr-1 rounded-br" />
                  <div className="w-full h-0.5 bg-cyan-400/80 absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                </div>
              </div>
              <div className="absolute bottom-2 inset-x-0 text-center text-[11px] text-white/80 bg-black/40 py-1">
                お客様のQRコードを枠に合わせてください
              </div>
            </>
          ) : (
            <div className="text-center p-4 text-slate-400 space-y-2">
              <Camera className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-xs text-slate-300 font-medium">カメラプレビュー</p>
              {cameraError && <p className="text-[11px] text-amber-300 max-w-xs">{cameraError}</p>}
              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
              >
                カメラを再起動する
              </button>
            </div>
          )}
        </div>

        {/* Scan Result Notification */}
        {scanResult && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm animate-fade-in ${
              scanResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : scanResult.status === 'already_used'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {scanResult.status === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {scanResult.status === 'already_used' && (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              {scanResult.status === 'not_found' && (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{scanResult.message}</p>
                {scanResult.reservation && (
                  <div className="mt-2 text-xs opacity-90 space-y-0.5">
                    <p>施設: <strong>{scanResult.reservation.spotName}</strong></p>
                    <p>代表者: {scanResult.reservation.customerName} 様</p>
                    <p>日時: {scanResult.reservation.date} / {scanResult.reservation.timeRange}</p>
                    <p>
                      人数: 大人 {scanResult.reservation.adultCount}名
                      {scanResult.reservation.childCount > 0 && ` / 小人 ${scanResult.reservation.childCount}名`}
                    </p>
                    {scanResult.reservation.selectedOption && (
                      <p>オプション: {scanResult.reservation.selectedOption}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual Ticket Input */}
        <form onSubmit={handleManualSubmit} className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            手動番号照合（チケット番号またはQRコード値）
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="例: NCN-8821 または NCN-5192"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs"
            >
              照合・受付
            </button>
          </div>
        </form>

        {/* Demo Fast Verification Shortcuts */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-semibold block mb-2">
            デモ用：テスト照合ショートカット（未受付チケット）
          </span>
          <div className="flex flex-wrap gap-2">
            {reservations
              .filter((r) => r.status === 'valid')
              .slice(0, 3)
              .map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => processTicketVerification(r.ticketNumber)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Ticket className="w-3 h-3 text-sky-600" />
                  <span>{r.ticketNumber}（{r.customerName}様）</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
