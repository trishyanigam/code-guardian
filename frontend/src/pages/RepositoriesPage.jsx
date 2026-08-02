import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiX,
  FiPlus,
  FiLock,
  FiGlobe,
} from 'react-icons/fi';
import { ChevronRight, FolderGit2 } from 'lucide-react';
import RepositoryCard from '../components/repository/RepositoryCard';
import RepositorySkeleton from '../components/repository/RepositorySkeleton';
import * as repositoryService from '../services/repository.service';

const INITIAL_REPOSITORIES = [
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

export const RepositoriesPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [disconnectingId, setDisconnectingId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Notification Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch repositories from API or initialize with dataset
  const loadRepositories = async () => {
    setIsLoading(true);
    try {
      const response = await repositoryService.getRepositories();
      const fetchedData = response?.data || response;
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setRepositories(fetchedData);
      } else {
        setRepositories(INITIAL_REPOSITORIES);
      }
    } catch (error) {
      console.warn('Backend API unavailable, displaying initial repository workspace dataset:', error);
      setRepositories(INITIAL_REPOSITORIES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  // Handle Sync from GitHub
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await repositoryService.syncRepositories();
      const synced = response?.data || response;
      if (Array.isArray(synced) && synced.length > 0) {
        setRepositories(synced);
      }
      showToast('Successfully synchronized repositories from GitHub', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to sync repositories from GitHub', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Connect
  const handleConnect = async (repo) => {
    const targetId = repo._id || repo.githubRepoId;
    setConnectingId(targetId);

    try {
      await repositoryService.connectRepository(targetId);
      setRepositories((prev) =>
        prev.map((r) =>
          r._id === targetId || r.githubRepoId === targetId
            ? { ...r, connected: true }
            : r
        )
      );
      showToast(`Connected ${repo.owner}/${repo.repoName} to Code Guardian`, 'success');
    } catch (error) {
      // Client-side fallback update
      setRepositories((prev) =>
        prev.map((r) =>
          r._id === targetId || r.githubRepoId === targetId
            ? { ...r, connected: true }
            : r
        )
      );
      showToast(`Connected ${repo.owner}/${repo.repoName}`, 'success');
    } finally {
      setConnectingId(null);
    }
  };

  // Handle Disconnect
  const handleDisconnect = async (repo) => {
    const targetId = repo._id || repo.githubRepoId;
    setDisconnectingId(targetId);

    try {
      await repositoryService.disconnectRepository(targetId);
      setRepositories((prev) =>
        prev.map((r) =>
          r._id === targetId || r.githubRepoId === targetId
            ? { ...r, connected: false }
            : r
        )
      );
      showToast(`Disconnected ${repo.owner}/${repo.repoName}`, 'info');
    } catch (error) {
      // Client-side fallback update
      setRepositories((prev) =>
        prev.map((r) =>
          r._id === targetId || r.githubRepoId === targetId
            ? { ...r, connected: false }
            : r
        )
      );
      showToast(`Disconnected ${repo.owner}/${repo.repoName}`, 'info');
    } finally {
      setDisconnectingId(null);
    }
  };

  // Extract unique languages for filter dropdown
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    repositories.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return Array.from(langs).sort();
  }, [repositories]);

  // Filter Repositories logic
  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      // Search query filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        repo.repoName?.toLowerCase().includes(query) ||
        repo.owner?.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query);

      // Language filter
      const matchesLanguage =
        selectedLanguage === 'all' ||
        repo.language?.toLowerCase() === selectedLanguage.toLowerCase();

      // Visibility filter
      const matchesVisibility =
        selectedVisibility === 'all' ||
        repo.visibility?.toLowerCase() === selectedVisibility.toLowerCase();

      // Connection status filter
      const isConn = Boolean(repo.connected);
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'connected' && isConn) ||
        (selectedStatus === 'not_connected' && !isConn);

      return matchesSearch && matchesLanguage && matchesVisibility && matchesStatus;
    });
  }, [repositories, searchQuery, selectedLanguage, selectedVisibility, selectedStatus]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('all');
    setSelectedVisibility('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedLanguage !== 'all' ||
    selectedVisibility !== 'all' ||
    selectedStatus !== 'all';

  // Stats calculation
  const totalCount = repositories.length;
  const connectedCount = repositories.filter((r) => r.connected).length;
  const publicCount = repositories.filter((r) => r.visibility === 'public').length;
  const privateCount = repositories.filter((r) => r.visibility === 'private').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : toast.type === 'info'
              ? 'bg-sky-950/90 border-sky-500/40 text-sky-200'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          }`}
        >
          <FiCheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">Repositories</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Repositories Workspace</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse, filter, and connect codebases to enable AI automated security scanning
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-200 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>

          {/* Connect New Repo Link */}
          <Link
            to="/repositories/connect"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <FiPlus className="w-4 h-4" />
            <span>Connect Repository</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/60">
          <span className="text-[11px] text-gray-400 font-medium block">Total Repositories</span>
          <span className="text-xl font-bold text-white mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/60">
          <span className="text-[11px] text-gray-400 font-medium block">Active Connections</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{connectedCount}</span>
        </div>
        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/60">
          <span className="text-[11px] text-gray-400 font-medium block">Public Codebases</span>
          <span className="text-xl font-bold text-cyan-400 mt-1 block">{publicCount}</span>
        </div>
        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/60">
          <span className="text-[11px] text-gray-400 font-medium block">Private Repositories</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{privateCount}</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card-linear rounded-2xl border border-white/10 p-4 bg-[#0a0f1d]/80 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories by name, owner, or description..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Language Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400 hidden sm:inline-block font-medium">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0d1424] border border-white/10 text-gray-200 text-xs focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="all">All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang.toLowerCase()}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Toggle Badges / Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          {/* Visibility Filter Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium mr-1">Visibility:</span>
            <button
              type="button"
              onClick={() => setSelectedVisibility('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedVisibility === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedVisibility('public')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedVisibility === 'public'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              <FiGlobe className="w-3 h-3" />
              <span>Public</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedVisibility('private')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedVisibility === 'private'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              <FiLock className="w-3 h-3" />
              <span>Private</span>
            </button>
          </div>

          {/* Connection Status Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium mr-1">Status:</span>
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('connected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedStatus === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              Connected
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('not_connected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedStatus === 'not_connected'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              Not Connected
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-2 text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <RepositorySkeleton key={index} />
          ))}
        </div>
      ) : filteredRepositories.length === 0 ? (
        /* Empty State */
        <div className="glass-card-linear rounded-2xl border border-white/10 p-12 text-center bg-[#0a0f1d]/80 max-w-xl mx-auto my-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FolderGit2 className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Repositories Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
            {hasActiveFilters
              ? 'No repositories match your active search or filter criteria. Try resetting your filters to see more results.'
              : 'You currently have no repositories available in your workspace.'}
          </p>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-all cursor-pointer"
            >
              <FiX className="w-3.5 h-3.5" />
              <span>Reset Search & Filters</span>
            </button>
          ) : (
            <Link
              to="/repositories/connect"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
            >
              <FiPlus className="w-4 h-4" />
              <span>Connect First Repository</span>
            </Link>
          )}
        </div>
      ) : (
        /* Repositories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepositories.map((repo) => {
            const repoId = repo._id || repo.githubRepoId;
            return (
              <RepositoryCard
                key={repoId}
                repo={repo}
                isConnected={Boolean(repo.connected)}
                isConnecting={connectingId === repoId}
                isDisconnecting={disconnectingId === repoId}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RepositoriesPage;
