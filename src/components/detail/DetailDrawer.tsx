import React, { useState, useEffect } from 'react';
import { useMerchants } from '../../context/MerchantContext';
import type { AnalyzedMerchant } from '../../context/MerchantContext';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { X, User, CheckCircle2, AlertTriangle, ShieldCheck, Clock, MessageSquarePlus } from 'lucide-react';

// ─── Inner panel (rendered only when a merchant IS selected) ─────────────────
const DrawerPanel: React.FC<{
  analyzedMerchant: AnalyzedMerchant;
  onClose: () => void;
  updateCsmNotes: (id: string, notes: string) => void;
  logCsmAction: (id: string, actionType: string, notes: string) => void;
  dismissCsmAction: (id: string) => void;
}> = ({ analyzedMerchant, onClose, updateCsmNotes, logCsmAction, dismissCsmAction }) => {
  const { merchant, risk, recommendation } = analyzedMerchant;

  const [activeTab, setActiveTab] = useState<'risk' | 'history'>('risk');
  const [csmInputNotes, setCsmInputNotes] = useState(merchant.csmNotes || '');
  const [actionNotes, setActionNotes] = useState('');

  // Sync local state when the selected merchant changes
  useEffect(() => {
    setCsmInputNotes(merchant.csmNotes || '');
    setActionNotes('');
    setActiveTab('risk');
  }, [merchant.id]);

  // Escape key closes the drawer — standard overlay UX convention
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const healthScore = 100 - risk.overallScore;

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    updateCsmNotes(merchant.id, csmInputNotes);
  };

  const handleLogAction = (e: React.FormEvent) => {
    e.preventDefault();
    logCsmAction(merchant.id, recommendation.actionType, actionNotes);
    setActionNotes('');
  };

  const getDimensionColor = (score: number) => {
    if (score >= 75) return 'bg-red-500';
    if (score >= 55) return 'bg-orange-500';
    if (score >= 30) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-100">{merchant.name}</h2>
              <span className="text-[11px] font-semibold bg-blue-900/40 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded">
                {merchant.subscriptionPlan} Tier
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span>{merchant.industry}</span>
              <span>•</span>
              <span>Account Age: {merchant.accountAgeMonths} months</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {merchant.assignedCsm}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Health Score</span>
                <span className={`text-base font-bold ${
                  healthScore >= 70 ? 'text-emerald-400' : healthScore >= 45 ? 'text-amber-400' : 'text-red-400'
                }`}>{healthScore} / 100</span>
              </div>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                healthScore >= 70 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                healthScore >= 45 ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                'border-red-500/30 bg-red-500/10 text-red-400'
              }`}>
                {healthScore}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('risk')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all ${
              activeTab === 'risk'
                ? 'border-brand-500 text-brand-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Risk Analysis &amp; Playbooks
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-brand-500 text-brand-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline &amp; Customer Notes
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'risk' ? (
            <>
              {/* Risk Explainability */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Risk Factor Explainability</h3>
                  <Badge level={risk.level} />
                </div>
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-5 space-y-4">
                  {([  
                    { label: 'Activity & Portal Engagement', key: 'activity' },
                    { label: 'Financial Growth & Contraction', key: 'financial' },
                    { label: 'Technical Integration Health', key: 'technical' },
                    { label: 'Support Load & Relationship Latency', key: 'support' },
                  ] as const).map(({ label, key }) => {
                    const score = risk.subScores[key];
                    const isHealthy = score === 0;
                    return (
                      <div key={key} className={`space-y-1.5 transition-all ${
                        isHealthy ? 'opacity-50' : ''
                      }`}>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${
                            isHealthy ? 'text-slate-500' : 'text-slate-300'
                          }`}>{label}</span>
                          {isHealthy ? (
                            <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                              ✓ Healthy
                            </span>
                          ) : (
                            <span className="font-bold text-slate-400">{score} / 100</span>
                          )}
                        </div>
                        {!isHealthy && (
                          <>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${getDimensionColor(score)}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{risk.riskDrivers[key]}</p>
                          </>
                        )}
                        {isHealthy && (
                          <p className="text-[10px] text-slate-600 leading-relaxed">{risk.riskDrivers[key]}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Playbook Recommendations */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Next Best Action Playbook</h3>

                {merchant.actionLogged ? (
                  <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-emerald-400">Account Under Management</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Playbook active: <strong className="text-slate-200">{merchant.actionLogged.actionType}</strong>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissCsmAction(merchant.id)}
                        className="text-xs px-2.5 py-1 font-semibold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Resolve Action
                      </button>
                    </div>
                    <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">CSM Outreach Note</span>
                      <p className="text-xs text-slate-300 mt-1 italic">"{merchant.actionLogged.notes}"</p>
                      <span className="text-[9px] text-slate-500 mt-2 block">Logged on {formatDate(merchant.actionLogged.loggedAt)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-bold text-slate-200">{recommendation.actionType}</h4>
                        <Badge level={`${recommendation.priority}Priority` as any} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{recommendation.reason}</p>
                    </div>

                    <div className="h-px bg-slate-800" />

                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Playbook Checklist</span>
                      {recommendation.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-slate-800" />

                    <form onSubmit={handleLogAction} className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Log Execution Notes</label>
                      <textarea
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        placeholder="Detail the outreach outcome or scheduling notes..."
                        required
                        rows={3}
                        className="w-full p-3 glass-input text-xs"
                      />
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-slate-100 rounded-lg shadow-lg transition-colors"
                      >
                        <MessageSquarePlus className="w-4 h-4" />
                        Log Playbook Execution
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* CSM Notes */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Account Narrative Notes</h3>
                <form onSubmit={handleSaveNotes} className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-5 space-y-3">
                  <textarea
                    value={csmInputNotes}
                    onChange={(e) => setCsmInputNotes(e.target.value)}
                    placeholder="Document general updates, context, or notes for this account..."
                    rows={4}
                    className="w-full p-3 glass-input text-xs"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                    >
                      Save Narrative Notes
                    </button>
                  </div>
                </form>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Detailed Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Monthly Recurring Revenue', value: `${formatCurrency(merchant.mrr)} (${formatPercent(merchant.mrrTrendMoM)} MoM)` },
                    { label: 'Payment Failure Rate', value: `${merchant.paymentFailureRate}%`, danger: merchant.paymentFailureRate > 5 },
                    { label: '30D Transaction Volume', value: `${merchant.transactionVolume.toLocaleString()} (${formatPercent(merchant.transactionVolumeTrendMoM)} MoM)` },
                    { label: 'Days Since Login / Touchpoint', value: `${merchant.daysSinceLastLogin}d / ${merchant.daysSinceLastCsmTouchpoint}d` },
                  ].map(({ label, value, danger }) => (
                    <div key={label} className="bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                      <span className="text-[10px] text-slate-500 font-medium uppercase">{label}</span>
                      <span className={`text-sm font-bold block mt-1 ${danger ? 'text-red-400' : 'text-slate-200'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Activity Timeline</h3>
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-5">
                  {merchant.recentActivity.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2 text-center">No recent logged activity events.</p>
                  ) : (
                    <div className="relative border-l border-slate-800 pl-4 ml-2 space-y-6">
                      {merchant.recentActivity.map((act) => (
                        <div key={act.id} className="relative">
                          <div className={`absolute -left-[24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-slate-900 flex items-center justify-center ${
                            act.type === 'system' ? 'border-red-500' :
                            act.type === 'support' ? 'border-amber-500' : 'border-brand-500'
                          }`}>
                            {act.type === 'system' ? <AlertTriangle className="w-1.5 h-1.5 text-red-400" /> : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {act.type === 'csm' ? 'CSM OUTREACH' : act.type}
                            </span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 ml-auto">
                              <Clock className="w-3 h-3" />
                              {formatDate(act.date)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{act.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Shell (always rendered, conditionally shows panel) ────────────────────────
export const DetailDrawer: React.FC = () => {
  const { selectedMerchant, setSelectedMerchantId, updateCsmNotes, logCsmAction, dismissCsmAction } = useMerchants();

  if (!selectedMerchant) return null;

  return (
    <DrawerPanel
      analyzedMerchant={selectedMerchant}
      onClose={() => setSelectedMerchantId(null)}
      updateCsmNotes={updateCsmNotes}
      logCsmAction={logCsmAction}
      dismissCsmAction={dismissCsmAction}
    />
  );
};
