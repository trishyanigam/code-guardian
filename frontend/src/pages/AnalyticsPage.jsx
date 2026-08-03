import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertTriangle,
  GitPullRequest,
  FolderGit2,
  Users,
  Calendar,
  ChevronRight,
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

// Mock Data Sets for Recharts

// 1. Code Quality & Security Score Trend Over Time (Line Chart)
const TREND_DATA = [
  { date: 'Jul 01', overallScore: 78, securityScore: 82, performanceScore: 75 },
  { date: 'Jul 05', overallScore: 81, securityScore: 85, performanceScore: 78 },
  { date: 'Jul 10', overallScore: 84, securityScore: 88, performanceScore: 82 },
  { date: 'Jul 15', overallScore: 82, securityScore: 86, performanceScore: 80 },
  { date: 'Jul 20', overallScore: 88, securityScore: 92, performanceScore: 86 },
  { date: 'Jul 25', overallScore: 91, securityScore: 95, performanceScore: 89 },
  { date: 'Aug 01', overallScore: 94, securityScore: 97, performanceScore: 92 },
];

// 2. Issue Breakdown by Severity (Pie Chart)
const ISSUE_BREAKDOWN_DATA = [
  { name: 'Critical', value: 4, color: '#f43f5e' }, // Rose 500
  { name: 'High', value: 12, color: '#f59e0b' }, // Amber 500
  { name: 'Medium', value: 24, color: '#eab308' }, // Yellow 500
  { name: 'Low / Info', value: 45, color: '#06b6d4' }, // Cyan 500
];

// 3. Repository Health Scores (Bar Chart)
const REPO_HEALTH_DATA = [
  { name: 'code-guardian', overall: 94, security: 97, issues: 3 },
  { name: 'auth-microservice', overall: 88, security: 91, issues: 8 },
  { name: 'cloud-infra', overall: 78, security: 82, issues: 14 },
  { name: 'react-design-system', overall: 96, security: 98, issues: 1 },
  { name: 'payment-gateway', overall: 85, security: 89, issues: 6 },
];

// 4. PR Review Trends (Passed vs Changes Requested Bar Chart)
const PR_TREND_DATA = [
  { date: 'Week 1', passed: 18, changesRequested: 4 },
  { date: 'Week 2', passed: 24, changesRequested: 6 },
  { date: 'Week 3', passed: 22, changesRequested: 3 },
  { date: 'Week 4', passed: 31, changesRequested: 2 },
];

// 5. Developer Leaderboard Data
const DEVELOPER_LEADERBOARD = [
  {
    rank: 1,
    name: 'Sarah Chen',
    username: 'sarahchen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    prs: 28,
    avgSecurity: 98,
    cleanCodeRating: 'S Tier',
    issuesFound: 2,
  },
  {
    rank: 2,
    name: 'Trishy Nigam',
    username: 'trishyanigam',
    avatar: 'https://github.com/github.png',
    prs: 34,
    avgSecurity: 94,
    cleanCodeRating: 'A+ Tier',
    issuesFound: 5,
  },
  {
    rank: 3,
    name: 'Elena Rostova',
    username: 'elena-r',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    prs: 19,
    avgSecurity: 92,
    cleanCodeRating: 'A Tier',
    issuesFound: 4,
  },
  {
    rank: 4,
    name: 'Alex Rivera',
    username: 'arivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    prs: 22,
    avgSecurity: 86,
    cleanCodeRating: 'B+ Tier',
    issuesFound: 9,
  },
];

// Custom Dark Tooltip Component for Recharts
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

export const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('30d');

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">Security Analytics</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Security Analytics & Trends
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Live Insights
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Comprehensive code quality trends, vulnerability distribution, repository health, and developer performance
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 p-1 rounded-xl text-xs shrink-0 self-start md:self-auto">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'ytd', label: 'Year to Date' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                timeframe === tf.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Audits */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Total AI Audits</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">148</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Completed pull request reviews</p>
        </div>

        {/* Avg Security Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Avg Security Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">94.2</span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium">🟢 Excellent Security Rating</p>
        </div>

        {/* Vulnerabilities Blocked */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 flex flex-col justify-between hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Vulnerabilities Blocked</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-amber-400 tracking-tight">85</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -12.5%
            </span>
          </div>
          <p className="text-[11px] text-gray-400">16 High/Critical issues remediated</p>
        </div>

        {/* Monitored Repositories */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Monitored Repos</span>
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-cyan-400 tracking-tight">14</span>
            <span className="text-xs font-mono text-gray-400">Active</span>
          </div>
          <p className="text-[11px] text-cyan-400/90 font-medium">100% Webhook Active Sync</p>
        </div>
      </div>

      {/* Row 1: Code Quality Trend (Line Chart) & Issue Breakdown (Pie Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Quality Trend Line Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Code Quality & Security Trend</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Historical trajectory of overall quality, security, and performance scores
              </p>
            </div>

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
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
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

        {/* Issue Breakdown Pie Chart (lg:col-span-4) */}
        <div className="lg:col-span-4 glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Issue Severity Breakdown</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Distribution of detected issues by severity level
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ISSUE_BREAKDOWN_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ISSUE_BREAKDOWN_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0f1d" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-white">85</span>
              <span className="text-[10px] text-gray-400 font-mono">Total Issues</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
            {ISSUE_BREAKDOWN_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-2 rounded-lg border border-white/5">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Repository Health Bar Chart & PR Review Trend Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Repository Health Chart (lg:col-span-6) */}
        <div className="lg:col-span-6 glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                <span>Repository Health Benchmarks</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Overall score vs security rating per repository
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPO_HEALTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="overall" name="Overall Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="security" name="Security Rating" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PR Trend Bar Chart (lg:col-span-6) */}
        <div className="lg:col-span-6 glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                <span>PR Audit Outcome Trends</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Passed security scans vs changes requested over time
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PR_TREND_DATA}>
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
      </div>

      {/* Developer Leaderboard Section */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Developer Security & Quality Leaderboard</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Top performing contributors ranked by clean code score and security standards
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Developer</th>
                <th className="pb-3 font-semibold">PRs Submitted</th>
                <th className="pb-3 font-semibold">Avg Security Score</th>
                <th className="pb-3 font-semibold">Clean Code Rating</th>
                <th className="pb-3 font-semibold">Issues Found</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DEVELOPER_LEADERBOARD.map((dev) => (
                <tr key={dev.rank} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-mono text-gray-400">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                      dev.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      dev.rank === 2 ? 'bg-gray-300/20 text-gray-200 border border-gray-300/30' :
                      'bg-amber-700/20 text-amber-600 border border-amber-700/30'
                    }`}>
                      #{dev.rank}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={dev.avatar}
                        alt={dev.name}
                        className="w-7 h-7 rounded-full border border-white/20 object-cover"
                      />
                      <div>
                        <span className="font-bold text-white block">{dev.name}</span>
                        <span className="text-[10px] font-mono text-gray-400">@{dev.username}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 font-mono text-gray-200 font-semibold">
                    {dev.prs} PRs
                  </td>

                  <td className="py-3.5 font-mono">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {dev.avgSecurity} / 100
                    </span>
                  </td>

                  <td className="py-3.5 font-mono">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                      {dev.cleanCodeRating}
                    </span>
                  </td>

                  <td className="py-3.5 font-mono text-gray-400">
                    {dev.issuesFound} issues
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repository Comparison Matrix Section */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span>Repository Security Comparison</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Side-by-side security benchmarking across connected team repositories
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Repository Name</th>
                <th className="pb-3 font-semibold">Language</th>
                <th className="pb-3 font-semibold">Overall Health</th>
                <th className="pb-3 font-semibold">Security Rating</th>
                <th className="pb-3 font-semibold">Issues Detected</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {REPO_HEALTH_DATA.map((repo, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-2 font-mono text-gray-200 font-bold">
                      <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>trishyanigam/{repo.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 font-mono text-gray-400">
                    JavaScript / Node.js
                  </td>

                  <td className="py-3.5 font-mono">
                    <span className="font-bold text-white">{repo.overall} / 100</span>
                  </td>

                  <td className="py-3.5 font-mono">
                    <span className="text-emerald-400 font-bold">{repo.security} / 100</span>
                  </td>

                  <td className="py-3.5 font-mono text-gray-300">
                    {repo.issues} open issues
                  </td>

                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Monitored</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
