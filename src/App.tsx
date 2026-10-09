import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { NearbyBinsMap } from './components/NearbyBinsMap';
import { RewardsStore } from './components/RewardsStore';
import { CommunityHub } from './components/CommunityHub';
import { ScannerModal } from './components/ScannerModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { UserPassModal } from './components/UserPassModal';
import { DonationCardModal } from './components/DonationCardModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { EmergencyNotificationBar } from './components/EmergencyNotificationBar';
import {
  INITIAL_USER,
  SMART_BINS,
  INITIAL_DEPOSITS,
  COMMUNITY_DONATION_PROGRAMS,
  DEFAULT_SETTINGS,
  INITIAL_EMERGENCY_ALERTS
} from './data/mockData';
import {
  UserEcoProfile,
  SmartBinLocation,
  RecognizedItem,
  DepositHistoryItem,
  RewardItem,
  RedeemedVoucher,
  CommunityProgramDonation,
  DonationReceipt,
  UserAppSettings,
  EmergencyAlert
} from './types';
import { CheckCircle, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [lang, setLang] = useState<'RO' | 'EN'>('RO');
  const [user, setUser] = useState<UserEcoProfile>(INITIAL_USER);
  const [bins, setBins] = useState<SmartBinLocation[]>(SMART_BINS);
  const [settings, setSettings] = useState<UserAppSettings>(DEFAULT_SETTINGS);
  const [deposits, setDeposits] = useState<DepositHistoryItem[]>(INITIAL_DEPOSITS);
  const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[]>([
    {
      id: 'VOUCH-01',
      rewardId: 'REW-01',
      title: 'Abonament STB 24 Ore (Toate Liniile)',
      partnerName: 'STB Transport Public București',
      code: 'STB-9284-ECO',
      redeemedAt: 'Ieri, 14:20',
      expiresAt: 'Expiră în 29 de zile',
      isUsed: false,
    },
  ]);

  // Modal states
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isUserPassOpen, setIsUserPassOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedDonationProgram, setSelectedDonationProgram] = useState<CommunityProgramDonation | null>(null);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_EMERGENCY_ALERTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Claim Daily Login Reward Points
  const handleClaimDailyReward = () => {
    if (user.hasClaimedDailyToday) {
      showToast(lang === 'RO' ? 'Ai revendicat deja bonusul de logare zilnică pentru azi!' : 'Already claimed today\'s daily login bonus!');
      return;
    }
    const bonus = 25;
    setUser((prev) => ({
      ...prev,
      points: prev.points + bonus,
      hasClaimedDailyToday: true,
      streakDays: prev.streakDays + 1,
    }));
    showToast(
      lang === 'RO'
        ? `Felicitări! +${bonus} puncte pentru logare zilnică! Serie: ${user.streakDays + 1} zile active 🔥`
        : `Congratulations! +${bonus} points collected for daily login! Streak: ${user.streakDays + 1} days active 🔥`
    );
  };

  // Deposit confirmed from camera scanner
  const handleConfirmDeposit = (item: RecognizedItem) => {
    setUser((prev) => ({
      ...prev,
      points: prev.points + item.points,
      totalItemsRecycled: prev.totalItemsRecycled + 1,
      totalWeightKg: +(prev.totalWeightKg + item.weightG / 1000).toFixed(2),
      co2SavedKg: +(prev.co2SavedKg + 0.12).toFixed(2),
    }));

    const newDep: DepositHistoryItem = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: lang === 'RO' ? 'Chiar acum' : 'Just now',
      itemName: item.name,
      category: item.category,
      binName: bins[0].name,
      pointsEarned: item.points,
      weightG: item.weightG,
      co2SavedKg: 0.12,
      userCodeUsed: user.userCode,
    };

    setDeposits((prev) => [newDep, ...prev]);

    showToast(
      lang === 'RO'
        ? `+${item.points} puncte adăugate în contul ${user.userCode}!`
        : `+${item.points} points synced to ${user.userCode}!`
    );
  };

  // Simulated Street Smart Bin Code Scan Sync
  const handleSimulateBinSync = () => {
    setUser((prev) => ({
      ...prev,
      points: prev.points + 15,
      totalItemsRecycled: prev.totalItemsRecycled + 1,
      totalWeightKg: +(prev.totalWeightKg + 0.05).toFixed(2),
    }));

    const newDep: DepositHistoryItem = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: lang === 'RO' ? 'Chiar acum' : 'Just now',
      itemName: 'Sincronizare Coș Public (Piața Universității)',
      category: 'plastic',
      binName: 'Piața Universității Station B-01',
      pointsEarned: 15,
      weightG: 50,
      co2SavedKg: 0.09,
      userCodeUsed: user.userCode,
    };

    setDeposits((prev) => [newDep, ...prev]);

    showToast(
      lang === 'RO'
        ? `Coșul stradal a recunoscut codul ${user.userCode}! +15 puncte adăugate.`
        : `Public bin recognized code ${user.userCode}! +15 points synced.`
    );
  };

  // Service / empty bin from collection truck road route
  const handleServiceBin = (binId: string) => {
    setBins((prev) =>
      prev.map((b) => {
        if (b.id === binId) {
          return {
            ...b,
            status: 'available',
            streams: b.streams.map((s) => ({
              ...s,
              fillPercent: 12,
            })),
          };
        }
        return b;
      })
    );

    showToast(
      lang === 'RO'
        ? `Mașina de colectare a golit coșul ${binId}! Status resetat la 12%.`
        : `Collection truck serviced bin ${binId}! Fill level reset to 12%.`
    );
  };

  // Redeem voucher from store
  const handleRedeemReward = (reward: RewardItem) => {
    setUser((prev) => ({
      ...prev,
      points: prev.points - reward.pointsCost,
    }));

    const randomCode = `${reward.partnerName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    const newVoucher: RedeemedVoucher = {
      id: `VOUCH-${Date.now()}`,
      rewardId: reward.id,
      title: reward.title,
      partnerName: reward.partnerName,
      code: randomCode,
      redeemedAt: 'Chiar acum',
      expiresAt: `Expiră în ${reward.expiryDays} zile`,
      isUsed: false,
    };

    setRedeemedVouchers((prev) => [newVoucher, ...prev]);

    showToast(
      lang === 'RO'
        ? `Voucher "${reward.title}" revendicat (-${reward.pointsCost} puncte)!`
        : `Voucher "${reward.title}" claimed (-${reward.pointsCost} pts)!`
    );
  };

  const handleMarkVoucherUsed = (voucherId: string) => {
    setRedeemedVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isUsed: true } : v))
    );
    showToast(lang === 'RO' ? 'Voucher marcat ca folosit.' : 'Voucher marked as redeemed.');
  };

  const handleAwardBonusPoints = (bonus: number, reason: string) => {
    setUser((prev) => ({
      ...prev,
      points: prev.points + bonus,
    }));
    showToast(`+${bonus} puncte pentru ${reason}!`);
  };

  const handleRsvpEvent = (eventId: string) => {
    setUser((prev) => ({
      ...prev,
      points: prev.points + 50,
    }));
    showToast(lang === 'RO' ? 'Înscriere confirmată! +50 puncte bonus de voluntar.' : 'RSVP confirmed! +50 volunteer bonus points.');
  };

  // Handle Safe Donation Success
  const handleDonationSuccess = (receipt: DonationReceipt) => {
    if (receipt.paymentMethod === 'card') {
      setUser((prev) => ({
        ...prev,
        totalDonatedRon: prev.totalDonatedRon + receipt.amountRon,
      }));
    } else if (receipt.paymentMethod === 'points' && receipt.pointsUsed) {
      setUser((prev) => ({
        ...prev,
        points: Math.max(0, prev.points - receipt.pointsUsed!),
        totalDonatedRon: prev.totalDonatedRon + receipt.amountRon,
      }));
    }

    showToast(
      lang === 'RO'
        ? `Donație confirmată! Chitanță: ${receipt.id}`
        : `Donation confirmed! Receipt: ${receipt.id}`
    );
  };

  // Handle User Login
  const handleLogin = (email: string, name: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      name,
      isAuthenticated: true,
    }));
    showToast(lang === 'RO' ? `Conectat ca ${email}` : `Signed in as ${email}`);
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
    showToast(lang === 'RO' ? 'Te-ai deconectat cu succes.' : 'Signed out successfully.');
  };

  // Export User CSV Data
  const handleExportData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Timestamp,Item,Category,Bin,Points,WeightG\n' +
      deposits.map((d) => `${d.id},"${d.timestamp}","${d.itemName}",${d.category},"${d.binName}",${d.pointsEarned},${d.weightG}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartwaste_history_${user.userCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(lang === 'RO' ? 'Jurnalul de reciclare a fost descărcat CSV.' : 'Recycling log downloaded as CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        user={user}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenUserPass={() => setIsUserPassOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Emergency & System Notice Bar */}
      <EmergencyNotificationBar
        alerts={alerts}
        onNavigateToMap={() => setActiveTab('map')}
        onOpenUserPass={() => setIsUserPassOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <HomeFeed
            lang={lang}
            user={user}
            nearestBin={bins[0]}
            recentDeposits={deposits}
            onOpenScanner={() => setIsScannerOpen(true)}
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToRewards={() => setActiveTab('rewards')}
            onAwardBonusPoints={handleAwardBonusPoints}
            onOpenUserPass={() => setIsUserPassOpen(true)}
            onClaimDailyReward={handleClaimDailyReward}
          />
        )}

        {activeTab === 'map' && (
          <NearbyBinsMap
            lang={lang}
            bins={bins}
            onSelectBinToScan={(bin) => {
              setIsScannerOpen(true);
              showToast(
                lang === 'RO'
                  ? `Scanare pregătită pentru ${bin.name}`
                  : `Scanner ready for ${bin.name}`
              );
            }}
            onServiceBin={handleServiceBin}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsStore
            lang={lang}
            user={user}
            redeemedVouchers={redeemedVouchers}
            onRedeemReward={handleRedeemReward}
            onMarkVoucherUsed={handleMarkVoucherUsed}
          />
        )}

        {activeTab === 'community' && (
          <CommunityHub
            lang={lang}
            onRsvpEvent={handleRsvpEvent}
            onOpenDonation={(prog) => setSelectedDonationProgram(prog)}
          />
        )}
      </main>

      {/* Floating AI Sorting Assistant Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-white rounded-full shadow-2xl transition-transform hover:scale-105"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            AI
          </div>
          <span className="text-xs font-semibold">
            {lang === 'RO' ? 'Unde arunc asta?' : 'Where does this go?'}
          </span>
        </button>
      )}

      {/* Camera Scanner Modal (with public user code sync) */}
      <ScannerModal
        lang={lang}
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        userCode={user.userCode}
        onConfirmDeposit={handleConfirmDeposit}
      />

      {/* User Digital Pass & Street Bin Code Modal */}
      <UserPassModal
        lang={lang}
        isOpen={isUserPassOpen}
        onClose={() => setIsUserPassOpen(false)}
        user={user}
        onSimulateBinSync={handleSimulateBinSync}
      />

      {/* Safe Card Payment & Community Donation Modal */}
      {selectedDonationProgram && (
        <DonationCardModal
          lang={lang}
          isOpen={!!selectedDonationProgram}
          onClose={() => setSelectedDonationProgram(null)}
          program={selectedDonationProgram}
          user={user}
          onDonationSuccess={handleDonationSuccess}
        />
      )}

      {/* User Email Authentication Modal */}
      <AuthModal
        lang={lang}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Full-Featured Settings Modal */}
      <SettingsModal
        lang={lang}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        settings={settings}
        onUpdateSettings={(newSt) => {
          setSettings(newSt);
          setLang(newSt.language);
        }}
        onExportData={handleExportData}
        onOpenUserPass={() => {
          setIsSettingsOpen(false);
          setIsUserPassOpen(true);
        }}
      />

      {/* AI Chatbot Drawer */}
      <AIChatDrawer
        lang={lang}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-fadeIn font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Consumer Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SmartWaste AI</span>
            <span>·</span>
            <span>{lang === 'RO' ? 'Cod Utilizator Activ: ' : 'Active User Pass: '}</span>
            <span className="font-mono text-emerald-400 font-bold">{user.userCode}</span>
            <span>·</span>
            <span>România (București & Cluj-Napoca)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Setări Aplicație
            </button>
            <span>·</span>
            <span>Plăți Securizate Card PSD2 / 256-bit SSL</span>
            <span>·</span>
            <span>GDPR Privacy by Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
