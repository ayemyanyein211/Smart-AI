import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Truck,
  X,
  ChevronRight,
  ChevronLeft,
  Bell
} from 'lucide-react';
import { EmergencyAlert } from '../types';

interface EmergencyNotificationBarProps {
  alerts: EmergencyAlert[];
  onNavigateToMap: () => void;
  onOpenUserPass: () => void;
}

export const EmergencyNotificationBar: React.FC<EmergencyNotificationBarProps> = ({
  alerts,
  onNavigateToMap,
  onOpenUserPass,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed || alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex] || alerts[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % alerts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
  };

  const getAlertIcon = () => {
    switch (currentAlert.type) {
      case 'bin_warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'login_notice':
        return <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'fleet_update':
        return <Truck className="w-4 h-4 text-sky-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  };

  const handleAlertClick = () => {
    if (currentAlert.type === 'bin_warning' || currentAlert.type === 'fleet_update') {
      onNavigateToMap();
    } else if (currentAlert.type === 'login_notice') {
      onOpenUserPass();
    }
  };

  return (
    <aside aria-label="Notificări de sistem" className="bg-slate-900/95 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 shadow-inner relative z-30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Icon, Badge and Message */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {getAlertIcon()}

          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 shrink-0">
            {currentAlert.badge}
          </span>

          <span
            onClick={handleAlertClick}
            className="truncate hover:text-white cursor-pointer font-medium text-slate-200 hover:underline"
            title={currentAlert.message}
          >
            <strong className="text-white mr-1.5">{currentAlert.title}:</strong>
            <span className="text-slate-400">{currentAlert.message}</span>
          </span>
        </div>

        {/* Right: Controls & Dismiss */}
        <div className="flex items-center gap-2 shrink-0 text-slate-400">
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            {currentIndex + 1}/{alerts.length}
          </span>

          <button
            onClick={handlePrev}
            className="p-1 hover:text-white rounded hover:bg-slate-800"
            title="Alerta anterioară"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleNext}
            className="p-1 hover:text-white rounded hover:bg-slate-800"
            title="Următoarea alertă"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:text-white rounded hover:bg-slate-800 ml-1"
            title="Închide bara de alerte"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
