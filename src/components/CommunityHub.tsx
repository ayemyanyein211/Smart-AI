import React, { useState } from 'react';
import {
  Users,
  Calendar,
  MapPin,
  Award,
  CheckCircle,
  TrendingUp,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Heart,
  CreditCard,
  Building
} from 'lucide-react';
import { COMMUNITY_EVENTS, ECO_TIPS, COMMUNITY_DONATION_PROGRAMS, DONORS_LEADERBOARD } from '../data/mockData';
import { CommunityEvent, CommunityProgramDonation, DonorLeaderboardItem } from '../types';

interface CommunityHubProps {
  lang: 'RO' | 'EN';
  onRsvpEvent: (eventId: string) => void;
  onOpenDonation: (program: CommunityProgramDonation) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  lang,
  onRsvpEvent,
  onOpenDonation,
}) => {
  const [events, setEvents] = useState<CommunityEvent[]>(COMMUNITY_EVENTS);
  const [donationPrograms, setDonationPrograms] = useState<CommunityProgramDonation[]>(COMMUNITY_DONATION_PROGRAMS);
  const [activeTab, setActiveTab] = useState<'donations' | 'events' | 'leaderboard' | 'academy'>('donations');
  const [leaderboardCategory, setLeaderboardCategory] = useState<'donors' | 'sorters'>('donors');

  const toggleRsvp = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRsvp: !e.isRsvp } : e))
    );
    onRsvpEvent(id);
  };

  const leaderboardUsers = [
    { rank: 1, name: 'Elena Ionescu', city: 'București (Sector 3)', items: 342, points: 5120, badge: 'Eco Legend' },
    { rank: 2, name: 'Mihai Dobre', city: 'Cluj-Napoca (Centru)', items: 289, points: 4330, badge: 'Zero-Waste Master' },
    { rank: 3, name: 'Aye Mya Nyein (Tu)', city: 'București (Sector 6)', items: 86, points: 1420, badge: 'Circular Champion' },
    { rank: 4, name: 'Andreea Radu', city: 'București (Sector 1)', items: 78, points: 1210, badge: 'Green Scout' },
    { rank: 5, name: 'Cristian Stan', city: 'Cluj-Napoca (Mănăștur)', items: 71, points: 1090, badge: 'Eco Enthusiast' },
  ];

  return (
    <div className="space-y-6">
      {/* Community Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{lang === 'RO' ? 'IMPACT SOCIAL & COMUNITATE' : 'SOCIAL IMPACT & COMMUNITY'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              {lang === 'RO' ? 'Donații Comunitare & Locuri de Muncă Verzi' : 'Community Donations & Green Inclusion'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {lang === 'RO'
                ? 'Poți dona puncte de sortare sau plăti în siguranță cu cardul pentru Academia Roma, micro-cooperative locale și plantarea de arbori urbani.'
                : 'Donate collected points or pay safely with card to fund Roma technician training, local micro-cooperatives, and urban trees.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'donations' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{lang === 'RO' ? 'Donații Comunitare' : 'Donations'}</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'events' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'RO' ? 'Evenimente Eco' : 'Clean-Ups'}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'leaderboard' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'RO' ? 'Clasament' : 'Leaderboard'}
            </button>
            <button
              onClick={() => setActiveTab('academy')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'academy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'RO' ? 'Academia Roma' : 'Impact Roma'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab 0: Community Donation Programs */}
      {activeTab === 'donations' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {donationPrograms.map((prog) => {
              const progressPercent = Math.min(100, Math.round((prog.raisedRon / prog.targetRon) * 100));

              return (
                <div
                  key={prog.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        {progressPercent}% Finanțat
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {prog.donorCount} {lang === 'RO' ? 'donatori' : 'supporters'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                      {lang === 'RO' ? prog.titleRo : prog.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 block mb-3 font-medium">
                      {prog.partner}
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {prog.summary}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">
                          {prog.raisedRon.toLocaleString()} RON strânși
                        </span>
                        <span className="text-slate-400">
                          Țintă: {prog.targetRon.toLocaleString()} RON
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Donate CTA button */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => onOpenDonation(prog)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{lang === 'RO' ? 'Donează cu Card sau Puncte' : 'Donate with Card or Points'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transparency Callout */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'RO'
                  ? 'Toate donațiile primesc chitanță fiscală verde deductibilă conform legislației românești.'
                  : 'All community donations generate certified tax-deductible green receipts.'}
              </span>
            </div>
            <span className="font-mono text-emerald-400 font-bold text-[11px] hidden sm:inline">100% AUDITAT</span>
          </div>

          {/* Top Donors Showcase Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                🏆
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {lang === 'RO' ? 'Podium Donatori: Elena Ionescu conduce clasamentul cu 650 RON' : 'Leaderboard: Elena Ionescu leads with 650 RON'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'RO' ? 'Vezi clasamentul complet al susținătorilor comunității.' : 'Explore the full community supporters leaderboard.'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('leaderboard');
                setLeaderboardCategory('donors');
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>{lang === 'RO' ? 'Vezi Clasamentul Donatorilor' : 'View Donor Leaderboard'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 1: Clean-Up Events */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      +{evt.pointsBonus} {lang === 'RO' ? 'puncte bonus' : 'bonus pts'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {evt.city}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 my-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.date} · {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.participants} {lang === 'RO' ? 'voluntari înscriși' : 'attendees'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => toggleRsvp(evt.id)}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      evt.isRsvp
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>
                      {evt.isRsvp
                        ? (lang === 'RO' ? 'Înscris ✓ (Participi)' : 'Attending ✓')
                        : (lang === 'RO' ? 'Mă Înscriu ca Voluntar' : 'Join Clean-Up')}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Eco Tips Section */}
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'RO' ? 'Ghiduri & Sfaturi Practice pentru Acasă' : 'Eco Tips & Zero-Waste Habits'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {ECO_TIPS.map((tip) => (
                <div key={tip.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono mb-1">
                    <span>{tip.category}</span>
                    <span className="text-slate-500">{tip.readTime}</span>
                  </div>
                  <h4 className="font-bold text-white mb-1">{tip.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                {leaderboardCategory === 'donors'
                  ? (lang === 'RO' ? 'Clasamentul Donatorilor Comunitari' : 'Community Donors Leaderboard')
                  : (lang === 'RO' ? 'Clasamentul Campionilor Verzi la Sortare' : 'Eco-Sorting Champions Leaderboard')}
              </h3>
              <p className="text-xs text-slate-400">
                {leaderboardCategory === 'donors'
                  ? (lang === 'RO'
                    ? 'Persoane și echipe care finanțează Academia Roma, împăduririle și locurile de muncă verzi'
                    : 'Supporters funding Roma vocational training, urban trees, and inclusive micro-coops')
                  : (lang === 'RO'
                    ? 'Top utilizatori din București și Cluj în această lună după numărul de ambalaje reciclate'
                    : 'Top sorting citizens this month by verified packaging items')}
              </p>
            </div>

            {/* Sub-toggle: Donors vs Sorters */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
              <button
                onClick={() => setLeaderboardCategory('donors')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  leaderboardCategory === 'donors'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span>{lang === 'RO' ? 'Top Donatori' : 'Top Donors'}</span>
              </button>
              <button
                onClick={() => setLeaderboardCategory('sorters')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  leaderboardCategory === 'sorters'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3 h-3" />
                <span>{lang === 'RO' ? 'Top Reciclatori' : 'Top Sorters'}</span>
              </button>
            </div>
          </div>

          {/* Sub-view A: Donation Person Leaderboard */}
          {leaderboardCategory === 'donors' ? (
            <div className="space-y-4">
              {/* Podium Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DONORS_LEADERBOARD.slice(0, 3).map((donor) => (
                  <div
                    key={donor.rank}
                    className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all relative overflow-hidden ${
                      donor.rank === 1
                        ? 'bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : donor.rank === 2
                        ? 'bg-gradient-to-b from-slate-800/40 via-slate-950 to-slate-950 border-slate-700'
                        : 'bg-gradient-to-b from-emerald-950/30 via-slate-950 to-slate-950 border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">
                        {donor.rank === 1 ? '🥇' : donor.rank === 2 ? '🥈' : '🥉'}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {donor.badge}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-white text-sm block">
                        {donor.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block mb-3">
                        {donor.city}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Total Donat</span>
                        <span className="text-sm font-mono font-bold text-emerald-400">
                          {donor.totalDonatedRon} RON
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block uppercase">Puncte Eco</span>
                        <span className="text-xs font-mono text-slate-300 font-semibold">
                          {donor.pointsDonated} pts
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Donor List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {lang === 'RO' ? 'Toți Susținătorii & Donatorii Comunitari' : 'All Community Donors & Patrons'}
                </span>

                {DONORS_LEADERBOARD.map((donor) => (
                  <div
                    key={donor.rank}
                    className={`flex items-center justify-between p-3.5 rounded-lg border text-xs transition-colors ${
                      donor.isCurrentUser
                        ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                          donor.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : donor.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : donor.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {donor.rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">
                            {donor.name}
                          </span>
                          {donor.isCurrentUser && (
                            <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                              CONTUL TĂU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {donor.city} · <strong className="text-slate-300 font-normal">{donor.badge}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-emerald-400 block tabular-nums">
                        {donor.totalDonatedRon} RON
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        +{donor.pointsDonated} puncte donate
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action: Donate and Climb Leaderboard */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {lang === 'RO' ? 'Vrei să ajuți comunitatea și să urci în clasament?' : 'Want to support and join the leaderboard?'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'RO'
                        ? 'Poți dona 10 RON cu cardul securizat sau 100 de puncte din reciclare.'
                        : 'Donate 10 RON securely with card or 100 points from recycling.'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenDonation(donationPrograms[0])}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{lang === 'RO' ? 'Donează Acum' : 'Donate Now'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sub-view B: Eco-Champions Leaderboard (Sorting Points) */
            <div className="space-y-2">
              {leaderboardUsers.map((u) => (
                <div
                  key={u.rank}
                  className={`flex items-center justify-between p-3.5 rounded-lg border text-xs transition-colors ${
                    u.name.includes('(Tu)')
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        u.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : u.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : u.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.rank}
                    </div>

                    <div>
                      <span className="font-bold text-white block">
                        {u.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {u.city} · <strong className="text-slate-300">{u.badge}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-emerald-400 block tabular-nums">
                      {u.points.toLocaleString()} pts
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {u.items} ambalaje
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Roma Skills Academy */}
      {activeTab === 'academy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{lang === 'RO' ? 'INCLUZIUNE SOCIALĂ & JOBURI VERZI' : 'INCLUSIVE GREEN JOBS'}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {lang === 'RO' ? 'Academia de Abilități Roma & Micro-Cooperative' : 'Roma Skills Academy & Green Micro-Cooperatives'}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {lang === 'RO'
                  ? 'Fiecare ambalaj reciclat în coșurile SmartWaste AI susține locuri de muncă formale și programe de calificare profesională pentru membrii comunității Roma în asamblare IoT, mentenanță tehnică a senzorilor și colectare sigură cu echipament de protecție.'
                  : 'Every verified deposit in SmartWaste AI smart bins helps fund paid vocational training, fair contracts, and IoT technician apprenticeships for members of the Roma community.'}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Tehnicieni Calificați</span>
                  <span className="text-base font-bold text-white font-mono mt-0.5 block">28 persoane</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Contracte Legale</span>
                  <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">100% Salarii Drepte</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 h-48 md:h-full rounded-xl overflow-hidden border border-slate-800 relative">
              <img
                src="/src/assets/images/smartwaste_community_academy_1791504917490.jpg"
                alt="Roma Skills Academy training workshop"
                className="w-full h-full object-cover brightness-90 contrast-105"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
