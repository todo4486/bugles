import React from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  size = 'md', 
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[13px] font-bold font-mono tracking-wider rounded-md',
    md: 'px-3.5 py-1.5 text-sm sm:text-[15px] font-bold font-mono tracking-wider rounded-lg',
    lg: 'px-4 py-2 text-base sm:text-lg font-bold font-mono tracking-wider rounded-lg',
    xl: 'px-5 py-3 text-2xl sm:text-3xl font-extrabold font-mono tracking-wide rounded-xl shadow-lg'
  };

  const iconSizes = {
    sm: 14,
    md: 17,
    lg: 20,
    xl: 30
  };

  const pulseDotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  if (level === 'HIGH') {
    return (
      <span className={`inline-flex items-center gap-2 bg-red-500/15 text-red-300 border border-red-500/40 shadow-sm ${sizeClasses[size]}`}>
        {showIcon && <ShieldAlert size={iconSizes[size]} className="text-red-400 shrink-0" />}
        <span className={`inline-block rounded-full bg-red-500 animate-pulse shrink-0 ${pulseDotSizes[size]}`} />
        <span>HIGH RISK</span>
      </span>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <span className={`inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm ${sizeClasses[size]}`}>
        {showIcon && <AlertTriangle size={iconSizes[size]} className="text-amber-400 shrink-0" />}
        <span className={`inline-block rounded-full bg-amber-500 shrink-0 ${pulseDotSizes[size]}`} />
        <span>MEDIUM RISK</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm ${sizeClasses[size]}`}>
      {showIcon && <ShieldCheck size={iconSizes[size]} className="text-emerald-400 shrink-0" />}
      <span className={`inline-block rounded-full bg-emerald-500 shrink-0 ${pulseDotSizes[size]}`} />
      <span>LOW RISK</span>
    </span>
  );
};
