import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AIChatDrawerProps {
  lang: 'RO' | 'EN';
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isWarning?: boolean;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text:
        lang === 'RO'
          ? 'Salut! Sunt asistentul tău de reciclare SmartWaste AI. Scrie orice produs sau ambalaj și îți spun instant unde merge (Plastic, Metal, Hârtie, Biodeșeu sau punct special) și cum trebuie pregătit.'
          : "Hi! I'm your SmartWaste AI sorting assistant. Ask about any item or packaging, and I'll tell you the exact bin opening and how to prep it.",
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const quickPrompts = [
    lang === 'RO' ? 'Unde arunc cutia de pizza?' : 'Where do pizza boxes go?',
    lang === 'RO' ? 'Ce fac cu bateriile uzate?' : 'How to dispose of batteries?',
    lang === 'RO' ? 'Trebuie să spăl borcanele?' : 'Do jars need to be washed?',
    lang === 'RO' ? 'Spray-ul deodorant e reciclabil?' : 'Can deodorant aerosol cans be recycled?',
  ];

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    const lower = textToSend.toLowerCase();

    // Safety interlocks for hazardous materials
    if (
      lower.includes('bater') ||
      lower.includes('battery') ||
      lower.includes('acumulator') ||
      lower.includes('vape') ||
      lower.includes('chimic') ||
      lower.includes('medicam') ||
      lower.includes('sering')
    ) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            isWarning: true,
            text:
              lang === 'RO'
                ? '⚠️ ATENȚIE: Bateriile, acumulatorii și deșeurile periculoase NU se pun niciodată în coșurile obișnuite! Ele provoacă incendii la presare. Predă-le gratuit la cutiile speciale din supermarketuri (Lidl, Mega Image, Kaufland) sau magazine electronice.'
                : '⚠️ SAFETY ALERT: Batteries, vapes, and hazardous chemicals must NEVER be thrown into ordinary bins! Compaction causes fires. Return them to authorized collection drop boxes at supermarkets or electronics retailers.',
          },
        ]);
        setIsLoading(false);
      }, 350);
      return;
    }

    // Try Gemini API if key is present
    try {
      const apiKey =
        typeof process !== 'undefined' && process.env?.GEMINI_API_KEY
          ? process.env.GEMINI_API_KEY
          : (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the friendly, expert SmartWaste AI sorting assistant for Romanian citizens (Bucharest and Cluj-Napoca).
Guidelines:
- Categorize into: Plastic & PET (Blue), Metal & Aluminium (Yellow), Paper & Cardboard (Green), Organic / Compost (Brown), or Residual.
- Greasy pizza boxes do NOT go into clean paper.
- Must be empty and dry.
- Keep the response short, clear, and helpful in ${lang === 'RO' ? 'Romanian' : 'English'}.
Question: ${textToSend}`,
        });

        const reply = res.text || 'Goliți ambalajul și depuneți în trapa corespunzătoare.';
        setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text: reply }]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Graceful deterministic fallback
    }

    setTimeout(() => {
      let reply = '';
      if (lower.includes('pizza') || lower.includes('gras') || lower.includes('ulei')) {
        reply =
          lang === 'RO'
            ? '📦 Cutia de pizza murdară de grăsime NU se pune la Hârtie! Grăsimea distruge reciclarea celulozei. Dacă partea de sus a capacului este curată, rupe-o și pune-o la HÂRTIE; partea de jos murdară merge la REZIDUAL sau BIODEȘEURI.'
            : '📦 Greasy pizza boxes cannot be recycled with clean paper! Tear off the clean top lid for the Paper bin; place the greasy bottom into Residual or Organic.';
      } else if (lower.includes('doz') || lower.includes('can') || lower.includes('metal') || lower.includes('aluminiu')) {
        reply =
          lang === 'RO'
            ? '🥫 Dozele de suc și bere din aluminiu merg în trapa GALBENĂ (Metal). Asigură-te că sunt golite complet de lichid. Aplatizează-le dacă poți.'
            : '🥫 Aluminium cans go in the YELLOW opening (Metal). Ensure they are empty and rinsed.';
      } else if (lower.includes('pahar') || lower.includes('cafea')) {
        reply =
          lang === 'RO'
            ? '☕ Paharele de cafea de unică folosință (to-go) au o peliculă interioară din plastic și NU merg la hârtie! Se aruncă la Deșeuri Reziduale. Capacul din plastic reciclabil merge la Plastic.'
            : '☕ Disposable coffee cups have a polyethylene plastic lining and cannot go with paper! Dispose in Residual. The plastic lid goes to Plastic.';
      } else {
        reply =
          lang === 'RO'
            ? `Pentru "${textToSend}": Asigură-te că recipientul este gol și uscat. Dacă e plastic/PET merge la trapa Albastră (+15 pct); hârtia curată la trapa Verde (+15 pct).`
            : `For "${textToSend}": Empty and rinse. Clean plastic goes to the Blue flap (+15 pts); clean dry cardboard goes to Green (+15 pts).`;
      }

      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text: reply }]);
      setIsLoading(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl max-w-lg w-full h-[520px] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>SmartWaste AI Assistant</span>
                <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'RO' ? 'Ghid inteligent de reciclare' : 'Smart Sorting Guide'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : m.isWarning
                    ? 'bg-rose-950/80 border border-rose-500/60 text-rose-200 rounded-bl-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Bot className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>{lang === 'RO' ? 'Se verifică regulile de sortare...' : 'Checking sorting rules...'}</span>
            </div>
          )}
        </div>

        {/* Quick Chips */}
        <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto text-[11px]">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'RO' ? 'Întreabă despre un ambalaj...' : 'Ask about any packaging...'}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
