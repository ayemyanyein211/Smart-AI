import React, { useState } from 'react';
import {
  QrCode,
  Flame,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Trees,
  Scale,
  Gift,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserEcoProfile, SmartBinLocation, DepositHistoryItem } from '../types';

interface HomeFeedProps {
  lang: 'RO' | 'EN';
  user: UserEcoProfile;
  nearestBin: SmartBinLocation;
  recentDeposits: DepositHistoryItem[];
  onOpenScanner: () => void;
  onNavigateToMap: () => void;
  onNavigateToRewards: () => void;
  onAwardBonusPoints: (points: number, reason: string) => void;
  onOpenUserPass: () => void;
  onClaimDailyReward: () => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  lang,
  user,
  nearestBin,
  recentDeposits,
  onOpenScanner,
  onNavigateToMap,
  onNavigateToRewards,
  onAwardBonusPoints,
  onOpenUserPass,
  onClaimDailyReward,
}) => {
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const handleQuizChoice = (isCorrect: boolean) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    if (isCorrect) {
      setQuizFeedback(lang === 'RO' ? 'Corect! +10 puncte creditate. Grăsimea distruge reciclarea hârtiei.' : 'Correct! +10 points credited. Grease contaminates paper recycling.');
      onAwardBonusPoints(10, 'Daily Eco-Quiz');
    } else {
      setQuizFeedback(lang === 'RO' ? 'Incorect. Cartonul pătat de ulei merge la Rezidual / Biodeșeuri, nu la hârtie.' : 'Incorrect. Greasy cardboard belongs in residual or organic compost, not paper.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
            <span>{lang === 'RO' ? 'BUNĂ ZIUA' : 'WELCOME BACK'}</span>
            <span aria-hidden="true">·</span>
            <span>{user.tier}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            {lang === 'RO' ? `Salut, ${user.name.split(' ')[0]}!` : `Hello, ${user.name.split(' ')[0]}!`}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {lang === 'RO'
              ? 'Ai reciclat 86 de ambalaje în București. Continuă seria pentru recompense maxime!'
              : 'You have sorted 86 items. Keep your streak going to unlock exclusive partner rewards.'}
          </p>
        </div>

        {/* Quick Streak Badge */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 shrink-0 self-start sm:self-auto shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 fill-amber-500/40" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {lang === 'RO' ? 'Serie Activă' : 'Active Streak'}
            </div>
            <div className="text-base font-bold text-white font-mono">
              {user.streakDays} {lang === 'RO' ? 'zile' : 'days'} 🔥
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Personal Impact Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'RO' ? 'Puncte SmartWaste' : 'Reward Points'}</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {user.points}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {lang === 'RO' ? 'Gata de revendicat' : 'Ready to redeem'}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'RO' ? 'Greutate Reciclată' : 'Weight Diverted'}</span>
            <Scale className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {user.totalWeightKg} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {user.totalItemsRecycled} {lang === 'RO' ? 'ambalaje verificate' : 'verified items'}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'RO' ? 'Emisii CO₂ Evitate' : 'CO₂ Avoided'}</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {user.co2SavedKg} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {lang === 'RO' ? 'Echivalent ~120 km auto' : '~120 km driving offset'}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'RO' ? 'Copaci & Donații' : 'Trees & Donations'}</span>
            <Trees className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {user.treesPlanted} <span className="text-sm font-normal text-slate-400">arbori</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {user.totalDonatedRon} RON {lang === 'RO' ? 'donați comunitar' : 'donated'}
          </span>
        </div>
      </div>

      {/* Street SmartBin Pass Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                {lang === 'RO' ? 'Codul tău personal de coș stradal:' : 'Your public street bin pass code:'}
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/40">
                {user.userCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'RO'
                ? 'Arată codul QR sau tastează codul pe ecranul oricărui coș public din oraș pentru a sincroniza punctele!'
                : 'Scan this code at ANY public bin screen to automatically collect points to this account.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUserPass}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
        >
          {lang === 'RO' ? 'Arată Pass / QR' : 'Show Pass QR'}
        </button>
      </div>

      {/* Daily Login Reward / Streak Track Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'RO' ? 'BONUS LOGARE ZILNICĂ' : 'DAILY LOGIN REWARD TRACK'}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {lang === 'RO' ? 'Colectează Puncte Conectându-te în Fiecare Zi' : 'Collect Free Points Every Day You Log In'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'RO'
                ? 'Păstrează seria de 7 zile pentru a debloca bonusul maxim de +100 puncte.'
                : 'Maintain your 7-day streak to unlock the ultimate +100 eco bonus.'}
            </p>
          </div>

          <button
            onClick={onClaimDailyReward}
            disabled={user.hasClaimedDailyToday}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0 ${
              user.hasClaimedDailyToday
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {user.hasClaimedDailyToday ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'RO' ? 'Revendicat Astăzi (+25 pts)' : 'Claimed Today (+25 pts)'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'RO' ? 'Revendică Puncte Ziua 4 (+25 pts)' : 'Claim Day 4 (+25 pts)'}</span>
              </>
            )}
          </button>
        </div>

        {/* 7-Day Visual Progress Track */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {[
            { day: 1, pts: 10, isClaimed: true },
            { day: 2, pts: 15, isClaimed: true },
            { day: 3, pts: 20, isClaimed: true },
            { day: 4, pts: 25, isCurrent: true, isClaimed: user.hasClaimedDailyToday },
            { day: 5, pts: 30, isClaimed: false },
            { day: 6, pts: 40, isClaimed: false },
            { day: 7, pts: 100, isClaimed: false, isSpecial: true },
          ].map((d) => (
            <div
              key={d.day}
              className={`rounded-xl border p-2 text-center flex flex-col justify-between transition-all ${
                d.isCurrent && !d.isClaimed
                  ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/30 shadow-md'
                  : d.isClaimed
                  ? 'bg-slate-950 border-slate-800/80 opacity-70'
                  : d.isSpecial
                  ? 'bg-slate-950 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                Z{d.day}
              </span>

              <span
                className={`text-xs font-mono font-bold my-1 ${
                  d.isSpecial ? 'text-amber-400' : d.isClaimed ? 'text-emerald-400' : 'text-white'
                }`}
              >
                +{d.pts}
              </span>

              <span className="text-[9px] font-mono">
                {d.isClaimed ? (
                  <span className="text-emerald-400">✓</span>
                ) : d.isCurrent ? (
                  <span className="text-emerald-400 font-bold">AZI</span>
                ) : (
                  <span className="text-slate-500">🔒</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Hero Card: Smart Bin Visual with Direct Scan Button */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 md:col-span-7 z-10">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium mb-1">
              <span>{lang === 'RO' ? 'SORTARE ASISTATĂ DE CAMERĂ' : 'CAMERA-GUIDED SORTING'}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'RO' ? 'Fără amenzi' : 'No-fines policy'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {lang === 'RO'
                ? 'Scanează un ambalaj și vezi trapa care se deschide automat'
                : 'Scan any item to instantly unlock the correct smart bin opening'}
            </h2>
            <p className="text-sm text-slate-300 mt-3 max-w-xl leading-relaxed">
              {lang === 'RO'
                ? 'Coșul inteligent SmartWaste AI recunoaște plasticul, metalul, hârtia și biodeșeurile în 400ms. Deschide doar trapa potrivită și îți creditează portofelul cu puncte.'
                : 'Our on-device camera AI estimates packaging material in 400ms, illuminates the exact bin lid, unlocks the flap, and credits your rewards wallet.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenScanner}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all font-sans"
              >
                <QrCode className="w-5 h-5" />
                <span>{lang === 'RO' ? 'Deschide Camera & Scanează' : 'Open Camera & Scan'}</span>
              </button>

              <button
                onClick={onNavigateToMap}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'RO' ? 'Găsește un coș în apropiere' : 'Find Nearest Bin'}</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5 h-64 md:h-full relative overflow-hidden min-h-[280px]">
            <img
              src="/src/assets/images/smartwaste_hero_bin_1791504886360.jpg"
              alt="SmartWaste AI modern smart bin station in Bucharest"
              className="w-full h-full object-cover object-center brightness-95 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent md:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden block" />
          </div>
        </div>
      </div>

      {/* Two-Column Interactive Row: Nearest Smart Bin Status & Daily Eco Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Nearest Smart Bin Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  {lang === 'RO' ? 'Cel mai apropiat coș inteligent' : 'Nearest Smart Bin Station'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                {nearestBin.distanceMeters}m · {nearestBin.walkingMin} min {lang === 'RO' ? 'mers' : 'walk'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mt-3">
              {nearestBin.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {nearestBin.address}
            </p>

            {/* Live Fill Bars */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {lang === 'RO' ? 'Disponibilitate Compartimente (Live)' : 'Compartment Fill Status (Live)'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {nearestBin.streams.map((stream) => (
                  <div key={stream.type} className="bg-slate-950 border border-slate-800/80 rounded-lg p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300 font-medium text-[11px] truncate">{stream.label}</span>
                      <span className="font-mono text-slate-400 font-bold text-[11px]">{stream.fillPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${stream.fillPercent}%`,
                          backgroundColor: stream.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {lang === 'RO' ? 'Deschis 24/7 · Acces scaun rotile' : 'Open 24/7 · Accessible'}
            </span>
            <button
              onClick={onNavigateToMap}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>{lang === 'RO' ? 'Vezi pe Hartă' : 'View on Map'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Eco-Quiz Challenge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">
                  {lang === 'RO' ? 'Provocarea Zilei · Cunoștințe Eco' : 'Daily Eco Knowledge Quiz'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                +10 puncte
              </span>
            </div>

            <h3 className="text-base font-bold text-white mt-3">
              {lang === 'RO'
                ? 'Unde arunci o cutie de pizza pătată cu ulei de la livrare?'
                : 'Where should a greasy takeaway pizza box be deposited?'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'RO'
                ? 'Răspunde corect pentru a învăța regulile locale de sortare și a câștiga puncte.'
                : 'Select the correct stream to prevent contamination and earn bonus points.'}
            </p>

            {/* Quiz Choices */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleQuizChoice(false)}
                disabled={quizAnswered}
                className="w-full text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-xs text-slate-200 transition-colors disabled:opacity-60 flex items-center justify-between"
              >
                <span>A) La Hârtie & Carton, pentru că e făcută din carton</span>
                <span className="text-slate-500">→</span>
              </button>

              <button
                onClick={() => handleQuizChoice(true)}
                disabled={quizAnswered}
                className="w-full text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-xs text-slate-200 transition-colors disabled:opacity-60 flex items-center justify-between"
              >
                <span>B) La Deșeuri Reziduale / Compost (grăsimea nu se reciclează)</span>
                <span className="text-emerald-400 font-bold">✓</span>
              </button>
            </div>

            {quizFeedback && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200">
                {quizFeedback}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            {lang === 'RO' ? 'O nouă întrebare în fiecare zi la miezul nopții' : 'Refreshes every day at midnight'}
          </div>
        </div>
      </div>

      {/* Recent Activity Mini-Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            {lang === 'RO' ? 'Depuneri Recente Verificate' : 'Recent Verified Deposits'}
          </h3>
          <button
            onClick={onNavigateToRewards}
            className="text-xs font-semibold text-emerald-400 hover:underline"
          >
            {lang === 'RO' ? 'Toate depunerile' : 'View full history'}
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {recentDeposits.slice(0, 3).map((dep) => (
            <div key={dep.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">{dep.itemName}</span>
                <span className="text-[11px] text-slate-400">
                  {dep.binName} · {dep.timestamp}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-400">+{dep.pointsEarned} pts</span>
                <span className="text-[11px] text-slate-400 block font-mono">{dep.weightG}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
