import React, { useState } from 'react';
import { useMerchants } from '../../context/MerchantContext';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { AlertCircle, ChevronRight, Send, Check, BellOff } from 'lucide-react';

// Per-card editing state — fixes the shared noteText bug where typing for one
// merchant would overwrite state when switching to another card.
interface CardState {
  note: string;
  snoozeDays: number;
}

export const UrgentActionCenter: React.FC = () => {
  const { analyzedMerchants, logCsmAction, setSelectedMerchantId, snoozeMerchant } = useMerchants();

  // Each card gets its own isolated state keyed by merchant ID
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [showSnooze, setShowSnooze] = useState<string | null>(null);

  const getCardState = (id: string): CardState =>
    cardStates[id] ?? { note: '', snoozeDays: 7 };

  const updateCardNote = (id: string, note: string) => {
    setCardStates(prev => ({ ...prev, [id]: { ...getCardState(id), note } }));
  };

  const updateSnoozeDays = (id: string, days: number) => {
    setCardStates(prev => ({ ...prev, [id]: { ...getCardState(id), snoozeDays: days } }));
  };

  // Get top 3 High/Critical accounts that have NOT been actioned AND are not snoozed
  const urgentAccounts = React.useMemo(() => {
    const now = Date.now();
    return analyzedMerchants
      .filter(am => {
        if (am.merchant.actionLogged) return false;
        if (am.risk.level !== 'Critical' && am.risk.level !== 'High') return false;
        // Respect snooze: skip if snoozedUntil is in the future
        if (am.merchant.snoozedUntil) {
          const snoozeEnd = new Date(am.merchant.snoozedUntil).getTime();
          if (snoozeEnd > now) return false;
        }
        return true;
      })
      .sort((a, b) => b.risk.overallScore - a.risk.overallScore)
      .slice(0, 3);
  }, [analyzedMerchants]);

  const handleQuickLog = (id: string, actionType: string) => {
    const note = getCardState(id).note;
    if (!note.trim()) return;
    logCsmAction(id, actionType, note);
    setCardStates(prev => { const n = { ...prev }; delete n[id]; return n; });
    setActiveInputId(null);
  };

  const handleSnooze = (id: string) => {
    const days = getCardState(id).snoozeDays;
    snoozeMerchant(id, days);
    setShowSnooze(null);
    setCardStates(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Urgent Action Center</h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">Pending playbooks requiring outreach today</p>
      </div>

      <div className="mt-4 flex-1 space-y-3.5">
        {urgentAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-300">All caught up!</p>
            <p className="text-[10px] text-slate-500 mt-0.5">All high risk accounts have active CSM playbooks or are snoozed.</p>
          </div>
        ) : (
          urgentAccounts.map(am => {
            const m = am.merchant;
            const r = am.risk;
            const rec = am.recommendation;
            const isEditing = activeInputId === m.id;
            const isSnoozePicking = showSnooze === m.id;
            const cardState = getCardState(m.id);

            return (
              <div
                key={m.id}
                className="bg-slate-950/40 border border-slate-900 rounded-lg p-3.5 hover:border-slate-800 transition-all flex flex-col gap-2"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="cursor-pointer" onClick={() => setSelectedMerchantId(m.id)}>
                    <span className="text-xs font-bold text-slate-200 hover:text-brand-400 transition-colors">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {formatCurrency(m.mrr)} MRR • {m.industry}
                    </span>
                  </div>
                  <Badge level={r.level} className="text-[9px] px-1.5 py-0" />
                </div>

                <div className="h-px bg-slate-900/60" />

                {/* Risk Reason */}
                <div>
                  <span className="text-[10px] font-bold text-brand-400 block uppercase">
                    {rec.actionType}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    {r.dominantFactor === 'technical' && `Failure rate is at ${m.paymentFailureRate}%`}
                    {r.dominantFactor === 'activity' && `Inactive for ${m.daysSinceLastLogin} days`}
                    {r.dominantFactor === 'financial' && `Revenue is down ${Math.abs(m.mrrTrendMoM)}% MoM`}
                    {r.dominantFactor === 'support' && m.criticalSupportTickets > 0 && `${m.criticalSupportTickets} critical support tickets open`}
                    {r.dominantFactor === 'support' && m.criticalSupportTickets === 0 && `No touchpoint in ${m.daysSinceLastCsmTouchpoint} days`}
                  </p>
                </div>

                {/* Snooze Picker */}
                {isSnoozePicking && (
                  <div className="flex items-center gap-2 animate-fade-in bg-slate-900/60 rounded-md p-2">
                    <span className="text-[10px] text-slate-400 font-medium">Snooze for:</span>
                    {[3, 7, 14, 30].map(d => (
                      <button
                        key={d}
                        onClick={() => updateSnoozeDays(m.id, d)}
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                          cardState.snoozeDays === d
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                    <button
                      onClick={() => handleSnooze(m.id)}
                      className="ml-auto text-[10px] px-2 py-0.5 rounded font-bold bg-amber-600/80 hover:bg-amber-500 text-white transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowSnooze(null)}
                      className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Action Area */}
                {isEditing ? (
                  <div className="flex items-center gap-1.5 animate-fade-in">
                    <input
                      type="text"
                      placeholder="Log contact notes..."
                      value={cardState.note}
                      onChange={(e) => updateCardNote(m.id, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuickLog(m.id, rec.actionType)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] outline-none text-slate-200 focus:border-brand-500 placeholder-slate-600"
                      autoFocus
                    />
                    <button
                      onClick={() => handleQuickLog(m.id, rec.actionType)}
                      className="p-1.5 bg-brand-600 hover:bg-brand-500 rounded text-slate-100 transition-colors"
                      title="Submit note"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setActiveInputId(null); }}
                      className="text-[10px] font-semibold text-slate-500 hover:text-slate-400 px-1 py-1 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveInputId(m.id)}
                      className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-bold text-slate-300 rounded transition-colors"
                    >
                      Run Playbook
                    </button>
                    <button
                      onClick={() => setShowSnooze(isSnoozePicking ? null : m.id)}
                      className="px-2.5 py-1.5 hover:bg-slate-800 text-slate-500 hover:text-amber-400 text-[10px] font-semibold rounded transition-colors inline-flex items-center gap-1"
                      title="Snooze this account"
                    >
                      <BellOff className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setSelectedMerchantId(m.id)}
                      className="px-2.5 py-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-semibold rounded transition-colors inline-flex items-center gap-0.5"
                    >
                      Details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
