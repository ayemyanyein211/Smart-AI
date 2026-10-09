import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  Navigation,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Accessibility,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Sliders,
  Shield,
  Layers,
  Activity,
  Play,
  Pause
} from 'lucide-react';
import { SmartBinLocation, CollectionTruckInfo } from '../types';
import { COLLECTION_TRUCKS } from '../data/mockData';

interface NearbyBinsMapProps {
  lang: 'RO' | 'EN';
  bins: SmartBinLocation[];
  onSelectBinToScan: (bin: SmartBinLocation) => void;
  onServiceBin?: (binId: string) => void;
}

export const NearbyBinsMap: React.FC<NearbyBinsMapProps> = ({
  lang,
  bins,
  onSelectBinToScan,
  onServiceBin,
}) => {
  const [selectedCity, setSelectedCity] = useState<'Bucharest' | 'Cluj-Napoca'>('Bucharest');
  const [mapMode, setMapMode] = useState<'all' | 'truck_focus' | 'bins_focus'>('all');
  const [selectedBinId, setSelectedBinId] = useState<string>(bins[0].id);
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(true);

  // Active truck state
  const cityTrucks = COLLECTION_TRUCKS.filter((t) => t.city === selectedCity);
  const [activeTruck, setActiveTruck] = useState<CollectionTruckInfo>(cityTrucks[0]);
  const [truckPos, setTruckPos] = useState<{ x: number; y: number }>(cityTrucks[0].currentCoordinates);

  useEffect(() => {
    const truck = cityTrucks[0];
    if (truck) {
      setActiveTruck(truck);
      setTruckPos(truck.currentCoordinates);
    }
  }, [selectedCity]);

  // Live GPS movement simulation along road waypoints
  useEffect(() => {
    if (!isSimulatingGps || !activeTruck) return;

    const interval = setInterval(() => {
      setTruckPos((prev) => {
        const targetStop = activeTruck.stops[activeTruck.targetStopIndex] || activeTruck.stops[0];
        const dx = (targetStop.coordinates.x - prev.x) * 0.08;
        const dy = (targetStop.coordinates.y - prev.y) * 0.08;

        const nextX = Math.min(88, Math.max(14, prev.x + dx + (Math.random() - 0.5) * 0.3));
        const nextY = Math.min(88, Math.max(14, prev.y + dy + (Math.random() - 0.5) * 0.3));

        return { x: nextX, y: nextY };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulatingGps, activeTruck]);

  const cityBins = bins.filter((b) => b.city === selectedCity);

  const filteredBins = cityBins.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStream =
      streamFilter === 'all' || b.streams.some((s) => s.type === streamFilter);
    return matchesSearch && matchesStream;
  });

  const selectedBin = cityBins.find((b) => b.id === selectedBinId) || cityBins[0];

  const handleSimulateNextService = () => {
    if (!activeTruck) return;
    const currentTarget = activeTruck.stops[activeTruck.targetStopIndex];
    if (onServiceBin && currentTarget) {
      onServiceBin(currentTarget.binId);
    }

    // Advance to next stop
    const nextIdx = (activeTruck.targetStopIndex + 1) % activeTruck.stops.length;
    setActiveTruck((prev) => ({
      ...prev,
      targetStopIndex: nextIdx,
      nextStopName: prev.stops[nextIdx].stopName,
      nextStopEtaMin: Math.max(4, prev.stops[nextIdx].estimatedArrivalMin || 6),
      stops: prev.stops.map((s, idx) => (idx === prev.targetStopIndex ? { ...s, isServiced: true } : s)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Map Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
            <Truck className="w-3.5 h-3.5" />
            <span>{lang === 'RO' ? 'HARTĂ RUTIERĂ & TELEMETRIE MAȘINĂ SALUBRIZARE' : 'ROAD MAP & LIVE COLLECTION TRUCK FLEET'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            {lang === 'RO' ? 'Urmărire Live Coșuri Stradale & Mașină Colectare' : 'Live Smart Bins & Municipal Collection Truck Map'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            {lang === 'RO'
              ? 'Secțiunea 16.2 & 16.3 din Business Plan: Hartă rutieră în timp real cu poziția GPS a mașinii de colectare, timpi estimați (ETA) și gradul de umplere al fiecărui coș.'
              : 'Real-time road telematics with collection vehicle GPS coordinates, estimated arrival windows (ETA), and live bin fill percentages.'}
          </p>
        </div>

        {/* City Toggle & GPS Pause */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setSelectedCity('Bucharest')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedCity === 'Bucharest'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              București ({bins.filter((b) => b.city === 'Bucharest').length})
            </button>
            <button
              onClick={() => setSelectedCity('Cluj-Napoca')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedCity === 'Cluj-Napoca'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cluj-Napoca ({bins.filter((b) => b.city === 'Cluj-Napoca').length})
            </button>
          </div>

          <button
            onClick={() => setIsSimulatingGps(!isSimulatingGps)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {isSimulatingGps ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isSimulatingGps ? (lang === 'RO' ? 'Pauză GPS' : 'Pause GPS') : (lang === 'RO' ? 'Reia GPS' : 'Resume GPS')}</span>
          </button>
        </div>
      </div>

      {/* Live Truck Telemetry Alert Banner */}
      {activeTruck && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/50 border border-emerald-500/40 rounded-xl p-4 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {activeTruck.licensePlate}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>ÎN CURS DE COLECTARE</span>
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                  <span>{activeTruck.driverName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-semibold font-mono">
                    Următoarea oprire: {activeTruck.nextStopName} (ETA ~{activeTruck.nextStopEtaMin} min)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-right">
                <span className="text-[10px] text-slate-400 block font-sans">Capacitate Compactare:</span>
                <span className="font-bold text-emerald-400 text-sm">{activeTruck.capacityUsedPercent}%</span>
              </div>

              <button
                onClick={handleSimulateNextService}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs shadow transition-all flex items-center gap-1.5"
                title="Simulează sosirea mașinii și golirea coșului"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'RO' ? 'Simulează Golire Oprire' : 'Simulate Service'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Map with Roadways + Truck & Bins Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Street Vector Map */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {selectedCity === 'Bucharest' ? 'Rețea Rutieră București (Sector 1, 3, 6)' : 'Rețea Rutieră Cluj-Napoca (Centru & Campus)'}
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">
                · {filteredBins.length} coșuri conectate
              </span>
            </div>

            {/* Map Layers Toggles */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md text-[11px] font-medium">
              <button
                onClick={() => setMapMode('all')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  mapMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Complet
              </button>
              <button
                onClick={() => setMapMode('truck_focus')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  mapMode === 'truck_focus' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rută Mașină
              </button>
            </div>
          </div>

          {/* SVG Map Canvas with Roads & Live Coordinates */}
          <div className="relative w-full h-[400px] sm:h-[450px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
            {/* Street Grid pattern */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-800/40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="streetGrid" width="38" height="38" patternUnits="userSpaceOnUse">
                  <path d="M 38 0 L 0 0 0 38" fill="none" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streetGrid)" />

              {/* Realistic Road Networks */}
              {selectedCity === 'Bucharest' ? (
                <>
                  {/* Bulevardul Regina Elisabeta / Splaiul Independenței */}
                  <path d="M 5 50 Q 35 46 55 52 T 95 65" fill="none" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 5 50 Q 35 46 55 52 T 95 65" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Calea Victoriei / Șoseaua Kiseleff */}
                  <path d="M 45 8 L 48 48 L 56 95" fill="none" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 45 8 L 48 48 L 56 95" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Bulevardul Unirii link */}
                  <path d="M 52 50 L 85 45" fill="none" stroke="#334155" strokeWidth="5" strokeLinecap="round" />

                  {/* Street Labels */}
                  <text x="8%" y="46%" fill="#64748b" fontSize="10" fontFamily="monospace">Splaiul Independenței</text>
                  <text x="49%" y="16%" fill="#64748b" fontSize="10" fontFamily="monospace">Șos. Kiseleff</text>
                  <text x="56%" y="56%" fill="#64748b" fontSize="10" fontFamily="monospace">Bld. Regina Elisabeta</text>
                  <text x="60%" y="70%" fill="#64748b" fontSize="10" fontFamily="monospace">Piața Unirii</text>
                </>
              ) : (
                <>
                  {/* Cluj Roads */}
                  <path d="M 10 50 L 90 48" fill="none" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 30 75 L 75 52" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                  <text x="15%" y="46%" fill="#64748b" fontSize="10" fontFamily="monospace">Bld. 21 Decembrie 1989</text>
                  <text x="35%" y="70%" fill="#64748b" fontSize="10" fontFamily="monospace">Str. Mihail Kogălniceanu</text>
                </>
              )}

              {/* Truck Active Road Route Line */}
              {activeTruck && (
                <path
                  d={`M ${activeTruck.stops.map((s) => `${s.coordinates.x}% ${s.coordinates.y}%`).join(' L ')}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  className="opacity-80"
                />
              )}
            </svg>

            {/* User GPS Pin (Current Location) */}
            <div
              style={{ left: '46%', top: '51%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="relative flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-400 border-2 border-white ring-4 ring-sky-400/40 animate-pulse" />
                <span className="bg-slate-950/90 text-sky-300 font-mono text-[9px] px-1.5 py-0.2 rounded border border-sky-500/40 mt-1 whitespace-nowrap shadow">
                  {lang === 'RO' ? 'Locația Ta' : 'You are here'}
                </span>
              </div>
            </div>

            {/* Smart Bins Markers */}
            {filteredBins.map((bin) => {
              const isSelected = selectedBin.id === bin.id;
              const maxFill = Math.max(...bin.streams.map((s) => s.fillPercent));
              let statusBg = '#10b981'; // Green
              if (maxFill > 80) statusBg = '#f59e0b'; // Amber

              return (
                <button
                  key={bin.id}
                  onClick={() => setSelectedBinId(bin.id)}
                  style={{ left: `${bin.coordinates.x}%`, top: `${bin.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-30 cursor-pointer"
                >
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-transform ${
                      isSelected ? 'scale-125 ring-4 ring-white/30' : 'group-hover:scale-110'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                      style={{ backgroundColor: statusBg }}
                    >
                      ♻
                    </div>
                  </div>

                  <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap">
                    {bin.name.split(' ')[0]} ({maxFill}%)
                  </div>
                </button>
              );
            })}

            {/* LIVE MOVING TRUCK ON ROAD */}
            {activeTruck && (
              <div
                style={{ left: `${truckPos.x}%`, top: `${truckPos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-1000 ease-out pointer-events-none"
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-emerald-500/50">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-950/95 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/50 shadow mt-1 whitespace-nowrap">
                    {activeTruck.licensePlate} · ETA {activeTruck.nextStopEtaMin}m
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[11px] text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Liber</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>&gt;80% Plin</span>
              </span>
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <Truck className="w-3 h-3" />
                <span>Mașină în Cursă</span>
              </span>
            </div>
          </div>
        </div>

        {/* Selected Bin / Roadway Stop Details Card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                {selectedBin.id}
              </span>
              <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {selectedBin.distanceMeters}m · {selectedBin.walkingMin} min {lang === 'RO' ? 'mers' : 'walk'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mt-3">
              {selectedBin.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {selectedBin.address}
            </p>

            {/* Truck photo preview */}
            <div className="my-3 rounded-xl overflow-hidden border border-slate-800 h-28 relative">
              <img
                src="/src/assets/images/smartwaste_truck_collection_1791504906647.jpg"
                alt="Electric collection truck"
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                Ruta Activă: Sector 1 &amp; 3
              </div>
            </div>

            {/* Compartment Fill Levels */}
            <div className="mt-3 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {lang === 'RO' ? 'Nivel Umplere Compartimente' : 'Fill Level per Stream'}
              </div>

              {selectedBin.streams.map((stream) => (
                <div key={stream.type} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200 text-[11px]">{stream.label}</span>
                    <span className={`font-mono font-bold text-[11px] ${stream.fillPercent > 80 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {stream.fillPercent}% plin
                    </span>
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

          {/* Action: Open Scanner for this bin */}
          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => onSelectBinToScan(selectedBin)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 font-sans"
            >
              <Navigation className="w-4 h-4" />
              <span>{lang === 'RO' ? 'Scanează & Depune la acest Coș' : 'Scan & Deposit Here'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
