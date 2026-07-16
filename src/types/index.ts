export interface ActivityEvent {
  id: string;
  date: string;
  type: 'system' | 'support' | 'csm';
  description: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskSubScores {
  activity: number;     // 0 - 100
  financial: number;    // 0 - 100
  technical: number;    // 0 - 100
  support: number;      // 0 - 100
}

export interface RiskAnalysis {
  overallScore: number; // 0 - 100
  level: RiskLevel;
  subScores: RiskSubScores;
  dominantFactor: keyof RiskSubScores | 'None';
  riskDrivers: {
    activity: string;
    financial: string;
    technical: string;
    support: string;
  };
}

export interface RecommendationAction {
  actionType: string;   // Playbook Action Name
  reason: string;       // Dynamic explanation
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  steps: string[];      // Practical execution steps
}

export interface Merchant {
  id: string;
  name: string;
  industry: 'E-commerce' | 'SaaS' | 'Retail' | 'Travel' | 'EdTech' | 'Gaming';
  subscriptionPlan: 'Basic' | 'Growth' | 'Enterprise';
  accountAgeMonths: number;
  assignedCsm: string;
  mrr: number;
  mrrTrendMoM: number;
  transactionVolume: number;
  transactionVolumeTrendMoM: number;
  daysSinceLastLogin: number;
  daysSinceLastCsmTouchpoint: number;
  paymentFailureRate: number;
  openSupportTickets: number;
  criticalSupportTickets: number;
  isSeasonal: boolean;
  csmNotes: string;
  recentActivity: ActivityEvent[];
  actionLogged?: {
    actionType: string;
    loggedAt: string;
    notes: string;
  };
  snoozedUntil?: string; // ISO date string — suppress from Urgent Action Center until this date
}
