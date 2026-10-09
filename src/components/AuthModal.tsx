import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  LogOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserEcoProfile } from '../types';

interface AuthModalProps {
  lang: 'RO' | 'EN';
  isOpen: boolean;
  onClose: () => void;
  user: UserEcoProfile;
  onLogin: (email: string, name: string) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  lang,
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
}) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [emailInput, setEmailInput] = useState<string>(user.email);
  const [nameInput, setNameInput] = useState<string>(user.name);
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onLogin(emailInput, nameInput || 'Alexandru Popa');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {user.isAuthenticated ? (
          /* Profile & Account Details View */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] mx-auto shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.name.charAt(0)}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {user.tier} · Membru din {user.memberSince}
              </span>
            </div>

            {/* User Code Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Cod Unic Coș Public:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm tracking-wide">
                  {user.userCode}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">PIN Tastatură:</span>
                <span className="font-mono font-bold text-white">{user.pinCode}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Puncte Colectate:</span>
                <span className="font-mono font-bold text-emerald-400">{user.points} pts</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'RO' ? 'Deconectare' : 'Sign Out'}</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                {lang === 'RO' ? 'Închide' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isLoginMode
                  ? (lang === 'RO' ? 'Autentificare Cont Cetățean' : 'Citizen Email Sign In')
                  : (lang === 'RO' ? 'Înregistrare Cont Nou' : 'Create New Account')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'RO'
                  ? 'Primești automat codul tău unic QR pentru a colecta puncte la orice coș stradal.'
                  : 'Automatically receive your personal QR code to sync points from any bin.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {!isLoginMode && (
                <div>
                  <label className="block text-slate-400 mb-1">Nume & Prenume</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Alexandru Popa"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Email Utilizator</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ayemyanyein211@gmail.com"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Parolă Cont</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all font-sans mt-2"
              >
                {isLoginMode
                  ? (lang === 'RO' ? 'Conectează-te la Cont' : 'Sign In')
                  : (lang === 'RO' ? 'Creează Cont & Generează Cod' : 'Register & Get User Code')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-xs text-emerald-400 hover:underline"
              >
                {isLoginMode
                  ? (lang === 'RO' ? 'Nu ai cont? Înregistrează-te gratuit' : "Don't have an account? Register free")
                  : (lang === 'RO' ? 'Ai deja cont? Conectează-te' : 'Already have an account? Sign in')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
