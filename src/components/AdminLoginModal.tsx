import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '1234' || pin === 'admin') {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('暗証番号が正しくありません（デモ用PIN: 1234）');
    }
  };

  const handleQuickDemo = () => {
    setPin('1234');
    setError('');
    onSuccess();
  };

  return (
    <div
      id="modal-admin-login"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative space-y-5">
        <button
          id="btn-close-admin-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">現場スタッフ専用ログイン</h3>
          <p className="text-xs text-slate-500">
            運行状況・待ち時間更新および乗車QRコードスキャンを行います。
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              スタッフPINコード（4桁）
            </label>
            <input
              id="input-admin-pin"
              type="password"
              maxLength={8}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="1234"
              className="w-full text-center text-2xl tracking-widest font-mono font-bold py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
            {error && <p className="text-xs text-red-500 font-bold mt-1 text-center">{error}</p>}
          </div>

          <button
            id="btn-submit-admin-login"
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>ダッシュボードへログイン</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            id="btn-quick-staff-login"
            type="button"
            onClick={handleQuickDemo}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 underline"
          >
            【デモ用】ワンタップでスタッフ認証する（PIN: 1234）
          </button>
        </div>
      </div>
    </div>
  );
};
