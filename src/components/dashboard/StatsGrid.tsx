import React from 'react';
import { useMerchants } from '../../context/MerchantContext';
import { formatCurrency } from '../../utils/formatters';
import { Users, ShieldAlert, DollarSign, Heart } from 'lucide-react';

export const StatsGrid: React.FC = () => {
  const { stats, analyzedMerchants } = useMerchants();

  // Compute actual total ARR from live data instead of a hardcoded magic number
  const totalMonthlyRevenue = React.useMemo(
    () => analyzedMerchants.reduce((sum, am) => sum + am.merchant.mrr, 0),
    [analyzedMerchants]
  );
  const totalARR = totalMonthlyRevenue * 12;

  const healthLabel =
    stats.averageHealth >= 70 ? 'Healthy Portfolio Range' :
    stats.averageHealth >= 50 ? 'Moderate Risk — Action Recommended' :
    'Portfolio Under Stress — Urgent Review';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Merchants */}
      <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-all hover:-translate-y-1">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Portfolio</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-100">{stats.totalCount}</h3>
          <span className="text-emerald-500 text-xs font-medium mt-1 inline-block">Active Merchants</span>
        </div>
        <div className="p-3 bg-brand-500/10 text-brand-400 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Revenue at Risk */}
      <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-all hover:-translate-y-1">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Revenue at Risk</p>
          <h3 className="text-3xl font-bold mt-1 text-red-400">{formatCurrency(stats.revenueAtRisk)}</h3>
          <span className="text-slate-400 text-xs font-medium mt-1 inline-block">
            {totalARR > 0
              ? `${((stats.revenueAtRisk / totalMonthlyRevenue) * 100).toFixed(1)}% of total MRR`
              : '0% of total MRR'}
          </span>
        </div>
        <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* Critical Accounts */}
      <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-all hover:-translate-y-1">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Critical Accounts</p>
          <h3 className="text-3xl font-bold mt-1 text-orange-400">{stats.criticalCount}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-2 inline-block ${
            stats.criticalCount > 0 
              ? 'bg-red-500/20 text-red-300 pulse-critical' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            {stats.criticalCount > 0 ? 'Urgent Action Needed' : 'All Clear'}
          </span>
        </div>
        <div className="p-3 bg-orange-500/10 text-orange-400 rounded-lg">
          <ShieldAlert className="w-6 h-6" />
        </div>
      </div>

      {/* Average Health Score */}
      <div className="glass-card rounded-xl p-5 flex items-center justify-between transition-all hover:-translate-y-1">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Health Score</p>
          <h3 className="text-3xl font-bold mt-1 text-emerald-400">{stats.averageHealth} <span className="text-slate-500 text-lg">/100</span></h3>
          <span className={`text-xs font-medium mt-1 inline-block ${
            stats.averageHealth >= 70 ? 'text-emerald-500' :
            stats.averageHealth >= 50 ? 'text-amber-400' : 'text-red-400'
          }`}>{healthLabel}</span>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <Heart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
