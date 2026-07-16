import type { Merchant, RiskAnalysis, RecommendationAction } from '../types';

export function getMerchantRecommendation(merchant: Merchant, risk: RiskAnalysis): RecommendationAction {
  // Scenario F: Overall Risk is Low
  if (risk.level === 'Low') {
    return {
      actionType: 'Pitch Expansion & Case Study request',
      reason: `Merchant is healthy (Health Score: ${100 - risk.overallScore}/100) with stable revenues and active dashboard logins. This is the optimal window for advocate engagement.`,
      priority: 'Low',
      steps: [
        'Congratulate the merchant on recent transactional volume milestones via a personalized email.',
        'Ask if they would be willing to act as a case study candidate for the Swym marketing team.',
        'Introduce the merchant to premium Enterprise add-ons (e.g. advanced cross-channel analytics).'
      ]
    };
  }

  const priority = risk.level === 'Critical' ? 'Critical' : 'High';

  // Rule A: Technical Risk is Dominant
  if (risk.dominantFactor === 'technical') {
    return {
      actionType: 'Schedule Technical Integration Audit',
      reason: `Payment failure rate is the primary risk driver (${merchant.paymentFailureRate}%). High failures directly impact merchant revenue and trigger high churn urgency.`,
      priority,
      steps: [
        'Review recent API/gateway logs to isolate the exact error codes (e.g., card declines vs gateway timeouts).',
        'Draft an email introducing a Solutions Engineer to review their payment routing configuration.',
        'Schedule a joint 30-minute troubleshooting session between developer teams to resolve integration blocks.'
      ]
    };
  }

  // Rule B: Activity Risk is Dominant
  if (risk.dominantFactor === 'activity') {
    return {
      actionType: 'Initiate Portal Re-Engagement Campaign',
      reason: `Merchant continues to process API volume, but users have not logged in for ${merchant.daysSinceLastLogin} days. Inactivity indicates risk of losing administrative engagement.`,
      priority: 'Medium',
      steps: [
        'Audit registered account users to check if the main champion or technical lead has left the company.',
        'Send a re-engagement email highlighting the new reporting dashboard and advanced automated workflows.',
        'Offer a 15-minute quick-win walkthrough of the latest dashboard capabilities.'
      ]
    };
  }

  // Rule C: Financial Risk is Dominant
  if (risk.dominantFactor === 'financial') {
    return {
      actionType: 'Conduct Executive Business Review (EBR) & Plan Restructuring',
      reason: `Month-over-month revenue trend is down (${merchant.mrrTrendMoM}%) along with declining transaction counts. We must determine if their business is contracting or if they are offloading traffic.`,
      priority,
      steps: [
        'Analyze transaction volumes over the last 6 months to determine if the drop is structural or seasonal.',
        'Schedule an Executive Business Review (EBR) to understand their current business obstacles and timeline.',
        'Propose a custom tiered subscription rate or loyalty discounts to secure their business for the next 12 months.'
      ]
    };
  }

  // Rule D & E: Support / Relationship Risk is Dominant
  if (risk.dominantFactor === 'support') {
    const daysSinceTouchpoint = merchant.daysSinceLastCsmTouchpoint;

    // Rule E: Silence / Latency
    if (daysSinceTouchpoint > 60) {
      return {
        actionType: 'Executive Sponsor Outreach',
        reason: `Silence is dangerous. No CSM touchpoint has been logged in ${daysSinceTouchpoint} days, exceeding our 60-day relationship threshold.`,
        priority: 'High',
        steps: [
          'Send a direct, non-automated greeting checking in on their Q3 strategy and satisfaction.',
          'Schedule a 15-minute quick sync to re-establish relationship alignment and gather feedback.',
          'Validate that their internal customer champion is still in their active role.'
        ]
      };
    }

    // Rule D: Heavy unresolved tickets
    return {
      actionType: 'Escalate Critical Support Tickets & CSM Sync',
      reason: `Customer friction is high due to ${merchant.openSupportTickets} open support tickets (${merchant.criticalSupportTickets} marked critical).`,
      priority,
      steps: [
        'Escalate open tickets internally to the Tier-2 Support lead and establish an expedited fix ETA.',
        'Email the merchant contact with a detailed update of all ticket statuses and action plans.',
        'Host a brief status update sync with the client to restore confidence and walk through progress.'
      ]
    };
  }

  // Fallback: Multi-factor risk with no single dominant factor
  return {
    actionType: 'Multi-factor Account Rescue Outreach',
    reason: `Merchant has an elevated overall risk score (${risk.overallScore}/100) due to mild issues spread across activity, support, and financial trends.`,
    priority: 'High',
    steps: [
      'Conduct a comprehensive review of the account\'s support tickets, MRR trend, and last touchpoints.',
      'Organize a CSM internal alignment sync to review account history and plan an outreach agenda.',
      'Reach out directly to schedule a general health and review sync.'
    ]
  };
}
