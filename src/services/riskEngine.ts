import type { Merchant, RiskAnalysis, RiskSubScores, RiskLevel } from '../types';

export function calculateMerchantRisk(merchant: Merchant, excludeSeasonal: boolean = false): RiskAnalysis {
  // 1. Activity Risk (30% weight)
  let activityScore = 0;
  let activityDriver = '';
  const daysLogin = merchant.daysSinceLastLogin;

  if (daysLogin <= 7) {
    activityScore = 0;
    activityDriver = `Active in portal within the last week (${daysLogin} days ago).`;
  } else if (daysLogin <= 14) {
    activityScore = 30;
    activityDriver = `Moderate inactivity: last login was ${daysLogin} days ago.`;
  } else if (daysLogin <= 30) {
    activityScore = 70;
    activityDriver = `High inactivity: last login was ${daysLogin} days ago. Portal usage is fading.`;
  } else {
    activityScore = 100;
    activityDriver = `Severe portal inactivity: last login was ${daysLogin} days ago.`;
  }

  // Mitigation: If transaction volume is stable or growing, API-driven merchants score 0 on activity
  const isUsageStable = merchant.transactionVolumeTrendMoM >= 0 && merchant.transactionVolume > 50;
  if (isUsageStable && activityScore > 0) {
    activityScore = 0;
    activityDriver = `API-driven account: Last portal login ${daysLogin} days ago, but transaction volume is stable/growing (${merchant.transactionVolumeTrendMoM >= 0 ? '+' : ''}${merchant.transactionVolumeTrendMoM}% MoM). Portal inactivity is not a churn signal here.`;
  }

  // 2. Financial Risk (30% weight)
  let financialScore = 0;
  let financialDriver = '';
  const mrrTrend = merchant.mrrTrendMoM;
  const volTrend = merchant.transactionVolumeTrendMoM;

  let baseFinScore = 0;
  if (mrrTrend < 0) {
    baseFinScore += Math.abs(mrrTrend) * 3.5; // e.g. -10% -> 35 pts, -20% -> 70 pts
  }
  if (volTrend < 0) {
    baseFinScore += Math.abs(volTrend) * 1.5; // e.g. -10% -> 15 pts
  }
  baseFinScore = Math.min(100, baseFinScore);

  if (baseFinScore === 0) {
    financialDriver = `Healthy financial metrics. MRR trend (${mrrTrend >= 0 ? '+' : ''}${mrrTrend}%) and transaction trends are positive.`;
  } else {
    financialDriver = `Revenue trend is down (${mrrTrend}%) and transaction volumes are declining (${volTrend}%).`;
  }

  // Mitigation: Seasonal Business Adjustment
  if (merchant.isSeasonal && excludeSeasonal) {
    financialScore = Math.round(baseFinScore * 0.4);
    financialDriver = `Seasonal Adjustment Applied: Base contraction score of ${Math.round(baseFinScore)} reduced to ${financialScore} due to known seasonal business cycles.`;
  } else {
    financialScore = Math.round(baseFinScore);
    if (merchant.isSeasonal && !excludeSeasonal) {
      financialDriver += ` (Note: Seasonal business; seasonal adjustments are currently toggled OFF).`;
    }
  }

  // 3. Technical Risk (20% weight)
  let technicalScore = 0;
  let technicalDriver = '';
  const failRate = merchant.paymentFailureRate;
  const isHighRiskIndustry = merchant.industry === 'Gaming' || merchant.industry === 'Travel';

  if (isHighRiskIndustry) {
    // Shifted thresholds upwards by 3% for high-fraud-risk industries
    if (failRate < 5) {
      technicalScore = 0;
      technicalDriver = `Healthy payment failure rate for high-risk industry (${failRate}%).`;
    } else if (failRate < 8) {
      technicalScore = 30;
      technicalDriver = `Warning: Payment failures at ${failRate}% exceed 5% baseline for high-risk sector.`;
    } else if (failRate < 13) {
      technicalScore = 70;
      technicalDriver = `High Failure Rate: Payment failures at ${failRate}% causing checkout friction.`;
    } else {
      technicalScore = 100;
      technicalDriver = `Critical Failure Rate: Payment failures at ${failRate}% require urgent developer auditing.`;
    }
  } else {
    // Standard thresholds
    if (failRate < 2) {
      technicalScore = 0;
      technicalDriver = `Excellent payment health. Failure rate is at ${failRate}%.`;
    } else if (failRate < 5) {
      technicalScore = 30;
      technicalDriver = `Elevated failures: ${failRate}% of transactions are failing.`;
    } else if (failRate < 10) {
      technicalScore = 70;
      technicalDriver = `High payment failure rate (${failRate}%) causing commercial loss.`;
    } else {
      technicalScore = 100;
      technicalDriver = `Critical payment failure rate (${failRate}%) indicating severe checkout friction.`;
    }
  }

  // 4. Support & Relationship Risk (20% weight)
  let supportScore = 0;
  let supportDriver = '';
  const openTickets = merchant.openSupportTickets;
  const critTickets = merchant.criticalSupportTickets;
  const daysTouchpoint = merchant.daysSinceLastCsmTouchpoint;

  // Plan-tier adjusted touchpoint threshold: Enterprise → 30d, Growth → 45d, Basic → 90d
  const touchpointThreshold =
    merchant.subscriptionPlan === 'Enterprise' ? 30 :
    merchant.subscriptionPlan === 'Growth' ? 45 : 90;
  const isRelationshipStale = daysTouchpoint > touchpointThreshold;

  const ticketScore = Math.min(100, (openTickets * 15) + (critTickets * 45));
  const relationshipScore = isRelationshipStale ? 50 : 0;
  let baseSupportScore = Math.max(ticketScore, relationshipScore);

  if (ticketScore >= relationshipScore && ticketScore > 0) {
    supportDriver = `Elevated customer friction: ${openTickets} open support tickets (${critTickets} critical).`;
  } else if (isRelationshipStale) {
    supportDriver = `Relationship latency: No CSM touchpoint logged in ${daysTouchpoint} days (threshold for ${merchant.subscriptionPlan} plan: ${touchpointThreshold}d).`;
  } else {
    supportDriver = `Healthy relationship. Last CSM contact was ${daysTouchpoint} days ago (within ${touchpointThreshold}d ${merchant.subscriptionPlan} plan threshold).`;
  }

  // Mitigation: Active customer growth offsets support load
  const isGrowingRapidly = mrrTrend >= 5 && volTrend >= 5;
  if (isGrowingRapidly && baseSupportScore > 0) {
    baseSupportScore = Math.max(0, baseSupportScore - 25);
    supportDriver += ` (Friction score offset by rapid account expansion: MRR +${mrrTrend}%).`;
  }
  supportScore = baseSupportScore;

  // 5. Overall Score Calculation (Weighted)
  const weightedActivity = 0.3 * activityScore;
  const weightedFinancial = 0.3 * financialScore;
  const weightedTechnical = 0.2 * technicalScore;
  const weightedSupport = 0.2 * supportScore;

  let rawScore = Math.round(weightedActivity + weightedFinancial + weightedTechnical + weightedSupport);

  // New merchant dampening: accounts < 6 months have volatile early-tenure metrics.
  // Reduce sensitivity by 30% to avoid false Critical/High alarms on ramp-up volatility.
  const isNewMerchant = merchant.accountAgeMonths < 6;
  const overallScore = isNewMerchant ? Math.round(rawScore * 0.7) : rawScore;

  // Determine dominant factor
  let dominantFactor: keyof RiskSubScores | 'None' = 'None';
  let maxWeight = 0;

  const contributions = [
    { factor: 'activity' as keyof RiskSubScores, weightedVal: weightedActivity },
    { factor: 'financial' as keyof RiskSubScores, weightedVal: weightedFinancial },
    { factor: 'technical' as keyof RiskSubScores, weightedVal: weightedTechnical },
    { factor: 'support' as keyof RiskSubScores, weightedVal: weightedSupport }
  ];

  contributions.forEach(item => {
    if (item.weightedVal > maxWeight) {
      maxWeight = item.weightedVal;
      dominantFactor = item.factor;
    }
  });

  // Determine level
  let level: RiskLevel = 'Low';
  if (overallScore >= 75) {
    level = 'Critical';
  } else if (overallScore >= 55) {
    level = 'High';
  } else if (overallScore >= 30) {
    level = 'Medium';
  }

  const subScores: RiskSubScores = {
    activity: activityScore,
    financial: financialScore,
    technical: technicalScore,
    support: supportScore
  };

  const riskDrivers = {
    activity: activityDriver,
    financial: financialDriver,
    technical: technicalDriver,
    support: supportDriver
  };

  return {
    overallScore,
    level,
    subScores,
    dominantFactor,
    riskDrivers
  };
}
