import React, { useState } from 'react';
import { Reservation, SlotCategory, NichinanSpot } from '../types';
import { storageService } from '../services/storageService';
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ShieldCheck,
  Smartphone,
  MapPin,
  Ticket,
} from 'lucide-react';
import { Language, getLocalizedSpot } from '../i18n/translations';

interface BookingViewProps {
  initialSpot?: NichinanSpot | null;
  spots: NichinanSpot[];
  onBack: () => void;
  onBookingCompleted: (reservation: Reservation) => void;
  currentLanguage?: Language;
}

export const BookingView: React.FC<BookingViewProps> = ({
  initialSpot,
  spots,
  onBack,
  onBookingCompleted,
  currentLanguage = 'ja',
}) => {
  // Filter spots that can be booked
  const bookableSpots = spots.filter((s) => s.requiresReservation);

  // Stepper state: 1: スポット・日時, 2: 人数・オプション, 3: 確認・決済
  const [step, setStep] = useState<number>(1);

  // Form states
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedSpotId, setSelectedSpotId] = useState<string>(
    initialSpot?.id || bookableSpots[0]?.id || 'spot-sunmesse'
  );
  const rawSpot = bookableSpots.find((s) => s.id === selectedSpotId) || bookableSpots[0];
  const currentSpot = getLocalizedSpot(rawSpot, currentLanguage);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedCategory, setSelectedCategory] = useState<SlotCategory>('day');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('11:00 - 12:00');

  const [adultCount, setAdultCount] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>(
    currentSpot?.reservationOptions?.[0] || '基本プラン'
  );

  const [customerName, setCustomerName] = useState<string>('日南 太郎');
  const [phone, setPhone] = useState<string>('090-1234-5678');
  const [paymentMethod, setPaymentMethod] = useState<'paypay' | 'credit_card' | 'local_pay'>('paypay');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // When changing spot, adapt options
  const handleSpotChange = (spotId: string) => {
    setSelectedSpotId(spotId);
    const s = bookableSpots.find((item) => item.id === spotId);
    if (s?.reservationOptions && s.reservationOptions.length > 0) {
      setSelectedOption(s.reservationOptions[0]);
    }
  };

  // Pricing rules
  const pricePerAdult = currentSpot?.reservationPriceAdult || 1000;
  const pricePerChild = currentSpot?.reservationPriceChild || 500;
  const totalAmount = adultCount * pricePerAdult + childCount * pricePerChild;

  // Time slot presets according to category
  const timeSlotOptions = {
    day: [
      { range: '09:30 - 10:30', note: '朝一番・澄んだ空気と快適体験' },
      { range: '11:00 - 12:00', note: '日南ブルー爽快タイム' },
      { range: '13:00 - 14:00', note: '南国の太陽きらめく時間' },
      { range: '14:30 - 15:30', note: 'ゆったり午後の時間' },
    ],
    sunset: [
      { range: '16:00 - 17:00', note: '夕暮れグラデーション' },
      { range: '17:00 - 18:00', note: '大人気★茜色のサンセット' },
      { range: '18:00 - 19:00', note: 'トワイライト黄昏マジックアワー' },
    ],
    night: [
      { range: '18:30 - 19:30', note: 'ライトアップ点灯直後' },
      { range: '19:30 - 20:30', note: '満天星空＆夜景の贅沢な時間' },
      { range: '20:30 - 21:30', note: '静寂の夜の特別な体験' },
    ],
  };

  const handleCategoryChange = (cat: SlotCategory) => {
    setSelectedCategory(cat);
    setSelectedTimeRange(timeSlotOptions[cat][0].range);
  };

  const handleConfirmReservation = () => {
    if (!customerName.trim() || !phone.trim()) {
      alert('お名前とお電話番号をご入力ください。');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const uniqueId = `NCN-${selectedDate.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReservation: Reservation = {
        id: uniqueId,
        ticketNumber: `NCN-${Math.floor(1000 + Math.random() * 9000)}`,
        spotId: currentSpot.id,
        spotName: currentSpot.name,
        customerName: customerName.trim(),
        phone: phone.trim(),
        date: selectedDate,
        slotCategory: selectedCategory,
        timeRange: selectedTimeRange,
        adultCount,
        childCount,
        selectedOption,
        totalAmount,
        paymentMethod,
        status: 'valid',
        bookedAt: new Date().toLocaleString('ja-JP'),
      };

      storageService.addReservation(newReservation);
      setIsProcessing(false);
      onBookingCompleted(newReservation);
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Back Navigation & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200 transition-colors shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>観光スポット一覧へ戻る</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
            QRチケット即時発行
          </span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          日南 観光体験・特別入場チケット事前予約
        </h1>
        <p className="text-xs text-slate-500">
          スマホで完結・混雑日でも待たずにスムーズ利用！当日はQRコードを提示するだけ
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between relative px-6 py-2 bg-white rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex flex-col items-center gap-1 z-10">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 1 ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}
          >
            1
          </div>
          <span className={`text-[11px] font-bold ${step >= 1 ? 'text-sky-800' : 'text-slate-400'}`}>
            スポット・日時
          </span>
        </div>

        <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-sky-500' : 'bg-slate-200'}`} />

        <div className="flex flex-col items-center gap-1 z-10">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 2 ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}
          >
            2
          </div>
          <span className={`text-[11px] font-bold ${step >= 2 ? 'text-sky-800' : 'text-slate-400'}`}>
            人数・オプション
          </span>
        </div>

        <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-sky-500' : 'bg-slate-200'}`} />

        <div className="flex flex-col items-center gap-1 z-10">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 3 ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}
          >
            3
          </div>
          <span className={`text-[11px] font-bold ${step >= 3 ? 'text-sky-800' : 'text-slate-400'}`}>
            確認・決済
          </span>
        </div>
      </div>

      {/* STEP 1: スポット選択・日付・時間帯 */}
      {step === 1 && (
        <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
          {/* Target Spot Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              1. 予約する観光スポット・体験を選択
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {bookableSpots.map((spot) => {
                const loc = getLocalizedSpot(spot, currentLanguage);
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => handleSpotChange(spot.id)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      selectedSpotId === spot.id
                        ? 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                      {spot.imageUrl ? (
                        <img
                          src={spot.imageUrl}
                          alt={loc.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-xl bg-white">
                          {spot.imageEmoji}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-sky-700 font-bold bg-white px-1.5 py-0.5 rounded border border-sky-100">
                          {loc.categoryLabel}
                        </span>
                        <span className="text-xs font-bold text-amber-700">
                          ¥{spot.reservationPriceAdult?.toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{loc.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{loc.area}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>2. ご来場・利用希望日</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              min={todayStr}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          {/* Slot Category Selection (Day / Sunset / Night) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>3. ご希望の時間帯（昼・夕暮れ・夜）</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('day')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  selectedCategory === 'day'
                    ? 'border-amber-400 bg-amber-50 text-slate-900 ring-2 ring-amber-400/30 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold">昼の部</span>
                <span className="text-[10px] text-slate-500">南国の太陽</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('sunset')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  selectedCategory === 'sunset'
                    ? 'border-orange-500 bg-orange-50 text-slate-900 ring-2 ring-orange-500/30 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sunset className="w-5 h-5 text-orange-600" />
                <span className="text-xs font-bold">夕暮れサンセット</span>
                <span className="text-[10px] text-orange-700 font-bold">マジックアワー</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('night')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  selectedCategory === 'night'
                    ? 'border-indigo-600 bg-indigo-50 text-slate-900 ring-2 ring-indigo-600/30 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold">夜の部</span>
                <span className="text-[10px] text-indigo-700 font-bold">星空＆ライトアップ</span>
              </button>
            </div>

            {/* Time Slot List */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] text-slate-500 font-medium">利用枠を選択:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {timeSlotOptions[selectedCategory].map((slot, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTimeRange === slot.range
                        ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 font-bold text-sky-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="timeSlot"
                        checked={selectedTimeRange === slot.range}
                        onChange={() => setSelectedTimeRange(slot.range)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-xs">{slot.range}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{slot.note}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all"
            >
              <span>次へ：人数・オプション選択</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 人数・オプション選択 */}
      {step === 2 && (
        <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="text-2xl">{currentSpot.imageEmoji}</span>
            <div>
              <h3 className="text-sm font-black text-slate-900">{currentSpot.name}</h3>
              <p className="text-xs text-slate-500">
                {selectedDate} / {selectedTimeRange}（{selectedCategory === 'day' ? '昼' : selectedCategory === 'sunset' ? '夕暮れ' : '夜'}）
              </p>
            </div>
          </div>

          {/* Counts */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              <span>人数を選択してください</span>
            </label>

            {/* Adults */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-sm font-bold text-slate-800">大人（中学生以上）</span>
                <span className="block text-xs text-slate-500">
                  ¥{pricePerAdult.toLocaleString()} / 名
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm shadow-xs"
                >
                  -
                </button>
                <span className="font-bold text-base w-5 text-center">{adultCount}</span>
                <button
                  type="button"
                  onClick={() => setAdultCount(adultCount + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-sm font-bold text-slate-800">小人（4歳〜小学生）</span>
                <span className="block text-xs text-slate-500">
                  ¥{pricePerChild.toLocaleString()} / 名（3歳以下無料）
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildCount(Math.max(0, childCount - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm shadow-xs"
                >
                  -
                </button>
                <span className="font-bold text-base w-5 text-center">{childCount}</span>
                <button
                  type="button"
                  onClick={() => setChildCount(childCount + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Spot Options if available */}
          {currentSpot.reservationOptions && currentSpot.reservationOptions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>プラン・特典オプションを選択</span>
              </label>

              <div className="space-y-1.5">
                {currentSpot.reservationOptions.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedOption === opt
                        ? 'border-amber-400 bg-amber-50/70 ring-1 ring-amber-400 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="spotOption"
                      checked={selectedOption === opt}
                      onChange={() => setSelectedOption(opt)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-xs">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Estimated Total Display */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-900 font-semibold block">合計金額（税込）</span>
              <span className="text-[11px] text-slate-500">現地決済またはオンライン決済</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-950">¥{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>戻る</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all"
            >
              <span>次へ：確認とお支払い</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: お客様情報・決済・確定 */}
      {step === 3 && (
        <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>{currentSpot.imageEmoji}</span>
                <span>{currentSpot.name}</span>
              </span>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                事前予約
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-1 text-slate-600 pt-1">
              <span>ご利用日:</span>
              <strong className="text-slate-900 text-right">{selectedDate}</strong>

              <span>時間帯:</span>
              <strong className="text-slate-900 text-right">{selectedTimeRange}</strong>

              <span>人数:</span>
              <strong className="text-slate-900 text-right">
                大人 {adultCount}名{childCount > 0 ? ` / 小人 ${childCount}名` : ''}
              </strong>

              <span>選択プラン:</span>
              <strong className="text-slate-900 text-right truncate pl-2">{selectedOption}</strong>

              <span>合計料金:</span>
              <strong className="text-amber-800 font-extrabold text-sm text-right">
                ¥{totalAmount.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* User Contact Inputs */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              お客様情報をご入力ください
            </label>

            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                代表者氏名 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="例：日南 太郎"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                ご連絡先電話番号 <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="例：090-1234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              お支払い方法を選択
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('paypay')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'paypay'
                    ? 'border-red-500 bg-red-50/70 ring-1 ring-red-500 text-red-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto text-red-600 mb-1" />
                <span className="text-xs block font-bold">PayPay</span>
                <span className="text-[10px] text-slate-500">即時決済</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 text-sky-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto text-sky-600 mb-1" />
                <span className="text-xs block font-bold">クレカ</span>
                <span className="text-[10px] text-slate-500">各種カード</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('local_pay')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'local_pay'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <span className="text-xs block font-bold">現地払い</span>
                <span className="text-[10px] text-slate-500">窓口にて</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setStep(2)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>戻る</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmReservation}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>予約・QRチケット発行中...</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>予約確定・QRチケットを発行する</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
