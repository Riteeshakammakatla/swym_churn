import React, { useState } from 'react';
import { useMerchants } from '../../context/MerchantContext';
import { Search, RotateCcw, HelpCircle, AlertTriangle } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    excludeSeasonal,
    setExcludeSeasonal,
    resetData,
    analyzedMerchants,
    filteredMerchants,
  } = useMerchants();

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Derive CSM list dynamically from actual merchant data
  const csmList = React.useMemo(() => {
    const names = new Set(analyzedMerchants.map(am => am.merchant.assignedCsm));
    return Array.from(names).sort();
  }, [analyzedMerchants]);

  const handleResetConfirmed = () => {
    resetData();
    setShowConfirmReset(false);
  };

  const isFiltered =
    filters.industry !== 'All' ||
    filters.riskLevel !== 'All' ||
    filters.assignedCsm !== 'All' ||
    filters.subscriptionPlan !== 'All' ||
    searchQuery.trim() !== '';

  const clearFilters = () => {
    setFilter('industry', 'All');
    setFilter('riskLevel', 'All');
    setFilter('assignedCsm', 'All');
    setFilter('subscriptionPlan', 'All');
    setSearchQuery('');
  };

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
      {/* Reset Confirmation Dialog */}
      {showConfirmReset && (
        <div className="bg-red-950/30 border border-red-900/60 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-300">Reset all data?</p>
            <p className="text-xs text-slate-400 mt-0.5">
              This will permanently delete all logged CSM notes, playbook actions, and activity history. This cannot be undone.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleResetConfirmed}
                className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Yes, reset everything
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Search & Reset Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchant name, industry, or CSM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
          />
        </div>

        {/* Seasonal Adjustment & Reset Controls */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-5">
          {/* Seasonal Toggle */}
          <div className="flex items-center gap-3">
            <span className="relative group flex items-center gap-1.5 cursor-pointer">
              <span className="text-sm font-medium text-slate-300">Seasonal Adjustments</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-400" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-normal shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Reduces Financial Risk score by 60% for seasonal merchants experiencing standard cyclical dips.
              </span>
            </span>
            <button
              onClick={() => setExcludeSeasonal(!excludeSeasonal)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                excludeSeasonal ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  excludeSeasonal ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Reset Button — now shows confirm dialog */}
          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-red-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-red-900/60 transition-all focus:outline-none"
            title="Reset to default mock data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-800/80 w-full" />

      {/* Filters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Industry Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Industry</label>
          <select
            value={filters.industry}
            onChange={(e) => setFilter('industry', e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-brand-500 transition-colors"
          >
            <option value="All">All Industries</option>
            <option value="E-commerce">E-commerce</option>
            <option value="SaaS">SaaS</option>
            <option value="Retail">Retail</option>
            <option value="Travel">Travel</option>
            <option value="EdTech">EdTech</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Risk Severity</label>
          <select
            value={filters.riskLevel}
            onChange={(e) => setFilter('riskLevel', e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-brand-500 transition-colors"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Risk</option>
          </select>
        </div>

        {/* Assigned CSM Filter — dynamically derived */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Success Manager</label>
          <select
            value={filters.assignedCsm}
            onChange={(e) => setFilter('assignedCsm', e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-brand-500 transition-colors"
          >
            <option value="All">All Managers</option>
            {csmList.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Subscription Plan Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Subscription Tier</label>
          <select
            value={filters.subscriptionPlan}
            onChange={(e) => setFilter('subscriptionPlan', e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 outline-none focus:border-brand-500 transition-colors"
          >
            <option value="All">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Growth">Growth</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Empty-state recovery: show clear filters CTA when filters are active but no results */}
      {isFiltered && filteredMerchants.length === 0 && (
        <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/60 rounded-lg px-4 py-3 animate-fade-in">
          <span className="text-xs text-slate-400">No merchants match your current filters.</span>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors ml-auto"
          >
            Clear all filters →
          </button>
        </div>
      )}
    </div>
  );
};
