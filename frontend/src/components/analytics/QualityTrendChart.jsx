import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const DEFAULT_TREND_DATA = [
  { date: 'Jul 01', overallScore: 78, securityScore: 82, performanceScore: 75 },
  { date: 'Jul 05', overallScore: 81, securityScore: 85, performanceScore: 78 },
  { date: 'Jul 10', overallScore: 84, securityScore: 88, performanceScore: 82 },
  { date: 'Jul 15', overallScore: 82, securityScore: 86, performanceScore: 80 },
  { date: 'Jul 20', overallScore: 88, securityScore: 92, performanceScore: 86 },
  { date: 'Jul 25', overallScore: 91, securityScore: 95, performanceScore: 89 },
  { date: 'Aug 01', overallScore: 94, securityScore: 97, performanceScore: 92 },
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
 * QualityTrendChart Component
 * Reusable dark SaaS Line Chart tracking code quality & security score trends over time.
 *
 * @param {Object} props
 * @param {Array} [props.data] - Historical score data points
 * @param {string} [props.title] - Chart section title
 * @param {string} [props.className] - Wrapper CSS classes
 */
export const QualityTrendChart = ({
  data = DEFAULT_TREND_DATA,
  title = 'Code Quality & Security Trend',
  className = '',
}) => {
  return (
    <div className={`glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Historical benchmark score trajectory across commits and PR reviews
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Overall
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Security
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Performance
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="overallScore"
              name="Overall Score"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="securityScore"
              name="Security Score"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#06b6d4' }}
            />
            <Line
              type="monotone"
              dataKey="performanceScore"
              name="Performance Score"
              stroke="#c084fc"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#c084fc' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QualityTrendChart;
