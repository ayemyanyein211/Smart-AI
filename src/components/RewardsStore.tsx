import React, { useState } from 'react';
import {
  Gift,
  Bus,
  ShoppingBag,
  Coffee,
  Sparkles,
  Trees,
  Film,
  CheckCircle2,
  Clock,
  ArrowRight,
  QrCode,
  Tag,
  ExternalLink,
  X
} from 'lucide-react';
import { UserEcoProfile, RewardItem, RedeemedVoucher } from '../types';
import { REWARDS_CATALOG } from '../data/mockData';

interface RewardsStoreProps {
  lang: 'RO' | 'EN';
  user: UserEcoProfile;
  redeemedVouchers: RedeemedVoucher[];
  onRedeemReward: (reward: RewardItem) => void;
  onMarkVoucherUsed: (voucherId: string) => void;
}

export const RewardsStore: React.FC<RewardsStoreProps> = ({
  lang,
  user,
  redeemedVouchers,
  onRedeemReward,
  onMarkVoucherUsed,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedVoucherModal, setSelectedVoucherModal] = useState<RedeemedVoucher | null>(null);
  const [viewMode, setViewMode] = useState<'catalog' | 'my_vouchers'>('catalog');

  const filteredRewards = REWARDS_CATALOG.filter((r) => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bus':
        return <Bus className="w-5 h-5 text-sky-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Trees':
        return <Trees className="w-5 h-5 text-green-400" />;
      case 'Film':
        return <Film className="w-5 h-5 text-rose-400" />;
      default:
        return <Gift className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleRedeemClick = (reward: RewardItem) => {
    if (user.points < reward.pointsCost) {
      alert(lang === 'RO' ? 'Ai nevoie de mai multe puncte pentru această recompensă!' : 'You need more points for this reward!');
      return;
    }
    onRedeemReward(reward);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
              <Gift className="w-3.5 h-3.5" />
              <span>{lang === 'RO' ? 'MAGAZIN RECOMPENSE PARTENERI' : 'PARTNER REWARDS STORE'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              {lang === 'RO' ? 'Transformă Sortarea în Beneficii Reale' : 'Turn Clean Recycling into Real Savings'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {lang === 'RO'
                ? 'Punctele acumulate pot fi preschimbate instant în tichete STB, vouchere Mega Image, cafea de specialitate sau donații pentru copaci.'
                : 'Instantly convert your sorting points into public transit passes, grocery vouchers, campus coffee discounts, or trees.'}
            </p>
          </div>

          {/* Points Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shrink-0 flex items-center gap-4">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-medium block">
                {lang === 'RO' ? 'Sold Puncte' : 'Points Balance'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  {user.points}
                </span>
                <span className="text-xs text-emerald-400 font-semibold font-mono">
                  {lang === 'RO' ? 'puncte' : 'pts'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher: Catalog vs My Vouchers */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setViewMode('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'catalog'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'RO' ? 'Toate Ofertele Disponibile' : 'All Available Rewards'}
          </button>

          <button
            onClick={() => setViewMode('my_vouchers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              viewMode === 'my_vouchers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{lang === 'RO' ? 'Voucherele Mele Active' : 'My Active Vouchers'}</span>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-mono text-[11px] flex items-center justify-center font-bold">
              {redeemedVouchers.filter((v) => !v.isUsed).length}
            </span>
          </button>
        </div>
      </div>

      {/* Mode 1: Rewards Catalog */}
      {viewMode === 'catalog' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', labelRo: 'Toate', labelEn: 'All' },
              { id: 'transit', labelRo: 'Transport STB', labelEn: 'Transit' },
              { id: 'food', labelRo: 'Supermarket Mega Image', labelEn: 'Groceries' },
              { id: 'student', labelRo: 'Cafea & Studenți', labelEn: 'Campus Coffee' },
              { id: 'store', labelRo: 'Produse Reîncărcabile dm', labelEn: 'Eco Stores' },
              { id: 'eco', labelRo: 'Plantează Copaci', labelEn: 'Plant Trees' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'RO' ? cat.labelRo : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRewards.map((reward) => {
              const canAfford = user.points >= reward.pointsCost;

              return (
                <div
                  key={reward.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        {getRewardIcon(reward.iconName)}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                          {reward.pointsCost}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">pts</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {reward.partnerName}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono font-bold text-xs">
                      {reward.valueRon}
                    </span>

                    <button
                      onClick={() => handleRedeemClick(reward)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>{canAfford ? (lang === 'RO' ? 'Revendică' : 'Redeem') : (lang === 'RO' ? 'Puncte insuficiente' : 'Need more pts')}</span>
                      {canAfford && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: My Active Vouchers */}
      {viewMode === 'my_vouchers' && (
        <div className="space-y-4">
          {redeemedVouchers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
              <Gift className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">
                {lang === 'RO' ? 'Nu ai niciun voucher revendicat încă' : 'No active vouchers yet'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'RO'
                  ? 'Alege o ofertă din catalog și folosește punctele pentru bilete de transport sau reduceri.'
                  : 'Select an offer from the catalog to convert points into digital store passes.'}
              </p>
              <button
                onClick={() => setViewMode('catalog')}
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                {lang === 'RO' ? 'Vezi Ofertele' : 'Browse Offers'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redeemedVouchers.map((v) => (
                <div
                  key={v.id}
                  className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between shadow-sm ${
                    v.isUsed ? 'border-slate-800 opacity-60' : 'border-emerald-500/40 bg-slate-900/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-emerald-400">
                        {v.partnerName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {v.expiresAt}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2">{v.title}</h4>

                    {/* Barcode / Code Card */}
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center my-3">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        COD DIGITAL VALABIL LA CASĂ:
                      </span>
                      <span className="text-lg font-mono font-bold text-white tracking-widest mt-1 block">
                        {v.code}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedVoucherModal(v)}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{lang === 'RO' ? 'Afișează Pass / QR' : 'Show Digital Pass'}</span>
                    </button>

                    {!v.isUsed ? (
                      <button
                        onClick={() => onMarkVoucherUsed(v.id)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                      >
                        {lang === 'RO' ? 'Marchează ca Folosit' : 'Mark as Used'}
                      </button>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">UTILIZAT</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Digital Pass / QR Code Modal */}
      {selectedVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedVoucherModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">{selectedVoucherModal.title}</h3>
            <p className="text-xs text-slate-400">{selectedVoucherModal.partnerName}</p>

            {/* Simulated QR Code Canvas */}
            <div className="w-44 h-44 bg-white p-3 rounded-xl mx-auto shadow-inner flex flex-col items-center justify-center">
              <div className="w-full h-full bg-slate-950 p-2 rounded flex flex-col items-center justify-center">
                <QrCode className="w-28 h-28 text-white" />
                <span className="text-[9px] font-mono text-slate-400 mt-1">SCAN AT CHECKOUT</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-sm font-bold text-emerald-400 tracking-wider">
              {selectedVoucherModal.code}
            </div>

            <p className="text-[11px] text-slate-400">
              {lang === 'RO'
                ? 'Prezintă acest ecran la casier sau scanează codul la terminalul STB.'
                : 'Show this digital pass to the cashier or tap at the transit validator.'}
            </p>

            <button
              onClick={() => setSelectedVoucherModal(null)}
              className="w-full py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
            >
              {lang === 'RO' ? 'Închide' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
