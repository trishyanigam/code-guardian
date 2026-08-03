import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GitPullRequest,
  GitMerge,
  Search,
  Filter,
  Calendar,
  User,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FolderGit2,
  ExternalLink,
  Plus,
} from 'lucide-react';

const MOCK_PULL_REQUESTS = [
  {
    id: 'pr-1',
    githubPrId: '1001',
    number: 42,
    title: 'fix(auth): update JWT verification algorithm and token expiration check',
    repository: 'trishyanigam/code-guardian',
    author: {
      name: 'Trishy Nigam',
      username: 'trishyanigam',
      avatar: 'https://github.com/github.png',
    },
    sourceBranch: 'fix/jwt-auth',
    targetBranch: 'main',
    state: 'open',
    status: 'Pending AI Review',
    createdAt: '2026-08-03T08:15:00Z',
    additions: 124,
    deletions: 45,
    changedFilesCount: 4,
    severity: 'High',
  },
  {
    id: 'pr-2',
    githubPrId: '1002',
    number: 38,
    title: 'feat(api): add webhooks signature verification middleware using crypto HMAC',
    repository: 'trishyanigam/code-guardian',
    author: {
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    sourceBranch: 'feat/webhook-sig',
    targetBranch: 'main',
    state: 'open',
    status: 'Passed Security Scan',
    createdAt: '2026-08-03T07:30:00Z',
    additions: 210,
    deletions: 12,
    changedFilesCount: 6,
    severity: 'Safe',
  },
  {
    id: 'pr-3',
    githubPrId: '1003',
    number: 19,
    title: 'refactor(db): optimize MongoDB aggregation queries for repository metrics',
    repository: 'trishyanigam/auth-service-microservice',
    author: {
      name: 'Alex Rivera',
      username: 'arivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    sourceBranch: 'refactor/mongo-perf',
    targetBranch: 'main',
    state: 'open',
    status: 'Approved',
    createdAt: '2026-08-02T19:45:00Z',
    additions: 85,
    deletions: 140,
    changedFilesCount: 3,
    severity: 'Low',
  },
  {
    id: 'pr-4',
    githubPrId: '1004',
    number: 55,
    title: 'sec(deps): patch vulnerable SQL injection vector in query builder helper',
    repository: 'trishyanigam/cloud-infrastructure',
    author: {
      name: 'Marcus Vance',
      username: 'marcusv',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
    sourceBranch: 'security/sqli-patch',
    targetBranch: 'main',
    state: 'open',
    status: 'Changes Requested',
    createdAt: '2026-08-02T14:10:00Z',
    additions: 42,
    deletions: 18,
    changedFilesCount: 2,
    severity: 'Critical',
  },
  {
    id: 'pr-5',
    githubPrId: '1005',
    number: 12,
    title: 'feat(ui): implement dark theme glassmorphic dashboard analytics cards',
    repository: 'trishyanigam/react-design-system',
    author: {
      name: 'Elena Rostova',
      username: 'elena-r',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    sourceBranch: 'feat/glassmorphism',
    targetBranch: 'main',
    state: 'closed',
    status: 'Merged',
    createdAt: '2026-08-01T11:20:00Z',
    additions: 490,
    deletions: 60,
    changedFilesCount: 8,
    severity: 'Safe',
  },
  {
    id: 'pr-6',
    githubPrId: '1006',
    number: 8,
    title: 'chore(ci): configure automated GitHub Actions workflow for security testing',
    repository: 'trishyanigam/ai-prompt-evaluator',
    author: {
      name: 'Trishy Nigam',
      username: 'trishyanigam',
      avatar: 'https://github.com/github.png',
    },
    sourceBranch: 'ci/actions-sec',
    targetBranch: 'main',
    state: 'open',
    status: 'Pending AI Review',
    createdAt: '2026-07-31T16:05:00Z',
    additions: 76,
    deletions: 4,
    changedFilesCount: 1,
    severity: 'Medium',
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending AI Review':
      return {
        label: 'Pending AI Review',
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10',
        icon: <Clock className="w-3.5 h-3.5" />,
      };
    case 'Passed Security Scan':
      return {
        label: 'Passed Security Scan',
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
      };
    case 'Approved':
      return {
        label: 'Approved',
        className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      };
    case 'Changes Requested':
      return {
        label: 'Changes Requested',
        className: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    case 'Merged':
      return {
        label: 'Merged',
        className: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-purple-500/10',
        icon: <GitMerge className="w-3.5 h-3.5" />,
      };
    default:
      return {
        label: status,
        className: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        icon: <GitPullRequest className="w-3.5 h-3.5" />,
      };
  }
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const PullRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract unique repositories for filter dropdown
  const repositoryOptions = useMemo(() => {
    const repos = Array.from(new Set(MOCK_PULL_REQUESTS.map((pr) => pr.repository)));
    return ['all', ...repos];
  }, []);

  // Filtered pull requests
  const filteredPullRequests = useMemo(() => {
    return MOCK_PULL_REQUESTS.filter((pr) => {
      const matchesSearch =
        pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `#${pr.number}`.includes(searchQuery);

      const matchesStatus = selectedStatus === 'all' || pr.status === selectedStatus;
      const matchesRepo = selectedRepo === 'all' || pr.repository === selectedRepo;

      return matchesSearch && matchesStatus && matchesRepo;
    });
  }, [searchQuery, selectedStatus, selectedRepo]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPullRequests.length / itemsPerPage) || 1;
  const paginatedPRs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPullRequests.slice(start, start + itemsPerPage);
  }, [filteredPullRequests, currentPage, itemsPerPage]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Status Summary Stats
  const stats = useMemo(() => {
    return {
      total: MOCK_PULL_REQUESTS.length,
      pending: MOCK_PULL_REQUESTS.filter((p) => p.status === 'Pending AI Review').length,
      passed: MOCK_PULL_REQUESTS.filter((p) => p.status === 'Passed Security Scan' || p.status === 'Approved').length,
      changes: MOCK_PULL_REQUESTS.filter((p) => p.status === 'Changes Requested').length,
    };
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">Pull Requests</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Pull Requests
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  {filteredPullRequests.length} Active
                </span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Automated AI security scanning & code change auditing across connected repositories
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] text-gray-200 text-xs font-medium transition-all hover:border-white/20 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : 'text-gray-400'}`} />
            <span>Sync PRs</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/80">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Total Tracked PRs</span>
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.total}</div>
        </div>

        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/80">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Pending AI Audit</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">{stats.pending}</div>
        </div>

        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/80">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Passed & Approved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{stats.passed}</div>
        </div>

        <div className="glass-card-linear rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/80">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Changes Requested</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">{stats.changes}</div>
        </div>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="glass-card rounded-2xl border border-white/10 p-4 bg-[#0a0f1d]/80 shadow-xl space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by PR title, #number, author, or repo..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-[#0e1424] text-gray-200">All Statuses</option>
              <option value="Pending AI Review" className="bg-[#0e1424] text-amber-400">Pending AI Review</option>
              <option value="Passed Security Scan" className="bg-[#0e1424] text-emerald-400">Passed Security Scan</option>
              <option value="Approved" className="bg-[#0e1424] text-cyan-400">Approved</option>
              <option value="Changes Requested" className="bg-[#0e1424] text-rose-400">Changes Requested</option>
              <option value="Merged" className="bg-[#0e1424] text-purple-400">Merged</option>
            </select>
          </div>

          {/* Repository Filter */}
          <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
            <FolderGit2 className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedRepo}
              onChange={(e) => {
                setSelectedRepo(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-2 max-w-[180px] truncate"
            >
              <option value="all" className="bg-[#0e1424] text-gray-200">All Repositories</option>
              {repositoryOptions.filter((r) => r !== 'all').map((repo) => (
                <option key={repo} value={repo} className="bg-[#0e1424] text-gray-200">
                  {repo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pull Request Cards List */}
      {paginatedPRs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {paginatedPRs.map((pr) => {
            const statusConfig = getStatusBadge(pr.status);

            return (
              <div
                key={pr.id}
                className="group glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/[0.05] transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle Glow Backdrop */}
                <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                  {/* Left Column: Title, Repo, Branches */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${statusConfig.className}`}
                      >
                        {statusConfig.icon}
                        <span>{statusConfig.label}</span>
                      </span>

                      {/* Repository Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-gray-300 text-xs font-mono">
                        <FolderGit2 className="w-3 h-3 text-emerald-400" />
                        <span>{pr.repository}</span>
                      </span>

                      {/* PR Number */}
                      <span className="text-xs font-mono font-bold text-gray-400">
                        #{pr.number}
                      </span>
                    </div>

                    {/* PR Title */}
                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {pr.title}
                    </h3>

                    {/* Branch Info & Author Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <img
                          src={pr.author.avatar}
                          alt={pr.author.name}
                          className="w-4 h-4 rounded-full border border-white/20 object-cover"
                        />
                        <span className="text-gray-300 font-medium">{pr.author.name}</span>
                        <span className="text-gray-500 font-mono">@{pr.author.username}</span>
                      </div>

                      <span className="text-gray-600">•</span>

                      {/* Branches */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] text-gray-300 border border-white/10">
                          {pr.sourceBranch}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-500" />
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] text-emerald-400/90 border border-white/10">
                          {pr.targetBranch}
                        </span>
                      </div>

                      <span className="text-gray-600">•</span>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span>{formatDate(pr.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Code Stats & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t border-white/5 lg:border-t-0">
                    {/* Additions / Deletions / Files count */}
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg">
                        <span>+{pr.additions}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-lg">
                        <span>-{pr.deletions}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 bg-white/[0.04] border border-white/10 px-2 py-1 rounded-lg">
                        <FileCode2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{pr.changedFilesCount} files</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <Link
                      to={`/pull-requests/${pr.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-lg shadow-emerald-500/5 group-hover:border-emerald-500/50"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card-linear rounded-2xl border border-white/10 p-12 text-center bg-[#0a0f1d]/80 my-6">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Pull Requests Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            No pull requests matched your active filters or search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedRepo('all');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-white text-xs font-medium transition-all"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-400">
          <div>
            Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-white font-medium">
              {Math.min(currentPage * itemsPerPage, filteredPullRequests.length)}
            </span>{' '}
            of <span className="text-white font-medium">{filteredPullRequests.length}</span> Pull Requests
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.1] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono text-xs">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.1] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PullRequestsPage;
