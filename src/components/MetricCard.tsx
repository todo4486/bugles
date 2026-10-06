import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    isPositive: boolean; // positive means good for reliability or metric
    label?: string;
  };
  icon: LucideIcon;
  variant?: 'default' | 'rose' | 'amber' | 'emerald' | 'cyan';
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  variant = 'default',
  badgeText
}) => {
  const variantStyles = {
    default: {
      bg: 'bg-[#111114] border-slate-800 hover:border-slate-700',
      iconBg: 'bg-slate-800/80 text-slate-300',
      valueColor: 'text-white'
    },
    rose: {
      bg: 'bg-[#111114] border-slate-800 hover:border-slate-700',
      iconBg: 'bg-red-500/10 text-red-400 border border-red-500/20',
      valueColor: 'text-red-400'
    },
    amber: {
      bg: 'bg-[#111114] border-slate-800 hover:border-slate-700',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      valueColor: 'text-amber-400'
    },
    emerald: {
      bg: 'bg-[#111114] border-slate-800 hover:border-slate-700',
      iconBg: 'bg-green-500/10 text-green-400 border border-green-500/20',
      valueColor: 'text-green-400'
    },
    cyan: {
      bg: 'bg-[#111114] border-slate-800 hover:border-slate-700',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      valueColor: 'text-cyan-300'
    }
  };

  const style = variantStyles[variant];

  return (
    <div 
      id={id}
      className={`relative rounded-xl border p-5 sm:p-5.5 transition-all duration-150 ${style.bg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-[15px] font-semibold tracking-wide text-slate-300">
              {title}
            </span>
            {badgeText && (
              <span className="rounded bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-xs font-mono font-bold text-slate-200">
                {badgeText}
              </span>
            )}
          </div>
          <div className={`text-3xl sm:text-4xl font-bold tracking-tight font-mono ${style.valueColor}`}>
            {value}
          </div>
        </div>

        <div className={`rounded-xl p-2.5 shrink-0 ${style.iconBg}`}>
          <Icon size={22} />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5 text-sm">
          {subtitle && (
            <span className="text-slate-400 text-xs sm:text-[13px] truncate">
              {subtitle}
            </span>
          )}
          {change && (
            <span className={`inline-flex items-center font-bold font-mono text-xs sm:text-[13px] shrink-0 ${
              change.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {change.value}
              {change.label && <span className="ml-1 text-slate-400 font-sans font-normal">{change.label}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
