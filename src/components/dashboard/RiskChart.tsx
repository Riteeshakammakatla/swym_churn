import React from 'react';
import { useMerchants } from '../../context/MerchantContext';
import { formatCurrency } from '../../utils/formatters';

export const RiskChart: React.FC = () => {
  const { analyzedMerchants, stats } = useMerchants();

  // Calculate MRR totals for each category to show financial weight
  const mrrTotals = React.useMemo(() => {
    const totals = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    analyzedMerchants.forEach(am => {
      totals[am.risk.level] += am.merchant.mrr;
    });
    return totals;
  }, [analyzedMerchants]);

  const totalMerchants = stats.totalCount || 1;
  const dist = stats.riskDistribution;

  const segments = [
    { key: 'Critical', label: 'Critical Risk', count: dist.Critical, color: 'bg-red-500', text: 'text-red-400', mrr: mrrTotals.Critical },
    { key: 'High', label: 'High Risk', count: dist.High, color: 'bg-orange-500', text: 'text-orange-400', mrr: mrrTotals.High },
    { key: 'Medium', label: 'Medium Risk', count: dist.Medium, color: 'bg-amber-500', text: 'text-amber-400', mrr: mrrTotals.Medium },
    { key: 'Low', label: 'Low Risk', count: dist.Low, color: 'bg-emerald-500', text: 'text-emerald-400', mrr: mrrTotals.Low }
  ];

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Risk Profile Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">Commercial distribution by threat level</p>
      </div>

      {/* Stacked Percentage Bar */}
      <div className="my-5">
        <div className="h-4 w-full bg-slate-900 rounded-full flex overflow-hidden border border-slate-800">
          {segments.map(seg => {
            const pct = (seg.count / totalMerchants) * 100;
            if (seg.count === 0) return null;
            return (
              <div
                key={seg.key}
                className={`${seg.color} transition-all duration-500 hover:brightness-110 relative group`}
                style={{ width: `${pct}%` }}
              >
                {/* Micro tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 border border-slate-850 px-2 py-1 rounded text-[10px] text-slate-200 whitespace-nowrap z-10 shadow-lg">
                  {seg.label}: {seg.count} ({pct.toFixed(0)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4 mt-1">
        {segments.map(seg => {
          const pct = Math.round((seg.count / totalMerchants) * 100);
          return (
            <div key={seg.key} className="bg-slate-950/40 border border-slate-900/60 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
                <span className="text-xs font-semibold text-slate-300">{seg.key}</span>
                <span className="text-[10px] text-slate-500 font-medium ml-auto">{pct}%</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-100">{seg.count}</span>
                <span className={`text-xs font-medium ${seg.text}`}>{formatCurrency(seg.mrr)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
