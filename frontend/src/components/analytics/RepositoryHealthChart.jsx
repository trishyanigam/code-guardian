import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { FolderGit2 } from 'lucide-react';

const DEFAULT_REPO_HEALTH = [
  { repoName: 'code-guardian', score: 94, issues: 3 },
  { repoName: 'auth-service', score: 88, issues: 8 },
  { repoName: 'cloud-infra', score: 78, issues: 14 },
  { repoName: 'react-design-system', score: 96, issues: 1 },
  { repoName: 'payment-gateway', score: 85, issues: 6 },
];

const getBarColor = (score) => {
  if (score >= 90) return '#10b981'; // Emerald 500
  if (score >= 80) return '#06b6d4'; // Cyan 500
  if (score >= 70) return '#f59e0b'; // Amber 500
  return '#f43f5e'; // Rose 500
};

// Custom Dark Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0e1424] border border-white/10 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-mono">
        <p className="text-white font-bold flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1">
          <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{data.repoName}</span>
        </p>
        <div className="flex justify-between items-center gap-4 text-emerald-400">
          <span>Avg AI Score:</span>
          <span className="font-bold">{data.score} / 100</span>
        </div>
        {data.issues !== undefined && (
          <div className="flex justify-between items-center gap-4 text-gray-400">
            <span>Open Issues:</span>
            <span className="text-white font-bold">{data.issues}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

/**
 * RepositoryHealthChart Component
 * Reusable dark SaaS Horizontal Bar Chart displaying repository health and average AI scores.
 *
 * @param {Object} props
 * @param {Array} [props.data] - Array of repository health objects [{ repoName, score, issues }]
 * @param {string} [props.title] - Optional section title
 * @param {string} [props.className] - Additional wrapper CSS classes
 */
export const RepositoryHealthChart = ({
  data = DEFAULT_REPO_HEALTH,
  title = 'Repository Health & AI Scores',
  className = '',
}) => {
  return (
    <div className={`glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Average AI security and code quality scores across connected repositories
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="repoName"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" name="Avg AI Score" radius={[0, 6, 6, 0]} barSize={18}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RepositoryHealthChart;
