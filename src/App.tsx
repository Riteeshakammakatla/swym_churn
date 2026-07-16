import React from 'react';
import { MerchantProvider } from './context/MerchantContext';
import { StatsGrid } from './components/dashboard/StatsGrid';
import { FilterBar } from './components/dashboard/FilterBar';
import { MerchantTable } from './components/dashboard/MerchantTable';
import { RiskChart } from './components/dashboard/RiskChart';
import { UrgentActionCenter } from './components/dashboard/UrgentActionCenter';
import { DetailDrawer } from './components/detail/DetailDrawer';
import logo from './assets/logo.svg';

const DashboardContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* GLOBAL HEADER */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Swym Logo" className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100 leading-none">
                Swym Merchant Health
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
                Customer Success Command Center
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            V1 MVP Operations Active
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8 space-y-6">
        {/* Row 1: KPI Stats Grid */}
        <section>
          <StatsGrid />
        </section>

        {/* Row 2: Two-column grid layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Filters and Merchants Table */}
          <div className="lg:col-span-2 space-y-6">
            <FilterBar />
            <MerchantTable />
          </div>

          {/* Right Column: Risk Analytics & Urgent Actions */}
          <div className="space-y-6 lg:col-sticky lg:top-24">
            <RiskChart />
            <UrgentActionCenter />
          </div>
        </section>
      </main>

      {/* SLIDE-IN DETAIL DRAWER */}
      <DetailDrawer />

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-600 mt-12">
        <div className="max-w-[1600px] mx-auto px-6">
          Swym Merchant Health Center • Version 1.0.0 (MVP) • Powered by Vite & React
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <MerchantProvider>
      <DashboardContent />
    </MerchantProvider>
  );
}

export default App;
