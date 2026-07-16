import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Merchant, RiskAnalysis, RecommendationAction, RiskLevel } from '../types';
import { INITIAL_MERCHANTS } from '../data/mockMerchants';
import { calculateMerchantRisk } from '../services/riskEngine';
import { getMerchantRecommendation } from '../services/recommendationEngine';

export interface AnalyzedMerchant {
  merchant: Merchant;
  risk: RiskAnalysis;
  recommendation: RecommendationAction;
}

export interface FilterState {
  industry: string;
  riskLevel: string;
  assignedCsm: string;
  subscriptionPlan: string;
}

interface MerchantContextType {
  merchants: Merchant[];
  analyzedMerchants: AnalyzedMerchant[];
  filteredMerchants: AnalyzedMerchant[];
  selectedMerchant: AnalyzedMerchant | null;
  selectedMerchantId: string | null;
  searchQuery: string;
  filters: FilterState;
  excludeSeasonal: boolean;
  stats: {
    totalCount: number;
    revenueAtRisk: number;
    criticalCount: number;
    highCount: number;
    averageHealth: number;
    riskDistribution: {
      Low: number;
      Medium: number;
      High: number;
      Critical: number;
    };
  };
  setSearchQuery: (query: string) => void;
  setFilter: (key: keyof FilterState, value: string) => void;
  setExcludeSeasonal: (val: boolean) => void;
  setSelectedMerchantId: (id: string | null) => void;
  updateCsmNotes: (id: string, notes: string) => void;
  logCsmAction: (id: string, actionType: string, notes: string) => void;
  dismissCsmAction: (id: string) => void;
  snoozeMerchant: (id: string, days: number) => void;
  resetData: () => void;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [excludeSeasonal, setExcludeSeasonal] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    industry: 'All',
    riskLevel: 'All',
    assignedCsm: 'All',
    subscriptionPlan: 'All'
  });

  // Load from localStorage or seed data on init
  useEffect(() => {
    const saved = localStorage.getItem('swym_merchants');
    if (saved) {
      try {
        setMerchants(JSON.parse(saved));
      } catch (e) {
        setMerchants(INITIAL_MERCHANTS);
      }
    } else {
      setMerchants(INITIAL_MERCHANTS);
    }
  }, []);

  // Sync to localStorage
  const saveMerchants = (updated: Merchant[]) => {
    setMerchants(updated);
    localStorage.setItem('swym_merchants', JSON.stringify(updated));
  };

  // Dynamically analyze all merchants based on raw data and seasonal settings
  const analyzedMerchants = useMemo((): AnalyzedMerchant[] => {
    return merchants.map(m => {
      const risk = calculateMerchantRisk(m, excludeSeasonal);
      
      // Post-calculation CSM Action Mitigation:
      // If a CSM has actively logged an action, reduce overall risk score by 15 points
      // because the account is now actively being remediated.
      if (m.actionLogged) {
        const adjustedScore = Math.max(0, risk.overallScore - 15);
        let adjustedLevel: RiskLevel = 'Low';
        if (adjustedScore >= 75) adjustedLevel = 'Critical';
        else if (adjustedScore >= 55) adjustedLevel = 'High';
        else if (adjustedScore >= 30) adjustedLevel = 'Medium';
        
        risk.overallScore = adjustedScore;
        risk.level = adjustedLevel;
      }
      
      const recommendation = getMerchantRecommendation(m, risk);
      return { merchant: m, risk, recommendation };
    });
  }, [merchants, excludeSeasonal]);

  // Compute selected merchant
  const selectedMerchant = useMemo(() => {
    if (!selectedMerchantId) return null;
    return analyzedMerchants.find(am => am.merchant.id === selectedMerchantId) || null;
  }, [analyzedMerchants, selectedMerchantId]);

  // Apply filters, search and sorting
  const filteredMerchants = useMemo((): AnalyzedMerchant[] => {
    return analyzedMerchants.filter(am => {
      const m = am.merchant;
      const r = am.risk;

      // 1. Search Query filter (matches name, CSM or industry)
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.assignedCsm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.industry.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Industry filter
      if (filters.industry !== 'All' && m.industry !== filters.industry) return false;

      // 3. Risk Level filter
      if (filters.riskLevel !== 'All' && r.level !== filters.riskLevel) return false;

      // 4. CSM filter
      if (filters.assignedCsm !== 'All' && m.assignedCsm !== filters.assignedCsm) return false;

      // 5. Subscription Plan filter
      if (filters.subscriptionPlan !== 'All' && m.subscriptionPlan !== filters.subscriptionPlan) return false;

      return true;
    });
  }, [analyzedMerchants, searchQuery, filters]);

  // Compute stats
  const stats = useMemo(() => {
    const total = analyzedMerchants.length;
    let criticalCount = 0;
    let highCount = 0;
    let revenueAtRisk = 0;
    let totalScoreSum = 0;

    const distribution = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };

    analyzedMerchants.forEach(am => {
      distribution[am.risk.level]++;
      totalScoreSum += am.risk.overallScore;

      if (am.risk.level === 'Critical') {
        criticalCount++;
        revenueAtRisk += am.merchant.mrr;
      } else if (am.risk.level === 'High') {
        highCount++;
        revenueAtRisk += am.merchant.mrr;
      }
    });

    const averageHealth = total > 0 ? parseFloat((100 - (totalScoreSum / total)).toFixed(1)) : 100;

    return {
      totalCount: total,
      revenueAtRisk,
      criticalCount,
      highCount,
      averageHealth,
      riskDistribution: distribution
    };
  }, [analyzedMerchants]);

  // Mutators
  const updateCsmNotes = (id: string, notes: string) => {
    const updated = merchants.map(m => {
      if (m.id === id) {
        return { ...m, csmNotes: notes };
      }
      return m;
    });
    saveMerchants(updated);
  };

  const logCsmAction = (id: string, actionType: string, notes: string) => {
    const updated = merchants.map(m => {
      if (m.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const newEvent = {
          id: `act-${Date.now()}`,
          date: today,
          type: 'csm' as const,
          description: `Playbook Executed: ${actionType}. Note: ${notes}`
        };
        return {
          ...m,
          actionLogged: {
            actionType,
            loggedAt: new Date().toISOString(),
            notes
          },
          recentActivity: [newEvent, ...m.recentActivity]
        };
      }
      return m;
    });
    saveMerchants(updated);
  };

  const dismissCsmAction = (id: string) => {
    const updated = merchants.map(m => {
      if (m.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const newEvent = {
          id: `act-${Date.now()}`,
          date: today,
          type: 'csm' as const,
          description: `Playbook action '${m.actionLogged?.actionType}' dismissed/resolved.`
        };
        // Remove actionLogged key
        const newMerchant = { ...m, recentActivity: [newEvent, ...m.recentActivity] };
        delete newMerchant.actionLogged;
        return newMerchant;
      }
      return m;
    });
    saveMerchants(updated);
  };

  const snoozeMerchant = (id: string, days: number) => {
    const snoozeUntil = new Date();
    snoozeUntil.setDate(snoozeUntil.getDate() + days);
    const updated = merchants.map(m => {
      if (m.id !== id) return m;
      const event = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'csm' as const,
        description: `Account snoozed for ${days} days. Will resurface on ${snoozeUntil.toDateString()}.`
      };
      return { ...m, snoozedUntil: snoozeUntil.toISOString(), recentActivity: [event, ...m.recentActivity] };
    });
    saveMerchants(updated);
  };

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetData = () => {
    localStorage.removeItem('swym_merchants');
    setMerchants(INITIAL_MERCHANTS);
    setFilters({
      industry: 'All',
      riskLevel: 'All',
      assignedCsm: 'All',
      subscriptionPlan: 'All'
    });
    setSearchQuery('');
    setExcludeSeasonal(false);
    setSelectedMerchantId(null);
  };

  return (
    <MerchantContext.Provider
      value={{
        merchants,
        analyzedMerchants,
        filteredMerchants,
        selectedMerchant,
        selectedMerchantId,
        searchQuery,
        filters,
        excludeSeasonal,
        stats,
        setSearchQuery,
        setFilter,
        setExcludeSeasonal,
        setSelectedMerchantId,
        updateCsmNotes,
        logCsmAction,
        dismissCsmAction,
        snoozeMerchant,
        resetData
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchants = () => {
  const context = useContext(MerchantContext);
  if (context === undefined) {
    throw new Error('useMerchants must be used within a MerchantProvider');
  }
  return context;
};
