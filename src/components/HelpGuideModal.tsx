import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Sun,
  Moon,
  Sunset,
  Ticket,
  QrCode,
  CalendarCheck,
  Compass,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBooking?: () => void;
  onNavigateToTickets?: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToBooking,
  onNavigateToTickets,
}) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'booking' | 'daynight' | 'faq'>('basics');

  if (!isOpen) return null;

  return (
    <div
      id="modal-help-guide"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner text-amber-300">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
                  ご利用ガイド
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-0.5 tracking-tight font-['M_PLUS_Rounded_1c']">
                  ときめぐり日南 操作説明＆使い方
                </h3>
              </div>
            </div>
            <button
              id="btn-close-help-modal"
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-sky-100 mt-2 font-medium">
            昼と夜で異なる日南の観光スポット探索・混雑状況確認から、事前予約・QRチケット提示までの手順をご案内します。
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('basics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'basics'
                  ? 'bg-white text-sky-800 shadow-md scale-102'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>基本操作＆スポット探索</span>
            </button>

            <button
              onClick={() => setActiveTab('daynight')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'daynight'
                  ? 'bg-white text-sky-800 shadow-md scale-102'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>昼と夜の切り替え</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'booking'
                  ? 'bg-white text-sky-800 shadow-md scale-102'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-amber-300" />
              <span>事前予約＆QRチケット</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'faq'
                  ? 'bg-white text-sky-800 shadow-md scale-102'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <span>よくある質問 (Q&A)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* TAB 1: 基本操作 */}
          {activeTab === 'basics' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-l-4 border-sky-500 pl-3">
                <h4 className="font-bold text-slate-900 text-base">基本の使い方・画面の見方</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  日南の各エリア（海岸・飫肥城下町・油津港・南郷）のスポット情報と最新混雑度を確認できます。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 text-xs font-black">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
                      時間帯別タブでスポット表示
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      「☀️ 昼おすすめ」「🌅 夕景スポット」「🌙 夜・ライトアップ」タブで、旅行スケジュールに合わせたスポットが探せます。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-black">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
                      リアルタイム混雑ステータス
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      スポットカード右上のバッジ（「混雑なし」「適度」「やや混雑」）で現在の状況をチェック。空いている時間帯を狙って快適に回れます。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-xs font-black">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
                      昼と夜の魅力比較
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      各スポットカードには「☀️ 昼の魅力」と「🌙 夜の魅力」が並記されており、時間帯ごとの楽しみ方が一目で分かります。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 text-xs font-black">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
                      エリア絞り込みフィルター
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      「日南海岸」「飫肥城下町」「油津」「南郷」など、訪問するエリアごとに絞り込んで効率的な観光ルートが組めます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 昼と夜の切り替え */}
          {activeTab === 'daynight' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-l-4 border-amber-500 pl-3">
                <h4 className="font-bold text-slate-900 text-base">昼と夜の表示テーマ切り替え</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  アプリ全体の背景・シーニックグラフィック・テーマカラーを時間帯に合わせて変更できます。
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sun className="w-6 h-6 text-amber-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-sm">☀️ 昼モード（Day）</h5>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                        06:00 〜 15:59 自動
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      青空と紺碧の太平洋、南国のフェニックス並木が映える明るいデザイン。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sunset className="w-6 h-6 text-amber-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-sm">🌅 夕方モード（Sunset）</h5>
                      <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">
                        16:00 〜 17:59 自動
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      夕陽に染まる日南海岸と黄金色の海面、黄昏時の情緒あふれるデザイン。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Moon className="w-6 h-6 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-white text-sm">🌙 夜モード（Night）</h5>
                      <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded font-bold">
                        18:00 〜 05:59 自動
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      満天の天の川・飫肥の竹灯籠・油津のライトアップが輝くダークトーン。
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                💡 <strong>ワンポイント:</strong> ヘッダー右上の「自動（現在時刻）/ 昼 / 夕景 / 夜」ボタンを押すことで、実際の時刻に関わらずいつでも好きなモードをプレビューできます。
              </div>
            </div>
          )}

          {/* TAB 3: 事前予約＆QRチケット */}
          {activeTab === 'booking' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-l-4 border-teal-500 pl-3">
                <h4 className="font-bold text-slate-900 text-base">事前予約とデジタルチケットの利用方法</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  要予約スポットの予約手順と、当日のQRコード提示手順です。
                </p>
              </div>

              {/* Step by Step Flow */}
              <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
                <div className="relative">
                  <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    対象スポットを選んで「事前予約する」をタップ
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    「🎫 要事前予約」の表示があるスポット（サンメッセ日南、シーカヤック体験、飫肥食べあるきパス、露天風呂ナイトパスなど）から予約画面へ進みます。
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    日時・時間枠（昼/夕/夜）・人数を選択
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    訪問予定日と希望時間帯（夕暮れ枠やナイト枠含む）、人数（大人・小人）、限定オプションを選択します。
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    予約完了後、QRコードチケットが即時発行
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    予約完了と同時に「マイチケット」へ登録され、専用チケット番号と高精度QRコードが発行されます。
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    4
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    当日は受付窓口でスマホのQRコードを提示
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    ヘッダーの「マイチケット」を開き、受付スタッフにQRコードをご提示ください（右下の拡大ボタンで全画面表示も可能です）。
                  </p>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex flex-wrap gap-2 pt-2">
                {onNavigateToBooking && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToBooking();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>事前予約画面を開く</span>
                  </button>
                )}
                {onNavigateToTickets && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToTickets();
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>マイチケット一覧を見る</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: よくある質問 */}
          {activeTab === 'faq' && (
            <div className="space-y-3.5 animate-fade-in text-xs">
              <div className="border-l-4 border-indigo-500 pl-3">
                <h4 className="font-bold text-slate-900 text-sm">よくある質問 (Q&A)</h4>
                <p className="text-slate-500 mt-0.5">
                  ご不明な点やお困りの際の解決方法をまとめました。
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="text-sky-600 font-black">Q.</span>
                  予約が不要なスポットはどうすれば利用できますか？
                </div>
                <p className="text-slate-600 pl-4 leading-relaxed">
                  鵜戸神宮や道の駅フェニックス、堀川運河など「🟢 自由見学（予約不要）」と表示されているスポットは、事前予約なしで直接いつでもご自由にお越しいただけます。
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="text-sky-600 font-black">Q.</span>
                  発行されたQRコードチケットはオフラインでも表示できますか？
                </div>
                <p className="text-slate-600 pl-4 leading-relaxed">
                  はい。端末のローカルストレージに安全に保管されるため、電波が届きにくい海岸沿いや山間部でも「マイチケット」から表示可能です。
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="text-sky-600 font-black">Q.</span>
                  受付管理コンソール（スタッフ専用）とは何ですか？
                </div>
                <p className="text-slate-600 pl-4 leading-relaxed">
                  各観光施設・窓口のスタッフが、来場客のQRコードをカメラで高速読取照合し、混雑度をワンタップで更新するための専用機能です（暗証番号「1234」でテストログイン可能）。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>日南観光を安心・快適にお楽しみください</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
