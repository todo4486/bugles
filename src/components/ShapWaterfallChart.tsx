import React, { useState } from 'react';
import { ShapContribution } from '../types';
import { HelpCircle, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface ShapWaterfallChartProps {
  contributions: ShapContribution[];
  baseExpectedValue: number;
  finalProbability: number;
  compact?: boolean;
}

export const ShapWaterfallChart: React.FC<ShapWaterfallChartProps> = ({
  contributions,
  baseExpectedValue,
  finalProbability,
  compact = false
}) => {
  const [hoveredFeature, setHoveredFeature] = useState<ShapContribution | null>(null);

  // Find max absolute value to scale bars proportionally
  const maxAbsShap = Math.max(...contributions.map(c => Math.abs(c.shapValue)), 0.35);

  const displayList = compact ? contributions.slice(0, 6) : contributions;

  return (
    <div className="space-y-4">
      {/* Baseline / Output Indicator Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-xl bg-[#0A0A0B] border border-slate-800 px-4 py-3 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="text-slate-300 font-medium">Base Expected Defect Rate <code className="font-mono text-slate-200">E[f(x)]</code>:</span>
          <span className="font-mono font-bold text-white text-base">{baseExpectedValue.toFixed(1)}%</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-rose-400 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Increases Defect Risk (+)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Decreases Defect Risk (-)</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-300 font-medium">Final Model <code className="font-mono text-slate-200">f(x)</code>:</span>{' '}
            <span className="font-mono font-bold text-cyan-400 text-base">{finalProbability.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Horizontal Waterfall Bar List */}
      <div className="space-y-3">
        {displayList.map((item, idx) => {
          const isPositive = item.direction === 'increase';
          const barWidthPercent = Math.min(100, Math.max(8, (Math.abs(item.shapValue) / maxAbsShap) * 100));

          return (
            <div
              key={item.feature}
              onMouseEnter={() => setHoveredFeature(item)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group relative rounded-xl border border-slate-800 bg-[#0A0A0B] p-3.5 transition-all duration-150 hover:border-slate-700 hover:bg-slate-900/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-sm sm:text-base">
                    {item.displayName}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-slate-400">
                    = {item.value.toLocaleString()} <span className="text-slate-400 font-normal">(baseline: {item.baseline.toLocaleString()})</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-sm">
                  {isPositive ? (
                    <span className="inline-flex items-center font-bold text-rose-400">
                      <ArrowUpRight size={16} className="mr-0.5" />
                      {item.impactFormatted}
                    </span>
                  ) : (
                    <span className="inline-flex items-center font-bold text-emerald-400">
                      <ArrowDownRight size={16} className="mr-0.5" />
                      {item.impactFormatted}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-sans">
                    (SHAP: {item.shapValue > 0 ? `+${item.shapValue}` : item.shapValue})
                  </span>
                </div>
              </div>

              {/* Visual Horizontal SHAP Bar */}
              <div className="relative h-2.5 w-full rounded-full bg-slate-900 overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive 
                      ? 'bg-gradient-to-r from-rose-600 to-rose-400' 
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              <div className="mt-1 flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <span className="truncate">{item.description}</span>
                <span className="text-slate-400 shrink-0 ml-3 font-mono text-xs font-semibold">
                  rank #{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Insight Box */}
      {hoveredFeature && (
        <div className="rounded-xl bg-cyan-950/30 border border-cyan-800/50 p-3.5 text-sm text-cyan-200 flex items-start gap-2.5 animate-fadeIn">
          <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-cyan-300">{hoveredFeature.displayName}:</span>{' '}
            <span>{hoveredFeature.description}</span>
            <span className="text-slate-300 ml-2">
              (Current: <b className="text-white font-mono">{hoveredFeature.value}</b> vs Safe Baseline: <b className="text-white font-mono">{hoveredFeature.baseline}</b>)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
