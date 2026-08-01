import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiFolder,
  FiShield,
  FiGitPullRequest,
  FiAlertTriangle,
  FiPlus,
  FiZap,
  FiGitBranch,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';
import DashboardCard from '../components/dashboard/DashboardCard';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Developer';

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Welcome back, {userName}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Here is your CodeGuardian AI security workspace & code health summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/repositories/connect"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Connect Repository</span>
          </Link>
        </div>
      </div>

      {/* Four Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Connected Repositories"
          value="12"
          change="+2 this week"
          changeType="positive"
          icon={FiFolder}
          subtitle="8 Public • 4 Private"
        />
        <DashboardCard
          title="Security Health Score"
          value="98.4%"
          change="+4.1%"
          changeType="positive"
          icon={FiShield}
          subtitle="Zero critical vulnerabilities"
        />
        <DashboardCard
          title="Active AI PR Reviews"
          value="8"
          change="3 pending"
          changeType="neutral"
          icon={FiGitPullRequest}
          subtitle="Avg review time: 1.2s"
        />
        <DashboardCard
          title="Vulnerabilities Blocked"
          value="142"
          change="-12% threats"
          changeType="positive"
          icon={FiAlertTriangle}
          subtitle="Past 30 days protection"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Pull Requests Section */}
          <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <FiGitPullRequest className="w-4 h-4 text-emerald-400" />
                  <span>Recent Pull Requests</span>
                </h2>
                <p className="text-xs text-gray-400">Automated AI security reviews on incoming code</p>
              </div>
              <Link
                to="/repositories/connect"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                <span>View all</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Fix SQL Injection vulnerability in Auth middleware',
                  repo: 'trishyanigam/code-guardian',
                  author: 'Jane Doe',
                  status: 'AI Approved',
                  score: '99/100',
                  time: '12m ago',
                },
                {
                  title: 'Refactor JWT token verification and cookie parsing',
                  repo: 'trishyanigam/auth-service',
                  author: 'Alex Smith',
                  status: 'Passed',
                  score: '95/100',
                  time: '1h ago',
                },
                {
                  title: 'Update vulnerable npm dependencies to latest patch',
                  repo: 'trishyanigam/cloud-infra',
                  author: 'Dependabot',
                  status: 'AI Reviewing',
                  score: '92/100',
                  time: '3h ago',
                },
              ].map((pr, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-white truncate hover:text-emerald-400 transition-colors">
                      {pr.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                      <span className="font-mono">{pr.repo}</span>
                      <span>•</span>
                      <span>by {pr.author}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
                      Score: {pr.score}
                    </span>
                    <span className="text-[10px] text-gray-500">{pr.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repository Overview Section */}
          <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <FiFolder className="w-4 h-4 text-cyan-400" />
                  <span>Repository Overview</span>
                </h2>
                <p className="text-xs text-gray-400">Monitored codebases and real-time security status</p>
              </div>
              <Link
                to="/repositories/connect"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                <span>Manage Repos</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'code-guardian',
                  owner: 'trishyanigam',
                  branch: 'main',
                  language: 'JavaScript',
                  issues: 0,
                  visibility: 'Public',
                },
                {
                  name: 'auth-service-microservice',
                  owner: 'trishyanigam',
                  branch: 'main',
                  language: 'TypeScript',
                  issues: 1,
                  visibility: 'Private',
                },
                {
                  name: 'cloud-infrastructure',
                  owner: 'trishyanigam',
                  branch: 'master',
                  language: 'Go',
                  issues: 0,
                  visibility: 'Private',
                },
                {
                  name: 'ai-prompt-evaluator',
                  owner: 'trishyanigam',
                  branch: 'main',
                  language: 'Python',
                  issues: 0,
                  visibility: 'Public',
                },
              ].map((repo, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {repo.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-gray-300">
                      {repo.visibility}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <FiGitBranch className="w-3 h-3 text-emerald-400" />
                      {repo.branch}
                    </span>
                    <span>•</span>
                    <span>{repo.language}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col width on large screens) */}
        <div className="space-y-6">
          {/* Recent Activity Feed */}
          <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FiClock className="w-4 h-4 text-emerald-400" />
                <span>Recent Activity</span>
              </h2>
              <span className="text-[10px] font-mono text-gray-500">Live Feed</span>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'AI Code Review Passed',
                  desc: 'PR #142 in code-guardian merged cleanly.',
                  time: '10m ago',
                  icon: FiCheckCircle,
                  color: 'text-emerald-400',
                },
                {
                  title: 'Vulnerability Patched',
                  desc: 'High severity CVE in axios auto-remediated.',
                  time: '2h ago',
                  icon: FiShield,
                  color: 'text-cyan-400',
                },
                {
                  title: 'New Repo Connected',
                  desc: 'trishyanigam/ai-prompt-evaluator added.',
                  time: 'Yesterday',
                  icon: FiFolder,
                  color: 'text-emerald-400',
                },
                {
                  title: 'SOC2 Security Audit Passed',
                  desc: '100% compliance achieved for static checks.',
                  time: '2 days ago',
                  icon: FiZap,
                  color: 'text-amber-400',
                },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/10 shrink-0 ${act.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-white block">{act.title}</span>
                      <span className="text-gray-400 text-[11px] block truncate">{act.desc}</span>
                      <span className="text-gray-500 text-[10px] block mt-0.5">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Security Engine Status Card */}
          <div className="glass-card-linear rounded-2xl border border-emerald-500/20 p-5 bg-gradient-to-br from-emerald-500/10 via-[#0a0f1d] to-cyan-500/10 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <FiZap className="w-5 h-5 animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Guardrails Status</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Automated Analysis Active</h3>
            <p className="text-xs text-gray-400 mb-4">
              CodeGuardian AI is monitoring pull requests in real time.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>AST Parsing</span>
                <span className="text-emerald-400 font-mono font-semibold">100%</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Secret Detection</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
