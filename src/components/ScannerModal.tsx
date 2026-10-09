import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { SAMPLE_SCAN_ITEMS } from '../data/mockData';
import { RecognizedItem } from '../types';

interface ScannerModalProps {
  lang: 'RO' | 'EN';
  isOpen: boolean;
  onClose: () => void;
  userCode: string;
  onConfirmDeposit: (item: RecognizedItem) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  lang,
  isOpen,
  onClose,
  userCode,
  onConfirmDeposit,
}) => {
  const [selectedItem, setSelectedItem] = useState<RecognizedItem>(SAMPLE_SCAN_ITEMS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Clean up camera stream if open
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    setIsScanning(true);
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 1400);

    // Attempt to access user camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setHasCameraPermission(true);
        })
        .catch(() => {
          setHasCameraPermission(false);
          setCameraError('Camera access not granted or not available. Using intelligent optical simulation.');
        });
    }

    return () => {
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectItem = (item: RecognizedItem) => {
    setSelectedItem(item);
    setUploadedPreview(null);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 900);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPreview(url);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        // match random item or keep plastic
        setSelectedItem(SAMPLE_SCAN_ITEMS[0]);
      }, 1000);
    }
  };

  const handleConfirm = () => {
    setIsDepositing(true);
    setTimeout(() => {
      setIsDepositing(false);
      onConfirmDeposit(selectedItem);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative my-6 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Connected User Pass */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === 'RO' ? 'SCANARE INTELIGENTĂ DEȘEURI' : 'AI OPTICAL WASTE SCANNER'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-md border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'RO' ? 'Cont Conectat: ' : 'Syncing to: '}</span>
              <strong className="text-emerald-400">{userCode}</strong>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mt-0.5">
            {lang === 'RO' ? 'Îndreaptă camera spre ambalaj' : 'Point Camera at Packaging'}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'RO'
              ? 'Inteligența artificială analizează forma și materialul. Punctele intră direct în contul tău.'
              : 'Our vision model identifies packaging and sends earned points straight to your account.'}
          </p>
        </div>

        {/* Viewfinder Window */}
        <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Live Video element if camera permission granted */}
          {hasCameraPermission ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : uploadedPreview ? (
            <img
              src={uploadedPreview}
              alt="Uploaded waste preview"
              className="w-full h-full object-cover"
            />
          ) : (
            /* Photorealistic fallback visual */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
              <img
                src="/src/assets/images/smartwaste_materials_grid_1791504896931.jpg"
                alt="Recyclable item sample"
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px]"
              />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="text-sm font-semibold text-white block">
                  {selectedItem.name}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {lang === 'RO' ? 'Simulare optică activă sau alege un ambalaj mai jos' : 'Optical detection active · or select sample below'}
                </span>
              </div>
            </div>
          )}

          {/* Viewfinder Reticle & HUD Overlay */}
          <div className="absolute inset-4 pointer-events-none border border-emerald-500/30 rounded-lg">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br" />

            {/* Scanning Laser Beam */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse transition-all duration-700" />
            )}
          </div>

          {/* Status Badge in Viewfinder */}
          <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-700/60 rounded-md px-2.5 py-1 text-[11px] font-mono flex items-center gap-1.5 text-white backdrop-blur">
            {isScanning ? (
              <>
                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                <span>{lang === 'RO' ? 'Analiză spectru optic...' : 'Scanning pixels...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{selectedItem.category.toUpperCase()} · {(selectedItem.confidence * 100).toFixed(0)}% Match</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Sample Item Chips (for testing anytime) */}
        <div className="mt-3">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang === 'RO' ? 'Sau alege un ambalaj de test:' : 'Or tap a test item to inspect:'}</span>
            <label className="cursor-pointer text-emerald-400 hover:underline flex items-center gap-1 text-[11px]">
              <Upload className="w-3 h-3" />
              <span>{lang === 'RO' ? 'Încarcă poză' : 'Upload photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            {SAMPLE_SCAN_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all font-medium ${
                  selectedItem.id === item.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

        {/* Classification Result Card */}
        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">
                {lang === 'RO' ? 'Rezultat Clasificare AI:' : 'AI Classification Result:'}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {selectedItem.name}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="px-3 py-1 rounded-md text-xs font-bold text-white font-mono uppercase shadow-sm"
                style={{ backgroundColor: selectedItem.binColor }}
              >
                {selectedItem.streamName}
              </div>
              <div className="text-right">
                <span className="text-base font-mono font-bold text-emerald-400 tabular-nums">
                  +{selectedItem.points}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">pts</span>
              </div>
            </div>
          </div>

          {/* Warning or Preparation Rule */}
          <div className="mt-3 text-xs leading-relaxed">
            {selectedItem.specialWarning ? (
              <div className="bg-rose-950/60 border border-rose-500/60 p-3 rounded-lg text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{selectedItem.specialWarning}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">{lang === 'RO' ? 'Ghid pregătire: ' : 'Preparation: '}</strong>
                  {selectedItem.preparationTip}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CTA: Confirm Deposit */}
        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            {lang === 'RO' ? 'Anulează' : 'Cancel'}
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selectedItem.canRecycle || isDepositing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all font-sans"
          >
            {isDepositing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{lang === 'RO' ? 'Se confirmă depunerea...' : 'Verifying deposit...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {lang === 'RO'
                    ? `Confirmă Depunerea (+${selectedItem.points} Puncte)`
                    : `Confirm Deposit (+${selectedItem.points} Points)`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
