import type { Merchant } from '../types';

export const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 'merch-01',
    name: 'Acme Corp',
    industry: 'E-commerce',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 18,
    assignedCsm: 'Sarah Jenkins',
    mrr: 12000,
    mrrTrendMoM: -18.5,
    transactionVolume: 4500,
    transactionVolumeTrendMoM: -15.2,
    daysSinceLastLogin: 2,
    daysSinceLastCsmTouchpoint: 12,
    paymentFailureRate: 12.4, // Critical technical driver
    openSupportTickets: 4,
    criticalSupportTickets: 2,
    isSeasonal: false,
    csmNotes: 'Acme Corp reported checkout problems early this month. Standard card processing failures have surged.',
    recentActivity: [
      { id: 'act-101', date: '2026-07-14', type: 'system', description: 'Payment failure rate peaked at 12.4%' },
      { id: 'act-102', date: '2026-07-12', type: 'support', description: 'Ticket #4823 opened: "Declining transaction auths at gateway"' },
      { id: 'act-103', date: '2026-07-10', type: 'system', description: 'MoM Transaction volume drop crossed -15%' },
      { id: 'act-104', date: '2026-07-04', type: 'csm', description: 'Sent checklist for API connection check' }
    ]
  },
  {
    id: 'merch-02',
    name: 'Delta Inc',
    industry: 'SaaS',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 24,
    assignedCsm: 'Sarah Jenkins',
    mrr: 8500,
    mrrTrendMoM: 0.0,
    transactionVolume: 3200,
    transactionVolumeTrendMoM: -1.2,
    daysSinceLastLogin: 45, // High Activity risk, stable revenue
    daysSinceLastCsmTouchpoint: 14,
    paymentFailureRate: 1.1,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Transactions are flowing but no dashboard activity has occurred. Main champion might have left.',
    recentActivity: [
      { id: 'act-201', date: '2026-07-10', type: 'system', description: 'Flagged: 30 consecutive days of portal inactivity' },
      { id: 'act-202', date: '2026-07-02', type: 'csm', description: 'Emailed monthly performance summary, no response received' }
    ]
  },
  {
    id: 'merch-03',
    name: 'Beta Retail',
    industry: 'Retail',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 14,
    assignedCsm: 'David Vance',
    mrr: 9200,
    mrrTrendMoM: -28.0, // Critical financial driver
    transactionVolume: 2100,
    transactionVolumeTrendMoM: -32.5,
    daysSinceLastLogin: 4,
    daysSinceLastCsmTouchpoint: 25,
    paymentFailureRate: 2.2,
    openSupportTickets: 1,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Beta Retail is migrating physical store software. They might be shifting some processing volume off-site.',
    recentActivity: [
      { id: 'act-301', date: '2026-07-15', type: 'system', description: 'Weekly revenue alert: -28% contraction detected' },
      { id: 'act-302', date: '2026-07-08', type: 'support', description: 'Ticket #4701 closed: "Incorrect refund billing breakdown"' }
    ]
  },
  {
    id: 'merch-04',
    name: 'Globex Ski Equipment',
    industry: 'Retail',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 36,
    assignedCsm: 'Elena Rostova',
    mrr: 14500,
    mrrTrendMoM: -35.0, // Seasonal drop
    transactionVolume: 7200,
    transactionVolumeTrendMoM: -31.0,
    daysSinceLastLogin: 3,
    daysSinceLastCsmTouchpoint: 8,
    paymentFailureRate: 1.5,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: true, // Seasonal flag
    csmNotes: 'Known winter sports retailer. Summer revenue dip is completely expected.',
    recentActivity: [
      { id: 'act-401', date: '2026-07-12', type: 'system', description: 'MoM Revenue contracted 35%' },
      { id: 'act-402', date: '2026-07-08', type: 'csm', description: 'Phone call log: Client confirmed summer hibernation mode active' }
    ]
  },
  {
    id: 'merch-05',
    name: 'Apex Gaming',
    industry: 'Gaming',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 9,
    assignedCsm: 'David Vance',
    mrr: 22000,
    mrrTrendMoM: 5.4,
    transactionVolume: 54000,
    transactionVolumeTrendMoM: 8.2,
    daysSinceLastLogin: 1,
    daysSinceLastCsmTouchpoint: 20,
    paymentFailureRate: 6.8, // Shifted industry thresholds apply
    openSupportTickets: 4,
    criticalSupportTickets: 1,
    isSeasonal: false,
    csmNotes: 'Fast-growing gaming app. High transaction volumes. Payment failure is slightly elevated but normal for this industry.',
    recentActivity: [
      { id: 'act-501', date: '2026-07-15', type: 'system', description: 'Record transaction day: 2,500 checkouts' },
      { id: 'act-502', date: '2026-07-11', type: 'support', description: 'Ticket #4790 opened: "Chargeback webhooks missing headers"' }
    ]
  },
  {
    id: 'merch-06',
    name: 'Stark Industries',
    industry: 'SaaS',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 11,
    assignedCsm: 'Sarah Jenkins',
    mrr: 18000,
    mrrTrendMoM: 1.5,
    transactionVolume: 12000,
    transactionVolumeTrendMoM: 0.5,
    daysSinceLastLogin: 1,
    daysSinceLastCsmTouchpoint: 5,
    paymentFailureRate: 1.8,
    openSupportTickets: 8, // Critical support load driver
    criticalSupportTickets: 3,
    isSeasonal: false,
    csmNotes: 'Stark Industries has 3 unresolved high priority tickets related to our new billing subscription API.',
    recentActivity: [
      { id: 'act-601', date: '2026-07-14', type: 'support', description: 'Ticket #4811 escalated to Critical: "Billing Webhooks intermittent failures"' },
      { id: 'act-602', date: '2026-07-12', type: 'support', description: 'Ticket #4805 opened: "Customer portal showing wrong subscription metadata"' },
      { id: 'act-603', date: '2026-07-09', type: 'csm', description: 'Meeting held with Director of Engineering to align on support roadmap' }
    ]
  },
  {
    id: 'merch-07',
    name: 'Wayne Travels',
    industry: 'Travel',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 30,
    assignedCsm: 'Elena Rostova',
    mrr: 35000,
    mrrTrendMoM: 8.0,
    transactionVolume: 14500,
    transactionVolumeTrendMoM: 12.4,
    daysSinceLastLogin: 1,
    daysSinceLastCsmTouchpoint: 10,
    paymentFailureRate: 2.5, // High-risk industry, healthy
    openSupportTickets: 1,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Stellar expansion. High travel volume. Highly satisfied account.',
    recentActivity: [
      { id: 'act-701', date: '2026-07-13', type: 'system', description: 'MRR crossed $35,000 threshold' },
      { id: 'act-702', date: '2026-07-05', type: 'csm', description: 'EBR completed: Client planning expansion into LATAM next quarter' }
    ]
  },
  {
    id: 'merch-08',
    name: 'Cyberdyne Systems',
    industry: 'SaaS',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 15,
    assignedCsm: 'David Vance',
    mrr: 7500,
    mrrTrendMoM: -22.0, // Financial drop
    transactionVolume: 2400,
    transactionVolumeTrendMoM: -18.2,
    daysSinceLastLogin: 12,
    daysSinceLastCsmTouchpoint: 75, // Severe touchpoint silence
    paymentFailureRate: 2.4,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Zero support tickets but declining usage and complete silence. Highly dangerous.',
    recentActivity: [
      { id: 'act-801', date: '2026-07-01', type: 'system', description: 'Flagged: 75 days since last CSM contact log' },
      { id: 'act-802', date: '2026-06-25', type: 'system', description: 'MoM transaction volume dropped -20%' }
    ]
  },
  {
    id: 'merch-09',
    name: 'Umbrella EdTech',
    industry: 'EdTech',
    subscriptionPlan: 'Basic',
    accountAgeMonths: 6,
    assignedCsm: 'Elena Rostova',
    mrr: 4200,
    mrrTrendMoM: -14.5,
    transactionVolume: 3400,
    transactionVolumeTrendMoM: -10.0,
    daysSinceLastLogin: 18, // Multiple factors warning
    daysSinceLastCsmTouchpoint: 45,
    paymentFailureRate: 5.5,
    openSupportTickets: 2,
    criticalSupportTickets: 1,
    isSeasonal: false,
    csmNotes: 'Onboarding friction was not fully resolved. New customer struggling with integration.',
    recentActivity: [
      { id: 'act-901', date: '2026-07-11', type: 'support', description: 'Ticket #4754 opened: "Student subscription portal sync issue"' },
      { id: 'act-902', date: '2026-07-02', type: 'system', description: 'Payment failure rate hit 5.5%' }
    ]
  },
  {
    id: 'merch-10',
    name: 'Initech Systems',
    industry: 'SaaS',
    subscriptionPlan: 'Basic',
    accountAgeMonths: 20,
    assignedCsm: 'Sarah Jenkins',
    mrr: 2400,
    mrrTrendMoM: -2.0,
    transactionVolume: 1200,
    transactionVolumeTrendMoM: 0.0,
    daysSinceLastLogin: 5,
    daysSinceLastCsmTouchpoint: 68, // Relationship silence
    paymentFailureRate: 1.8,
    openSupportTickets: 1,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Stable usage but CSM has not had a live conversation with Initech in over two months.',
    recentActivity: [
      { id: 'act-1001', date: '2026-07-05', type: 'system', description: 'CSM Relationship touchpoint latency exceeded 60 days' }
    ]
  },
  {
    id: 'merch-11',
    name: 'Hooli Search',
    industry: 'SaaS',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 48,
    assignedCsm: 'David Vance',
    mrr: 45000,
    mrrTrendMoM: 12.0,
    transactionVolume: 180000,
    transactionVolumeTrendMoM: 15.6,
    daysSinceLastLogin: 0,
    daysSinceLastCsmTouchpoint: 14,
    paymentFailureRate: 0.9,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Our largest account. Flawless volume growth and highly active development integration.',
    recentActivity: [
      { id: 'act-1101', date: '2026-07-15', type: 'system', description: 'Monthly billing successfully charged: $45,000' },
      { id: 'act-1102', date: '2026-07-01', type: 'csm', description: 'Logged quarterly review sync. Net Promoter Score: 10/10' }
    ]
  },
  {
    id: 'merch-12',
    name: 'Tyrell Replicants',
    industry: 'SaaS',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 15,
    assignedCsm: 'Elena Rostova',
    mrr: 16500,
    mrrTrendMoM: 1.8,
    transactionVolume: 25000,
    transactionVolumeTrendMoM: 5.2,
    daysSinceLastLogin: 35, // Mitigated Inactivity (Usage is up)
    daysSinceLastCsmTouchpoint: 10,
    paymentFailureRate: 0.8,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Tyrell processes heavy transaction volumes via automated cron tasks. They do not log into the user portal often.',
    recentActivity: [
      { id: 'act-1201', date: '2026-07-10', type: 'system', description: 'Portal login inactivity warning (30 days)' },
      { id: 'act-1202', date: '2026-07-06', type: 'csm', description: 'Logged brief email confirmation on custom report formats' }
    ]
  },
  {
    id: 'merch-13',
    name: 'Soylent Greens',
    industry: 'E-commerce',
    subscriptionPlan: 'Basic',
    accountAgeMonths: 8,
    assignedCsm: 'Sarah Jenkins',
    mrr: 4800,
    mrrTrendMoM: -4.2,
    transactionVolume: 1500,
    transactionVolumeTrendMoM: -2.0,
    daysSinceLastLogin: 6,
    daysSinceLastCsmTouchpoint: 32,
    paymentFailureRate: 4.8, // Elevated technical risk
    openSupportTickets: 2,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Soylent Greens is experiencing some card processor rejects. CSM needs to monitor failure rate.',
    recentActivity: [
      { id: 'act-1301', date: '2026-07-12', type: 'support', description: 'Ticket #4772 opened: "Customer reports card rejection at checkout"' }
    ]
  },
  {
    id: 'merch-14',
    name: 'Virtucon Industries',
    industry: 'EdTech',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 19,
    assignedCsm: 'David Vance',
    mrr: 3200,
    mrrTrendMoM: 0.5,
    transactionVolume: 800,
    transactionVolumeTrendMoM: -2.2,
    daysSinceLastLogin: 4,
    daysSinceLastCsmTouchpoint: 28,
    paymentFailureRate: 1.9,
    openSupportTickets: 3, // Support risk warning
    criticalSupportTickets: 1,
    isSeasonal: false,
    csmNotes: 'Friction on new course portal plugin. Support has an open ticket with technical engineering.',
    recentActivity: [
      { id: 'act-1401', date: '2026-07-10', type: 'support', description: 'Ticket #4744 opened: "V2 plugin sync error: course metadata missing"' }
    ]
  },
  {
    id: 'merch-15',
    name: 'Veer Cruise Travels',
    industry: 'Travel',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 22,
    assignedCsm: 'Elena Rostova',
    mrr: 9800,
    mrrTrendMoM: -25.0, // Seasonal travel dip
    transactionVolume: 4100,
    transactionVolumeTrendMoM: -22.4,
    daysSinceLastLogin: 2,
    daysSinceLastCsmTouchpoint: 14,
    paymentFailureRate: 3.2,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: true, // Seasonal flag
    csmNotes: 'Summer cruise line booking drop is natural in winter. Keep seasonal filter enabled.',
    recentActivity: [
      { id: 'act-1501', date: '2026-07-10', type: 'system', description: 'MoM volume contraction reached -22%' }
    ]
  },
  {
    id: 'merch-16',
    name: 'Oscorp Chemical',
    industry: 'Retail',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 5,
    assignedCsm: 'Sarah Jenkins',
    mrr: 6000,
    mrrTrendMoM: -5.0,
    transactionVolume: 2200,
    transactionVolumeTrendMoM: -6.0,
    daysSinceLastLogin: 19,
    daysSinceLastCsmTouchpoint: 48,
    paymentFailureRate: 5.2, // Moderate failures
    openSupportTickets: 1,
    criticalSupportTickets: 1,
    isSeasonal: false,
    csmNotes: 'Early onboarding support tickets went unresolved. New champion is unresponsive.',
    recentActivity: [
      { id: 'act-1601', date: '2026-07-08', type: 'support', description: 'Ticket #4655 opened: "API key resets intermittently"' }
    ]
  },
  {
    id: 'merch-17',
    name: 'Cyberpunk Esports',
    industry: 'Gaming',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 16,
    assignedCsm: 'David Vance',
    mrr: 15000,
    mrrTrendMoM: 14.5, // High growth
    transactionVolume: 42000,
    transactionVolumeTrendMoM: 18.2,
    daysSinceLastLogin: 1,
    daysSinceLastCsmTouchpoint: 8,
    paymentFailureRate: 11.2, // Gaming industry: normally 100 points, adjusted downwards
    openSupportTickets: 3,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Esports tournament organizer. Massive spikes in payment volumes causes high decline rates.',
    recentActivity: [
      { id: 'act-1701', date: '2026-07-14', type: 'system', description: 'Payment failure rate hit 11.2% during Sunday tournament' }
    ]
  },
  {
    id: 'merch-18',
    name: 'Skynet Logistics',
    industry: 'SaaS',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 32,
    assignedCsm: 'Elena Rostova',
    mrr: 11000,
    mrrTrendMoM: -12.2,
    transactionVolume: 4900,
    transactionVolumeTrendMoM: -14.0,
    daysSinceLastLogin: 32, // Portal disengagement
    daysSinceLastCsmTouchpoint: 65, // Latency
    paymentFailureRate: 1.5,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Longstanding account drifting away. Revenue drop combined with login silence and lack of contact.',
    recentActivity: [
      { id: 'act-1801', date: '2026-07-05', type: 'system', description: '30 consecutive days of portal inactivity' },
      { id: 'act-1802', date: '2026-06-25', type: 'system', description: 'CSM Relationship touchpoint latency exceeded 60 days' }
    ]
  },
  {
    id: 'merch-19',
    name: 'Kwik-E-Mart',
    industry: 'Retail',
    subscriptionPlan: 'Basic',
    accountAgeMonths: 21,
    assignedCsm: 'Sarah Jenkins',
    mrr: 3500,
    mrrTrendMoM: 2.1,
    transactionVolume: 1600,
    transactionVolumeTrendMoM: 1.8,
    daysSinceLastLogin: 4,
    daysSinceLastCsmTouchpoint: 22,
    paymentFailureRate: 1.2,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Stable, small retail business processing standard volumes.',
    recentActivity: []
  },
  {
    id: 'merch-20',
    name: 'Blue Sun Corp',
    industry: 'E-commerce',
    subscriptionPlan: 'Enterprise',
    accountAgeMonths: 10,
    assignedCsm: 'David Vance',
    mrr: 28000,
    mrrTrendMoM: -32.0, // High Revenue drop
    transactionVolume: 12500,
    transactionVolumeTrendMoM: -29.8,
    daysSinceLastLogin: 3,
    daysSinceLastCsmTouchpoint: 12,
    paymentFailureRate: 3.4,
    openSupportTickets: 5,
    criticalSupportTickets: 2,
    isSeasonal: false,
    csmNotes: 'Critical concern: Blue Sun had a major platform change and is seeing double digit revenue decline.',
    recentActivity: [
      { id: 'act-2001', date: '2026-07-14', type: 'system', description: 'Weekly revenue alert: -32% MoM drop detected' },
      { id: 'act-2002', date: '2026-07-09', type: 'support', description: 'Ticket #4799 opened: "Checkout webhooks returning 500 status"' }
    ]
  },
  {
    id: 'merch-21',
    name: 'Wonka Confectionery',
    industry: 'Retail',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 13,
    assignedCsm: 'Elena Rostova',
    mrr: 8800,
    mrrTrendMoM: -30.0, // Seasonal drop (post Easter/Holiday)
    transactionVolume: 3500,
    transactionVolumeTrendMoM: -28.0,
    daysSinceLastLogin: 2,
    daysSinceLastCsmTouchpoint: 15,
    paymentFailureRate: 1.8,
    openSupportTickets: 1,
    criticalSupportTickets: 0,
    isSeasonal: true,
    csmNotes: 'Seasonal candy drops post-Easter. Very typical and expected cycles.',
    recentActivity: [
      { id: 'act-2101', date: '2026-07-09', type: 'system', description: 'MoM Revenue contracted 30%' }
    ]
  },
  {
    id: 'merch-22',
    name: 'Olaf Snow Tours',
    industry: 'Travel',
    subscriptionPlan: 'Basic',
    accountAgeMonths: 24,
    assignedCsm: 'Sarah Jenkins',
    mrr: 5400,
    mrrTrendMoM: -45.0, // High seasonal winter drop (running in summer)
    transactionVolume: 1200,
    transactionVolumeTrendMoM: -40.0,
    daysSinceLastLogin: 8,
    daysSinceLastCsmTouchpoint: 20,
    paymentFailureRate: 2.1,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: true,
    csmNotes: 'Known seasonal travel business. Inactive during summer months.',
    recentActivity: [
      { id: 'act-2201', date: '2026-07-12', type: 'system', description: 'MoM Revenue contracted 45%' }
    ]
  },
  {
    id: 'merch-23',
    name: 'Acme Rocket Fuel',
    industry: 'SaaS',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 7,
    assignedCsm: 'David Vance',
    mrr: 10500,
    mrrTrendMoM: 18.2, // High Growth
    transactionVolume: 6700,
    transactionVolumeTrendMoM: 20.4,
    daysSinceLastLogin: 1,
    daysSinceLastCsmTouchpoint: 8,
    paymentFailureRate: 1.4,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Rapidly growing space tech startup. Excellent engagement.',
    recentActivity: [
      { id: 'act-2301', date: '2026-07-15', type: 'system', description: 'Monthly transactional volume hit record 6,700' }
    ]
  },
  {
    id: 'merch-24',
    name: 'Saber Corporation',
    industry: 'SaaS',
    subscriptionPlan: 'Basic',
    accountAgeMonths: 28,
    assignedCsm: 'Sarah Jenkins',
    mrr: 3100,
    mrrTrendMoM: -1.0,
    transactionVolume: 900,
    transactionVolumeTrendMoM: -1.2,
    daysSinceLastLogin: 5,
    daysSinceLastCsmTouchpoint: 18,
    paymentFailureRate: 1.5,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Stable printer portal. Support tickets are rare.',
    recentActivity: []
  },
  {
    id: 'merch-25',
    name: 'Dunder Mifflin',
    industry: 'Retail',
    subscriptionPlan: 'Growth',
    accountAgeMonths: 35,
    assignedCsm: 'Elena Rostova',
    mrr: 7500,
    mrrTrendMoM: 0.0,
    transactionVolume: 3100,
    transactionVolumeTrendMoM: 0.0,
    daysSinceLastLogin: 3,
    daysSinceLastCsmTouchpoint: 12,
    paymentFailureRate: 1.3,
    openSupportTickets: 0,
    criticalSupportTickets: 0,
    isSeasonal: false,
    csmNotes: 'Traditional distributor. Steady usage and loyal relationship.',
    recentActivity: []
  }
];
