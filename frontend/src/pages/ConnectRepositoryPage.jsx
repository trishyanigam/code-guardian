import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShield, FiArrowLeft, FiRefreshCw, FiX, FiCheckCircle } from 'react-icons/fi';
import RepositoryCard from '../components/repository/RepositoryCard';
import RepositorySkeleton from '../components/repository/RepositorySkeleton';

// Mock repository dataset for initial preview
const MOCK_REPOSITORIES = [
  {
    githubRepoId: '101',
    owner: 'trishyanigam',
    repoName: 'code-guardian',
    visibility: 'public',
    language: 'JavaScript',
    defaultBranch: 'main',
    description: 'AI-driven code security scanner and real-time vulnerability detection engine.',
  },
  {
    githubRepoId: '102',
    owner: 'trishyanigam',
    repoName: 'auth-service-microservice',
    visibility: 'private',
    language: 'TypeScript',
    defaultBranch: 'main',
    description: 'Production-ready OAuth2 and JWT authentication server with RBAC permissions.',
  },
  {
    githubRepoId: '103',
    owner: 'trishyanigam',
    repoName: 'cloud-infrastructure',
    visibility: 'private',
    language: 'Go',
    defaultBranch: 'master',
    description: 'Kubernetes deployment manifests, Terraform scripts, and AWS IaC code.',
  },
  {
    githubRepoId: '104',
    owner: 'trishyanigam',
    repoName: 'ai-prompt-evaluator',
    visibility: 'public',
    language: 'Python',
    defaultBranch: 'main',
    description: 'Automated prompt engineering suite with safety benchmarking and guardrails.',
  },
  {
    githubRepoId: '105',
    owner: 'trishyanigam',
    repoName: 'react-design-system',
    visibility: 'public',
    language: 'TypeScript',
    defaultBranch: 'main',
    description: 'Reusable accessible UI component library with dark mode design system.',
  },
  {
    githubRepoId: '106',
    owner: 'trishyanigam',
    repoName: 'data-pipeline-worker',
    visibility: 'private',
    language: 'Python',
    defaultBranch: 'main',
    description: 'Distributed event processing pipeline built with Celery and Redis.',
  },
];

export const ConnectRepositoryPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [connectedRepoIds, setConnectedRepoIds] = useState(new Set(['101']));
  const [connectingId, setConnectingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Simulate repository fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setRepositories(MOCK_REPOSITORIES);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle connecting a repository
  const handleConnect = (repo) => {
    setConnectingId(repo.githubRepoId);

    setTimeout(() => {
      setConnectedRepoIds((prev) => new Set([...prev, repo.githubRepoId]));
      setConnectingId(null);
      setNotification(`Successfully connected ${repo.owner}/${repo.repoName}`);

      setTimeout(() => {
        setNotification('');
      }, 3000);
    }, 900);
  };

  // Filter repositories by search query & filter criteria
  const filteredRepositories = repositories.filter((repo) => {
    const matchesSearch =
      repo.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'public') return repo.visibility.toLowerCase() === 'public';
    if (activeFilter === 'private') return repo.visibility.toLowerCase() === 'private';
    if (activeFilter === 'connected') return connectedRepoIds.has(repo.githubRepoId);

    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#030712] text-gray-100 bg-linear-grid bg-hero-glow flex flex-col font-sans">
      {/* Background Decorative Glow Effects */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <FiShield className="w-5 h-5 text-gray-950 font-bold" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            CodeGuardian <span className="text-emerald-400 font-mono text-sm font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">AI</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 z-10">
        {/* Toast Notification Banner */}
        {notification && (
          <div className="mb-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-emerald-300 text-sm font-medium flex items-center justify-between shadow-lg shadow-emerald-500/10 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-5 h-5 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification('')}
              className="text-emerald-400 hover:text-emerald-200 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Heading */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Connect Repositories
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl">
              Select GitHub repositories to enable automated AI security analysis, dependency vulnerability scanning, and real-time code health monitoring.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 600);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/[0.08] transition-all cursor-pointer self-start md:self-auto"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Repositories</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card-linear rounded-2xl border border-white/10 p-4 mb-8 bg-[#0a0f1d]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repository by name or language..."
              className="w-full rounded-xl bg-slate-900/90 border border-white/10 pl-10 pr-9 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'public', label: 'Public' },
              { id: 'private', label: 'Private' },
              { id: 'connected', label: 'Connected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:bg-white/[0.08] hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Repository Grid UI */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <RepositorySkeleton key={index} />
            ))}
          </div>
        ) : filteredRepositories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRepositories.map((repo) => (
              <RepositoryCard
                key={repo.githubRepoId}
                repo={repo}
                onConnect={handleConnect}
                isConnecting={connectingId === repo.githubRepoId}
                isConnected={connectedRepoIds.has(repo.githubRepoId)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-card-linear rounded-2xl border border-white/10 p-12 text-center bg-[#0a0f1d]/60 max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FiSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">No repositories found</h3>
            <p className="text-xs text-gray-400 mb-4">
              We couldn't find any repository matching "{searchQuery}". Try adjusting your search term or filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-gray-200 hover:bg-white/[0.1] transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/5 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3 mt-12 z-10">
        <p>© {new Date().getFullYear()} CodeGuardian AI Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-300 transition-colors">Documentation</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">GitHub Integration Help</a>
        </div>
      </footer>
    </div>
  );
};

export default ConnectRepositoryPage;
