import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GitPullRequest } from 'lucide-react';

const DEFAULT_PR_TREND_DATA = [
  { date: 'Week 1', passed: 18, changesRequested: 4 },
  { date: 'Week 2', passed: 24, changesRequested: 6 },
  { date: 'Week 3', passed: 22, changesRequested: 3 },
  { date: 'Week 4', passed: 31, changesRequested: 2 },
];

// Custom Dark Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1424] border border-white/10 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-mono">
        <p className="text-gray-300 font-bold mb-1 border-b border-white/10 pb-1">{label}</p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * PullRequestTrendChart Component
 * Reusable dark SaaS Bar Chart tracking PR audit pass rates vs changes requested over time.
 *
 * @param {Object} props
 * @param {Array} [props.data] - PR trend data points [{ date, passed, changesRequested }]
 * @param {string} [props.title] - Chart section title
 * @param {string} [props.className] - Wrapper CSS classes
 */
export const PullRequestTrendChart = ({
  data = DEFAULT_PR_TREND_DATA,
  title = 'PR Audit Outcome Trends',
  className = '',
}) => {
  return (
    <div className={`glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Passed security scans vs changes requested pull request counts
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Passed Scan
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Changes Requested
          </span>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="passed" name="Passed Scan" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="changesRequested" name="Changes Requested" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PullRequestTrendChart;
