import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

const DEFAULT_CATEGORY_BREAKDOWN = [
  { name: 'Security', value: 32, color: '#f43f5e' }, // Rose 500
  { name: 'Performance', value: 20, color: '#06b6d4' }, // Cyan 500
  { name: 'Readability', value: 16, color: '#c084fc' }, // Purple 500
  { name: 'Maintainability', value: 14, color: '#f59e0b' }, // Amber 500
  { name: 'Documentation', value: 10, color: '#10b981' }, // Emerald 500
  { name: 'Naming', value: 8, color: '#64748b' }, // Slate 500
];

// Custom Dark Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0e1424] border border-white/10 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-mono">
        <p className="text-white font-bold flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.name}</span>
        </p>
        <div className="flex justify-between items-center gap-4 text-gray-300">
          <span>Detected Issues:</span>
          <span className="font-bold text-white">{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * IssueBreakdownChart Component
 * Reusable dark SaaS Pie / Donut Chart displaying issue category distribution.
 *
 * @param {Object} props
 * @param {Array} [props.data] - Category breakdown data [{ name, value, color }]
 * @param {string} [props.title] - Chart title
 * @param {string} [props.className] - Wrapper CSS classes
 */
export const IssueBreakdownChart = ({
  data = DEFAULT_CATEGORY_BREAKDOWN,
  title = 'Issue Category Breakdown',
  className = '',
}) => {
  const totalIssues = data.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className={`glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4 flex flex-col justify-between ${className}`}>
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{title}</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Proportional distribution of issues across quality & security categories
        </p>
      </div>

      <div className="h-56 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0f1d" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white">{totalIssues}</span>
          <span className="text-[10px] text-gray-400 font-mono">Total Issues</span>
        </div>
      </div>

      {/* Category Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-2 rounded-lg border border-white/5">
            <span className="flex items-center gap-1.5 text-gray-300 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="font-bold text-white shrink-0 ml-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueBreakdownChart;
