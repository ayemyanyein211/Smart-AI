import React, { useState } from 'react';
import {
  X,
  Settings,
  User,
  CreditCard,
  Bell,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  Globe,
  Sparkles,
  Smartphone,
  QrCode,
  FileText
} from 'lucide-react';
import { UserEcoProfile, UserAppSettings } from '../types';

interface SettingsModalProps {
  lang: 'RO' | 'EN';
  isOpen: boolean;
  onClose: () => void;
  user: UserEcoProfile;
  settings: UserAppSettings;
  onUpdateSettings: (newSettings: UserAppSettings) => void;
  onExportData: () => void;
  onOpenUserPass: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  lang,
  isOpen,
  onClose,
  user,
  settings,
  onUpdateSettings,
  onExportData,
  onOpenUserPass,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'payment' | 'privacy'>('account');
  const [localSettings, setLocalSettings] = useState<UserAppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggle = (category: 'notifications' | 'privacy' | 'accessibility', key: string) => {
    setLocalSettings((prev) => {
      // @ts-expect-error dynamic key access
      const updatedCat = { ...prev[category], [key]: !prev[category][key] };
      const updated = { ...prev, [category]: updatedCat };
      onUpdateSettings(updated);
      return updated;
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-6 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'RO' ? 'Setări & Preferințe Cont' : 'Settings & Preferences'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'RO' ? 'Gestionează codul tău public, plățile cu cardul și confidențialitatea.' : 'Manage your bin pass, card payments, alerts, and GDPR privacy.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 border-b border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'account' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'RO' ? 'Cont & Cod Pass' : 'Account & Pass'}</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notifications' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{lang === 'RO' ? 'Alerte & Mașină' : 'Alerts & Fleet'}</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'payment' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{lang === 'RO' ? 'Plăți & Carduri' : 'Cards & Billing'}</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'privacy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{lang === 'RO' ? 'Confidențialitate' : 'Privacy & GDPR'}</span>
          </button>
        </div>

        {/* Tab 1: Account & Pass */}
        {activeTab === 'account' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nume Utilizator:</span>
                <span className="font-bold text-white text-sm">{user.name}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Email Autentificare:</span>
                <span className="font-mono text-slate-300">{user.email}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Nivel Sustenabilitate:</span>
                <span className="font-mono font-bold text-emerald-400">{user.tier}</span>
              </div>
            </div>

            {/* Public Bin Pass Highlight */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">CODUL TĂU PENTRU COȘURILE DIN ORAȘ:</span>
                <span className="text-base font-bold font-mono text-emerald-400 tracking-wider mt-0.5 block">
                  {user.userCode}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  PIN Tastatură: <strong className="text-white">{user.pinCode}</strong>
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenUserPass();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{lang === 'RO' ? 'Deschide QR Pass' : 'Show Pass'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Notifications & Fleet */}
        {activeTab === 'notifications' && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Alertă Sosire Mașină Colectare</span>
                  <span className="text-[11px] text-slate-400">
                    Primești notificare când mașina de salubrizare este pe strada ta (&lt;500m distanță).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifications', 'truckNearbyAlert')}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    localSettings.notifications.truckNearbyAlert ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                      localSettings.notifications.truckNearbyAlert ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <span className="font-semibold text-white block">Golire Coș Favorit</span>
                  <span className="text-[11px] text-slate-400">
                    Află când coșul din proximitatea ta a fost igienizat și are 100% spațiu liber.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifications', 'binServicedAlert')}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    localSettings.notifications.binServicedAlert ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                      localSettings.notifications.binServicedAlert ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <span className="font-semibold text-white block">Memento Serie Zilnică (Streak)</span>
                  <span className="text-[11px] text-slate-400">
                    Nu pierde seria de 14 zile consecutive de sortare corectă.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifications', 'streakReminder')}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    localSettings.notifications.streakReminder ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                      localSettings.notifications.streakReminder ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payment & Saved Cards */}
        {activeTab === 'payment' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-mono font-bold text-xs">
                    VISA
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Card Principal Salvat</span>
                    <span className="text-[11px] text-slate-400 font-mono">•••• •••• •••• 4242 · Exp 12/28</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  ACTIV
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total Donații Comunitare:</span>
                <span className="font-mono font-bold text-emerald-400">{user.totalDonatedRon} RON</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px] flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Standard bancar 256-bit SSL. Datele cardului sunt tokenizate conform normelor europene PSD2.
              </span>
            </div>
          </div>
        )}

        {/* Tab 4: Privacy & GDPR */}
        {activeTab === 'privacy' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Procesare On-Device (Secțiunea 4.2)</span>
                  <span className="text-[11px] text-slate-400">
                    Imaginile camerei sunt analizate doar pe dispozitiv; nu sunt stocate fețe sau imagini brute.
                  </span>
                </div>
                <span className="text-emerald-400 font-bold font-mono">ACTIVAT</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <span className="font-semibold text-white block">Anonimizare în Clasament</span>
                  <span className="text-[11px] text-slate-400">
                    Afișează doar primele inițiale în clasamentul public lunar.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('privacy', 'anonymousLeaderboard')}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    localSettings.privacy.anonymousLeaderboard ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                      localSettings.privacy.anonymousLeaderboard ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Data Export Button */}
            <div className="flex gap-3">
              <button
                onClick={onExportData}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Exportă Datele Mele (CSV)</span>
              </button>
            </div>
          </div>
        )}

        {/* Saved Feedback toast */}
        {savedSuccess && (
          <div className="mt-3 text-center text-xs text-emerald-400 font-semibold animate-fadeIn">
            ✓ Preferințe actualizate automat
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>SmartWaste AI v2.4 · București & Cluj</span>
          <span>Aye Mya Nyein (Business Plan)</span>
        </div>
      </div>
    </div>
  );
};
