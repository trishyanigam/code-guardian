import React from 'react';

/**
 * Reusable DashboardCard Component
 * Displays key SaaS metrics with icons, trend indicators, and smooth hover animations.
 *
 * @param {string} title - Metric title label
 * @param {string|number} value - Main numeric or status display value
 * @param {React.ElementType} [icon] - Icon component
 * @param {string|{value: string, type?: 'positive'|'negative'|'neutral'}} [trend] - Trend change payload
 * @param {string} [description] - Subtitle description text
 */
export const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
}) => {
  // Support string or structured object for trend prop
  const trendText = typeof trend === 'object' ? trend.value : trend;
  const trendType = typeof trend === 'object' && trend.type ? trend.type : 'positive';

  const getTrendStyle = () => {
    if (trendType === 'negative') {
      return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    }
    if (trendType === 'neutral') {
      return 'bg-white/10 text-gray-300 border-white/10';
    }
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  };

  return (
    <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 ease-out relative overflow-hidden group shadow-lg">
      {/* Top Border Glow Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header: Title & Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Body: Value & Trend Indicator */}
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          {value}
        </h3>
        {trendText && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${getTrendStyle()}`}>
            {trendText}
          </span>
        )}
      </div>

      {/* Footer: Description */}
      {description && (
        <p className="text-[11px] text-gray-400 mt-2 truncate">
          {description}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;
