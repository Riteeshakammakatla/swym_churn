import React from 'react';
import type { RiskLevel } from '../../types';

interface BadgeProps {
  level: RiskLevel | 'HighPriority' | 'MediumPriority' | 'LowPriority';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ level, className = '' }) => {
  const getStyles = () => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20 pulse-critical';
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'HighPriority':
        return 'bg-red-500/25 text-red-300 border-red-500/35';
      case 'MediumPriority':
        return 'bg-amber-500/25 text-amber-300 border-amber-500/35';
      case 'LowPriority':
        return 'bg-blue-500/25 text-blue-300 border-blue-500/35';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()} ${className}`}>
      {level.replace('Priority', '')}
    </span>
  );
};
