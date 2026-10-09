import React, { useState } from 'react';
import {
  QrCode,
  X,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Smartphone,
  ExternalLink,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserEcoProfile } from '../types';

interface UserPassModalProps {
  lang: 'RO' | 'EN';
  isOpen: boolean;
  onClose: () => void;
  user: UserEcoProfile;
  onSimulateBinSync: () => void;
}

export const UserPassModal: React.FC<UserPassModalProps> = ({
  lang,
  isOpen,
  onClose,
  user,
  onSimulateBinSync,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(user.userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      onSimulateBinSync();
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
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

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] mx-auto shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-emerald-400 font-bold text-xl">
              ♻
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mt-3">
            {lang === 'RO' ? 'Codul Tău SmartWaste' : 'Your SmartBin Digital Pass'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {lang === 'RO'
              ? 'Folosește acest cod sau QR la ORICE coș public din oraș pentru a colecta punctele direct în contul tău.'
              : 'Scan at ANY public street bin camera or enter your code on the bin screen to collect points instantly.'}
          </p>
        </div>

        {/* Digital Pass Card */}
        <div className="my-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                {lang === 'RO' ? 'Titular Cont' : 'Account Holder'}
              </span>
              <span className="font-bold text-white">{user.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">
                {lang === 'RO' ? 'Nivel Cetățean' : 'Citizen Tier'}
              </span>
              <span className="font-mono text-emerald-400 font-bold">{user.tier}</span>
            </div>
          </div>

          {/* QR Code Canvas */}
          <div className="w-44 h-44 bg-white p-3 rounded-xl mx-auto my-4 shadow-xl flex flex-col items-center justify-center relative">
            <div className="w-full h-full bg-slate-950 p-2 rounded-lg flex flex-col items-center justify-center">
              <QrCode className="w-28 h-28 text-white" />
              <span className="text-[9px] font-mono text-slate-400 mt-1">SMARTBIN SYNC QR</span>
            </div>
          </div>

          {/* User Code & Pin Display */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {lang === 'RO' ? 'COD UTILIZATOR PUBLIC:' : 'PUBLIC USER CODE:'}
              </span>
              <span className="text-lg font-mono font-bold text-emerald-400 tracking-wider">
                {user.userCode}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copiază codul"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mt-2 text-center text-[11px] text-slate-400 font-mono">
            <span>PIN Tastatură Coș: </span>
            <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded">{user.pinCode}</strong>
          </div>
        </div>

        {/* How it Works steps */}
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              1
            </div>
            <span>
              {lang === 'RO'
                ? 'Mergi la orice coș public SmartWaste AI din parc, facultate sau stradă.'
                : 'Walk up to ANY public SmartWaste bin in the city or campus.'}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              2
            </div>
            <span>
              {lang === 'RO'
                ? 'Arată ecranul cu codul QR la camera coșului sau tastează codul pe ecran.'
                : 'Show this QR code to the bin camera or type your code on the screen.'}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
              3
            </div>
            <span>
              {lang === 'RO'
                ? 'Coșul se deblochează, sortezi deșeul și punctele intră instant în cont!'
                : 'The bin flap unlocks, you deposit waste, and points sync to your app!'}
            </span>
          </div>
        </div>

        {/* Simulation Button */}
        <div className="mt-5 pt-3 border-t border-slate-800">
          <button
            onClick={handleTestSync}
            disabled={isSyncing}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 font-sans"
          >
            {isSyncing ? (
              <span>{lang === 'RO' ? 'Se conectează la coșul public...' : 'Connecting to public bin...'}</span>
            ) : syncSuccess ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{lang === 'RO' ? 'Sincronizat! +15 Puncte Colectate' : 'Connected! +15 Pts Synced'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'RO' ? 'Testează Conectarea la un Coș Stradal' : 'Simulate Public Bin Scan'}</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
