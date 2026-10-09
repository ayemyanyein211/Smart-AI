import React, { useState } from 'react';
import {
  CreditCard,
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Building,
  FileText
} from 'lucide-react';
import { CommunityProgramDonation, UserEcoProfile, DonationReceipt } from '../types';

interface DonationCardModalProps {
  lang: 'RO' | 'EN';
  isOpen: boolean;
  onClose: () => void;
  program: CommunityProgramDonation;
  user: UserEcoProfile;
  onDonationSuccess: (receipt: DonationReceipt) => void;
}

export const DonationCardModal: React.FC<DonationCardModalProps> = ({
  lang,
  isOpen,
  onClose,
  program,
  user,
  onDonationSuccess,
}) => {
  const [donationMethod, setDonationMethod] = useState<'card' | 'points'>('card');
  const [amountRon, setAmountRon] = useState<number>(50);
  const [pointsAmount, setPointsAmount] = useState<number>(300);

  // Card form state
  const [cardNumber, setCardNumber] = useState<string>('4242 4242 4242 4242');
  const [cardName, setCardName] = useState<string>(user.name);
  const [expiry, setExpiry] = useState<string>('12/28');
  const [cvc, setCvc] = useState<string>('842');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);

  if (!isOpen) return null;

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newReceipt: DonationReceipt = {
        id: `REC-${Date.now().toString().slice(-6)}`,
        programId: program.id,
        programTitle: program.title,
        donorEmail: user.email,
        amountRon: donationMethod === 'card' ? amountRon : Math.round(pointsAmount / 10),
        pointsUsed: donationMethod === 'points' ? pointsAmount : undefined,
        paymentMethod: donationMethod,
        cardLast4: donationMethod === 'card' ? cardNumber.slice(-4) : undefined,
        timestamp: new Date().toLocaleDateString('ro-RO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        taxDeductibleCode: `RO-GREEN-TX-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setReceipt(newReceipt);
      onDonationSuccess(newReceipt);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {!receipt ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Heart className="w-5 h-5 fill-emerald-500/30" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'RO' ? 'Susține Comunitatea' : 'Support the Community'}
                </h3>
                <p className="text-xs text-slate-400">{program.partner}</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 mb-4 text-xs">
              <span className="font-semibold text-white block mb-0.5">
                {lang === 'RO' ? program.titleRo : program.title}
              </span>
              <p className="text-slate-400 leading-relaxed">{program.summary}</p>
            </div>

            {/* Donation Method Switcher */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDonationMethod('card')}
                className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-2 ${
                  donationMethod === 'card'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{lang === 'RO' ? 'Card Bancar Securizat' : 'Safe Card Payment'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDonationMethod('points')}
                className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-2 ${
                  donationMethod === 'points'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'RO' ? 'Donează Puncte' : 'Donate Points'}</span>
              </button>
            </div>

            {/* Card Payment Form */}
            {donationMethod === 'card' ? (
              <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                {/* Amount presets */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">
                    {lang === 'RO' ? 'Alege suma donației (RON):' : 'Select donation amount (RON):'}
                  </label>
                  <div className="grid grid-cols-4 gap-2 font-mono">
                    {[25, 50, 100, 200].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmountRon(amt)}
                        className={`py-2 rounded-lg border font-bold text-center transition-all ${
                          amountRon === amt
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {amt} RON
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Fields */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Număr Card (Visa / Mastercard / Revolut)
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">
                        Expirare (LL/AA)
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="12/28"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">
                        Cod Securitate CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Nume Posesor Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Nume Prenume"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Plată securizată 256-bit SSL · Conform directivelor bancare PSD2 / 3D Secure
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'RO' ? 'Se procesează plata în siguranță...' : 'Processing secure payment...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {lang === 'RO'
                          ? `Plătește în Siguranță ${amountRon} RON`
                          : `Pay Safely ${amountRon} RON`}
                      </span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Points Donation Form */
              <div className="space-y-4 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Sold Puncte Disponibil:</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {user.points} puncte
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">
                    {lang === 'RO' ? 'Câte puncte dorești să donezi?' : 'How many points to donate?'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 font-mono">
                    {[150, 300, 600].map((pts) => (
                      <button
                        key={pts}
                        type="button"
                        onClick={() => setPointsAmount(pts)}
                        className={`py-2 rounded-lg border font-bold text-center transition-all ${
                          pointsAmount === pts
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {pts} pts
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px] leading-relaxed">
                  {pointsAmount} puncte echivalează cu o contribuție de {Math.round(pointsAmount / 10)} RON spre achiziția de piese și salarii pentru tehnicienii Roma.
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={user.points < pointsAmount || isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>
                    {lang === 'RO'
                      ? `Donează ${pointsAmount} Puncte`
                      : `Donate ${pointsAmount} Points`}
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Official Donation Receipt */
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white">
              {lang === 'RO' ? 'Mulțumim pentru Generozitate!' : 'Thank You for Your Support!'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {lang === 'RO'
                ? 'Donația ta a fost înregistrată cu succes în fondul comunitar.'
                : 'Your donation has been confirmed in the community fund.'}
            </p>

            {/* Receipt Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>Chitanță Fiscală Verde</span>
                <span className="font-mono text-emerald-400 font-bold">{receipt.id}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Program Sprijinit:</span>
                <span className="font-bold text-white">{receipt.programTitle}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Valoare Donată:</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">
                  {receipt.paymentMethod === 'card'
                    ? `${receipt.amountRon} RON`
                    : `${receipt.pointsUsed} Puncte (~${receipt.amountRon} RON)`}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Metodă Plată:</span>
                <span className="text-slate-300 font-mono">
                  {receipt.paymentMethod === 'card'
                    ? `Card bancar •••• ${receipt.cardLast4}`
                    : 'Puncte SmartWaste'}
                </span>
              </div>

              <div className="flex justify-between py-1 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                <span>Cod deductibilitate:</span>
                <span>{receipt.taxDeductibleCode}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
            >
              {lang === 'RO' ? 'Închide Chitanța' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
