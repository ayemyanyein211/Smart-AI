import React from 'react';
import {
  Sparkles,
  QrCode,
  MapPin,
  Gift,
  Users,
  Compass,
  Flame,
  Search,
  User,
  CreditCard
} from 'lucide-react';
import { UserEcoProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'RO' | 'EN';
  setLang: (lang: 'RO' | 'EN') => void;
  user: UserEcoProfile;
  onOpenScanner: () => void;
  onOpenChat: () => void;
  onOpenUserPass: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  user,
  onOpenScanner,
  onOpenChat,
  onOpenUserPass,
  onOpenAuth,
  onOpenSettings,
}) => {
  return (
    <>
      {/* Desktop / Tablet Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            {/* Zone 1: Single text wordmark */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-sm shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-emerald-400 font-bold text-base">
                  ♻
                </div>
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block leading-tight">
                  SmartWaste
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {lang === 'RO' ? 'Reciclare & Recompense' : 'Recycle & Earn Rewards'}
                </span>
              </div>
            </button>

            {/* Zone 2: 4-5 concise single-line nav links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <button
                onClick={() => setActiveTab('home')}
                className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
                  activeTab === 'home'
                    ? 'border-emerald-400 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'RO' ? 'Acasă' : 'Home'}
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
                  activeTab === 'map'
                    ? 'border-emerald-400 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'RO' ? 'Coșuri Proximitate' : 'Find Bins'}
              </button>

              <button
                onClick={() => setActiveTab('rewards')}
                className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
                  activeTab === 'rewards'
                    ? 'border-emerald-400 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'RO' ? 'Magazin Recompense' : 'Rewards'}
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
                  activeTab === 'community'
                    ? 'border-emerald-400 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'RO' ? 'Comunitate & Donații' : 'Community & Donate'}
              </button>
            </nav>

            {/* Zone 3: Action Area with User Code Pass & Profile */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* User Public Bin Pass Trigger */}
              <button
                onClick={onOpenUserPass}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 text-xs font-mono font-semibold transition-all shadow-sm"
                title="Codul tău personal pentru orice coș public"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.userCode}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'RO' ? 'EN' : 'RO')}
                className="text-xs font-semibold px-2 py-1.5 rounded-md border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
              >
                {lang}
              </button>

              {/* User Points Badge */}
              <button
                onClick={() => setActiveTab('rewards')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition-colors"
              >
                <span className="font-mono text-white tabular-nums font-bold">{user.points}</span>
                <span>{lang === 'RO' ? 'pct' : 'pts'}</span>
              </button>

              {/* Account Profile Avatar / Login */}
              <button
                onClick={onOpenAuth}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title={user.email}
              >
                <User className="w-4 h-4 text-emerald-400" />
              </button>

              {/* Settings Gear */}
              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title={lang === 'RO' ? 'Setări cont' : 'Settings'}
              >
                <span className="text-sm">⚙</span>
              </button>

              {/* Primary CTA: Camera Scan */}
              <button
                onClick={onOpenScanner}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-lg shadow-sm shadow-emerald-500/20 transition-all font-sans whitespace-nowrap shrink-0"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'RO' ? 'Scanează' : 'Scan'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 ${
            activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">{lang === 'RO' ? 'Acasă' : 'Home'}</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 py-1 ${
            activeTab === 'map' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-medium">{lang === 'RO' ? 'Coșuri' : 'Bins'}</span>
        </button>

        {/* Center Floating Scan Button */}
        <button
          onClick={onOpenScanner}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-slate-950 focus:outline-none"
        >
          <QrCode className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex flex-col items-center gap-1 py-1 ${
            activeTab === 'rewards' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] font-medium">{lang === 'RO' ? 'Premii' : 'Rewards'}</span>
        </button>

        <button
          onClick={onOpenUserPass}
          className="flex flex-col items-center gap-1 py-1 text-emerald-400"
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px] font-medium font-mono">Cod ID</span>
        </button>
      </div>
    </>
  );
};
