import React, { useState } from 'react';
import { OperationInfo, Reservation, NichinanSpot, CongestionLevel } from '../types';
import { storageService } from '../services/storageService';
import {
  ShieldCheck,
  Camera,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  LogOut,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Eye,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';

interface AdminDashboardProps {
  operationInfo: OperationInfo;
  reservations: Reservation[];
  spots: NichinanSpot[];
  onUpdateOperation: (info: OperationInfo) => void;
  onOpenScanner: () => void;
  onLogout: () => void;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  operationInfo,
  reservations,
  spots,
  onUpdateOperation,
  onOpenScanner,
  onLogout,
  onRefresh,
}) => {
  const [generalNoticeInput, setGeneralNoticeInput] = useState<string>(operationInfo.generalNotice);
  const [weatherInput, setWeatherInput] = useState<string>(operationInfo.weatherCondition);
  const [saveToast, setSaveToast] = useState<string>('');
  const [selectedSpotFilter, setSelectedSpotFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleUpdateNotice = () => {
    const updated = storageService.updateOperationInfo({
      generalNotice: generalNoticeInput,
      weatherCondition: weatherInput,
    });
    onUpdateOperation(updated);
    setSaveToast('観光インフォメーションを更新しました');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleUpdateCongestion = (spotId: string, level: CongestionLevel) => {
    storageService.updateSpotCongestion(spotId, level);
    onRefresh();
  };

  const handleMarkAsUsed = (reservationId: string) => {
    storageService.updateReservationStatus(reservationId, 'used');
    onRefresh();
    setSaveToast('チケットを受付完了（利用済）にしました');
    setTimeout(() => setSaveToast(''), 2500);
  };

  // Filter reservations
  const filteredReservations = reservations.filter((res) => {
    if (selectedSpotFilter !== 'all' && res.spotId !== selectedSpotFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = res.customerName.toLowerCase().includes(q);
      const matchTicket = res.ticketNumber.toLowerCase().includes(q);
      const matchPhone = res.phone.includes(q);
      if (!matchName && !matchTicket && !matchPhone) {
        return false;
      }
    }
    return true;
  });

  const validCount = reservations.filter((r) => r.status === 'valid').length;
  const usedCount = reservations.filter((r) => r.status === 'used').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold">ときめぐり日南 受付・施設管理コンソール</h1>
              <span className="text-[10px] bg-sky-900 text-sky-300 px-2 py-0.5 rounded font-mono border border-sky-700">
                STAFF ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              来場客のQR受付照合・各スポットの混雑状況および予約の一括管理
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Quick QR Scanner Button */}
          <button
            id="btn-admin-open-qr-scanner"
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>QRスキャナー起動</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold text-center animate-bounce">
          {saveToast}
        </div>
      )}

      {/* Spot Congestion Quick Update Panel */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              各観光スポットの混雑状況 リアルタイム更新
            </h2>
          </div>
          <span className="text-xs text-slate-500">1タップで一般画面へ即時反映</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {spots.slice(0, 6).map((spot) => (
            <div
              key={spot.id}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1 bg-white rounded-lg">{spot.imageEmoji}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{spot.name}</h4>
                  <span className="text-[10px] text-slate-500">{spot.area}</span>
                </div>
              </div>

              {/* 3 State Toggle Buttons */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleUpdateCongestion(spot.id, 'smooth')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    spot.currentCongestion === 'smooth'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  混雑なし
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateCongestion(spot.id, 'moderate')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    spot.currentCongestion === 'moderate'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  適度
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateCongestion(spot.id, 'busy')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    spot.currentCongestion === 'busy'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  やや混雑
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tourism Info Edit Panel */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              トップ案内メッセージ ＆ 天気コンディション編集
            </h2>
          </div>
          <span className="text-xs text-slate-500">最終更新: {operationInfo.lastUpdated}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 font-semibold block mb-1">
              お知らせメッセージ（トップに表示）
            </label>
            <input
              type="text"
              value={generalNoticeInput}
              onChange={(e) => setGeneralNoticeInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 font-semibold block mb-1">
              天候・風速ステータス
            </label>
            <input
              type="text"
              value={weatherInput}
              onChange={(e) => setWeatherInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleUpdateNotice}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
          >
            設定を保存
          </button>
        </div>
      </section>

      {/* Reservation Management Table */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                本日の事前予約・受付状況一覧
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              未受付: <strong className="text-sky-700">{validCount}件</strong> / 利用済: {usedCount}件
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="お名前や番号で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800"
            />

            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="データを再読み込み"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Spot Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedSpotFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              selectedSpotFilter === 'all'
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            すべて
          </button>
          {spots
            .filter((s) => s.requiresReservation)
            .map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelectedSpotFilter(spot.id)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                  selectedSpotFilter === spot.id
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spot.name.split(' ')[0]}
              </button>
            ))}
        </div>

        {/* Reservation Cards List */}
        <div className="space-y-2.5">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                res.status === 'valid'
                  ? 'bg-white border-slate-200 hover:border-sky-300'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                    {res.ticketNumber}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {res.spotName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      res.status === 'valid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {res.status === 'valid' ? '受付待機中' : '利用済'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                  <span>
                    代表者: <strong className="text-slate-800">{res.customerName}</strong> 様（{res.phone}）
                  </span>
                  <span>
                    利用枠: <strong className="text-slate-800">{res.date} {res.timeRange}</strong>
                  </span>
                  <span>
                    人数: 大人 {res.adultCount}名{res.childCount > 0 ? ` / 小人 ${res.childCount}名` : ''}
                  </span>
                  {res.selectedOption && (
                    <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                      {res.selectedOption}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                {res.status === 'valid' ? (
                  <button
                    onClick={() => handleMarkAsUsed(res.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>手動受付完了</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    受付済 ({res.usedAt?.split(' ')[1] || '完了'})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
