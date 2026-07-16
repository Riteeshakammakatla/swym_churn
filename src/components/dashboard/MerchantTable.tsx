import React, { useState, useMemo } from 'react';
import { useMerchants } from '../../context/MerchantContext';
import { formatCurrency, formatPercent, formatDaysSince } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { ArrowUpDown, ChevronRight, AlertCircle } from 'lucide-react';

type SortField = 'name' | 'risk' | 'mrr' | 'login' | 'tickets' | 'touchpoint';
type SortOrder = 'asc' | 'desc';

export const MerchantTable: React.FC = () => {
  const { filteredMerchants, selectedMerchantId, setSelectedMerchantId } = useMerchants();
  const [sortField, setSortField] = useState<SortField>('risk');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedMerchants = useMemo(() => {
    const list = [...filteredMerchants];
    return list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.merchant.name.localeCompare(b.merchant.name);
      } else if (sortField === 'risk') {
        comparison = a.risk.overallScore - b.risk.overallScore;
      } else if (sortField === 'mrr') {
        comparison = a.merchant.mrr - b.merchant.mrr;
      } else if (sortField === 'login') {
        comparison = a.merchant.daysSinceLastLogin - b.merchant.daysSinceLastLogin;
      } else if (sortField === 'tickets') {
        const scoreA = a.merchant.openSupportTickets + (a.merchant.criticalSupportTickets * 2);
        const scoreB = b.merchant.openSupportTickets + (b.merchant.criticalSupportTickets * 2);
        comparison = scoreA - scoreB;
      } else if (sortField === 'touchpoint') {
        comparison = a.merchant.daysSinceLastCsmTouchpoint - b.merchant.daysSinceLastCsmTouchpoint;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredMerchants, sortField, sortOrder]);

  const SortHeader: React.FC<{ field: SortField; label: string; align?: string }> = ({ field, label, align = 'text-left' }) => {
    const isActive = sortField === field;
    return (
      <th 
        onClick={() => handleSort(field)}
        className={`px-4 py-3 cursor-pointer select-none text-slate-400 hover:text-slate-200 transition-colors text-xs font-semibold uppercase tracking-wider ${align}`}
      >
        <div className={`flex items-center gap-1.5 ${align === 'text-right' ? 'justify-end' : ''}`}>
          {label}
          <ArrowUpDown className={`w-3 h-3 ${isActive ? 'text-brand-400' : 'text-slate-650 opacity-40'}`} />
        </div>
      </th>
    );
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/30">
              <SortHeader field="name" label="Merchant" />
              <SortHeader field="risk" label="Risk Score" align="text-center" />
              <SortHeader field="mrr" label="MRR" align="text-right" />
              <SortHeader field="login" label="Activity" />
              <SortHeader field="tickets" label="Support Load" />
              <SortHeader field="touchpoint" label="CSM Touchpoint" />
              <th className="px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Manager</th>
              <th className="px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60">
            {sortedMerchants.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-500 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-slate-600" />
                    No merchants match the selected filters.
                  </div>
                </td>
              </tr>
            ) : (
              sortedMerchants.map(am => {
                const m = am.merchant;
                const r = am.risk;
                const isSelected = selectedMerchantId === m.id;

                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMerchantId(isSelected ? null : m.id)}
                    className={`cursor-pointer hover:bg-slate-900/40 transition-colors ${
                      isSelected ? 'bg-slate-900/60 border-l-2 border-brand-500' : ''
                    }`}
                  >
                    {/* Merchant Info */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200 text-sm">{m.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.25 rounded font-medium">
                            {m.industry}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {m.subscriptionPlan} • {m.accountAgeMonths}m
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Risk Badge / Score + Dominant Factor hint */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge level={r.level} />
                        <span className="text-xs font-bold text-slate-300">
                          {r.overallScore} <span className="text-slate-600 font-normal">/100</span>
                        </span>
                        {r.dominantFactor !== 'None' && r.overallScore >= 30 && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                            r.dominantFactor === 'technical' ? 'bg-red-500/10 text-red-400' :
                            r.dominantFactor === 'financial' ? 'bg-orange-500/10 text-orange-400' :
                            r.dominantFactor === 'activity'  ? 'bg-amber-500/10 text-amber-400' :
                            'bg-purple-500/10 text-purple-400'
                          }`}>
                            ↑ {r.dominantFactor}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* MRR & Trend */}
                    <td className="px-4 py-3.5 text-right font-medium">
                      <div className="flex flex-col items-end">
                        <span className="text-slate-200 text-sm">{formatCurrency(m.mrr)}</span>
                        <span className={`text-[10px] font-semibold mt-0.5 ${
                          m.mrrTrendMoM > 0 
                            ? 'text-emerald-500' 
                            : m.mrrTrendMoM < 0 
                              ? 'text-red-500' 
                              : 'text-slate-500'
                        }`}>
                          {formatPercent(m.mrrTrendMoM)}
                        </span>
                      </div>
                    </td>

                    {/* Activity (Login + Volume Trend) */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-slate-200 text-sm">
                          {formatDaysSince(m.daysSinceLastLogin)}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          {m.transactionVolume.toLocaleString()} txs MoM
                        </span>
                      </div>
                    </td>

                    {/* Support Load */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-slate-200 text-sm">
                          {m.openSupportTickets} open tickets
                        </span>
                        {m.criticalSupportTickets > 0 && (
                          <span className="text-[10px] text-red-400 font-semibold mt-0.5">
                            {m.criticalSupportTickets} critical
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Touchpoint Latency */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-slate-200 text-sm">
                          {formatDaysSince(m.daysSinceLastCsmTouchpoint)}
                        </span>
                      </div>
                    </td>

                    {/* Assigned CSM */}
                    <td className="px-4 py-3.5 text-slate-350 text-sm">
                      {m.assignedCsm}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <button className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors inline-flex items-center">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
