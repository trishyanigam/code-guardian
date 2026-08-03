import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/**
 * AnalyticsCard Component
 * Reusable dark SaaS metric card with hover animations and trend indicators.
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Primary stat value
 * @param {React.ReactNode} [props.icon] - Icon component
 * @param {Object|string|number} [props.trend] - Trend data (e.g., { value: '+12%', isPositive: true } or '+12%')
 * @param {string} [props.description] - Subtitle / footer explanation
 * @param {string} [props.className] - Additional wrapper CSS classes
 * @param {Function} [props.onClick] - Optional click handler
 */
export const AnalyticsCard = ({
  title,
  value,
  icon,
  trend,
  description,
  className = '',
  onClick,
}) => {
  // Normalize trend prop
  let trendValue = null;
  let isPositive = true;
  let isNeutral = false;

  if (typeof trend === 'object' && trend !== null) {
    trendValue = trend.value;
    isPositive = trend.isPositive !== undefined ? trend.isPositive : !String(trend.value).startsWith('-');
    isNeutral = trend.isNeutral || false;
  } else if (typeof trend === 'string' || typeof trend === 'number') {
    trendValue = String(trend);
    isPositive = !trendValue.startsWith('-');
  }

  return (
    <div
      onClick={onClick}
      className={`group relative glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 
        hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/[0.08] 
        transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Background ambient glow effect on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/10 blur-2xl transition-all duration-500 pointer-events-none" />

      <div>
        {/* Header: Title & Icon */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
            {title}
          </span>
          {icon && (
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 text-emerald-400 transition-all duration-300">
              {icon}
            </div>
          )}
        </div>

        {/* Main Value & Trend Badge */}
        <div className="flex items-baseline gap-2.5 my-1">
          <span className="text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
            {value}
          </span>

          {trendValue && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                isNeutral
                  ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  : isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{trendValue}</span>
            </span>
          )}
        </div>
      </div>

      {/* Description Subtext */}
      {description && (
        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default AnalyticsCard;
