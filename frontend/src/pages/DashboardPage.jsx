import React, { useState, useEffect, useMemo } from 'react';
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
  FiCheck,
} from 'react-icons/fi';
import DashboardCard from '../components/dashboard/DashboardCard';
import { useAuth } from '../hooks/useAuth';
import * as repositoryService from '../services/repository.service';

const MOCK_FALLBACK_REPOSITORIES = [
  {
    _id: '1',
    githubRepoId: '101',
    owner: 'trishyanigam',
    repoName: 'code-guardian',
    visibility: 'public',
    language: 'JavaScript',
    defaultBranch: 'main',
    description: 'AI-driven code security scanner and real-time vulnerability detection engine.',
    connected: true,
    connectedAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    _id: '2',
    githubRepoId: '102',
    owner: 'trishyanigam',
    repoName: 'auth-service-microservice',
    visibility: 'private',
    language: 'TypeScript',
    defaultBranch: 'main',
    description: 'Production-ready OAuth2 and JWT authentication server with RBAC permissions.',
    connected: true,
    connectedAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    _id: '3',
    githubRepoId: '103',
    owner: 'trishyanigam',
    repoName: 'cloud-infrastructure',
    visibility: 'private',
    language: 'Go',
    defaultBranch: 'master',
    description: 'Kubernetes deployment manifests, Terraform scripts, and AWS IaC code.',
    connected: false,
  },
  {
    _id: '4',
    githubRepoId: '104',
    owner: 'trishyanigam',
    repoName: 'ai-prompt-evaluator',
    visibility: 'public',
    language: 'Python',
    defaultBranch: 'main',
    description: 'Automated prompt engineering suite with safety benchmarking and guardrails.',
    connected: false,
  },
  {
    _id: '5',
    githubRepoId: '105',
    owner: 'trishyanigam',
    repoName: 'react-design-system',
    visibility: 'public',
    language: 'TypeScript',
    defaultBranch: 'main',
    description: 'Reusable accessible UI component library with dark mode design system.',
    connected: true,
    connectedAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    _id: '6',
    githubRepoId: '106',
    owner: 'trishyanigam',
    repoName: 'data-pipeline-worker',
    visibility: 'private',
    language: 'Python',
    defaultBranch: 'main',
    description: 'Distributed event processing pipeline built with Celery and Redis.',
    connected: false,
  },
];

export const DashboardPage = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Developer';

  const [repositories, setRepositories] = useState([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);

  // Fetch repositories data from backend service
  useEffect(() => {
    const fetchRepositoriesData = async () => {
      setIsLoadingRepos(true);
      try {
        const response = await repositoryService.getRepositories();
        const data = response?.data || response;
        if (Array.isArray(data) && data.length > 0) {
          setRepositories(data);
        } else {
          setRepositories(MOCK_FALLBACK_REPOSITORIES);
        }
      } catch (error) {
        console.warn('Backend API unavailable, using initial repository data for dashboard:', error);
        setRepositories(MOCK_FALLBACK_REPOSITORIES);
      } finally {
        setIsLoadingRepos(false);
      }
    };

    fetchRepositoriesData();
  }, []);

  // Compute repository statistics
  const totalRepositoriesCount = repositories.length;
  const connectedRepositoriesList = useMemo(
    () => repositories.filter((r) => r.connected),
    [repositories]
  );
  const connectedCount = connectedRepositoriesList.length;

  const publicConnectedCount = connectedRepositoriesList.filter(
    (r) => String(r.visibility).toLowerCase() === 'public'
  ).length;
  const privateConnectedCount = connectedRepositoriesList.filter(
    (r) => String(r.visibility).toLowerCase() === 'private'
  ).length;

  // Recently connected repositories sorted by connectedAt
  const recentlyConnectedRepos = useMemo(() => {
    return [...connectedRepositoriesList]
      .sort((a, b) => new Date(b.connectedAt || 0) - new Date(a.connectedAt || 0))
      .slice(0, 4);
  }, [connectedRepositoriesList]);

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
          value={`${connectedCount}`}
          change={`${totalRepositoriesCount} total in workspace`}
          changeType="positive"
          icon={FiFolder}
          subtitle={`${publicConnectedCount} Public • ${privateConnectedCount} Private`}
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

          {/* Recently Connected Repositories Section */}
          <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <FiFolder className="w-4 h-4 text-emerald-400" />
                  <span>Recently Connected Repositories</span>
                </h2>
                <p className="text-xs text-gray-400">Active connected codebases monitored for AI security checks</p>
              </div>
              <Link
                to="/repositories"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                <span>View all ({connectedCount})</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingRepos ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 bg-white/5 rounded-xl border border-white/10"></div>
                ))}
              </div>
            ) : recentlyConnectedRepos.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                <FiFolder className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-3">No repositories connected yet.</p>
                <Link
                  to="/repositories/connect"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-all"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Connect Repository</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentlyConnectedRepos.map((repo, idx) => {
                  const name = repo.repoName || repo.name;
                  const owner = repo.owner || '';
                  const branch = repo.defaultBranch || repo.branch || 'main';
                  const language = repo.language || 'JavaScript';
                  const visibility = repo.visibility || 'public';
                  const isPrivate = String(visibility).toLowerCase() === 'private';

                  return (
                    <div
                      key={repo._id || repo.githubRepoId || idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono text-gray-400 block truncate">
                            {owner}/
                          </span>
                          <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate block">
                            {name}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${
                            isPrivate
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          }`}
                        >
                          <span className="capitalize">{visibility}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mt-3 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-gray-300">
                            <FiGitBranch className="w-3 h-3 text-emerald-400" />
                            {branch}
                          </span>
                          <span>•</span>
                          <span>{language}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                          <FiCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
