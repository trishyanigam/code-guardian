import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

const PRESETS = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '1y', label: '1 Year' },
  { id: 'custom', label: 'Custom Range' },
];

/**
 * DateFilter Component
 * Reusable dark SaaS timeframe & custom date range filter control.
 *
 * @param {Object} props
 * @param {string} [props.selectedFilter] - '7d' | '30d' | '90d' | '1y' | 'custom'
 * @param {Function} [props.onFilterChange] - Callback (filterId, { startDate, endDate })
 * @param {string} [props.className] - Additional wrapper CSS classes
 */
export const DateFilter = ({
  selectedFilter = '30d',
  onFilterChange,
  className = '',
}) => {
  const [activeFilter, setActiveFilter] = useState(selectedFilter);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handlePresetSelect = (id) => {
    setActiveFilter(id);
    if (onFilterChange) {
      onFilterChange(id, id === 'custom' ? { startDate, endDate } : null);
    }
  };

  const handleCustomDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (onFilterChange && activeFilter === 'custom') {
      onFilterChange('custom', { startDate: start, endDate: end });
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Timeframe Presets Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#0e1424] border border-white/10 p-1 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-gray-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Period:</span>
        </div>

        {PRESETS.map((preset) => {
          const isActive = activeFilter === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <span>{preset.label}</span>
              {isActive && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Custom Date Range Selection Panel (Visible when 'custom' is selected) */}
      {activeFilter === 'custom' && (
        <div className="glass-card rounded-xl border border-white/10 p-3 bg-[#0a0f1d]/90 flex flex-wrap items-center gap-3 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleCustomDateChange(e.target.value, endDate)}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleCustomDateChange(startDate, e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          {(startDate || endDate) && (
            <span className="text-[11px] text-emerald-400 font-mono ml-auto">
              Custom Range Active
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DateFilter;
