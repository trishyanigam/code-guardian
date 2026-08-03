import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Zap,
  BookOpen,
  Wrench,
  ChevronRight,
  FolderGit2,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  RefreshCw,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
} from 'lucide-react';

const MOCK_REVIEW_HISTORY = [
  {
    id: 'rev-1',
    pullRequest: {
      id: 'pr-42',
      number: 42,
      title: 'fix(auth): update JWT verification algorithm and token expiration check',
      repository: 'trishyanigam/code-guardian',
      author: {
        name: 'Trishy Nigam',
        username: 'trishyanigam',
        avatar: 'https://github.com/github.png',
      },
      branch: 'fix/jwt-auth -> main',
      date: '2026-08-03T08:15:00Z',
    },
    scores: {
      overallScore: 88,
      securityScore: 92,
      performanceScore: 85,
      readabilityScore: 88,
      maintainabilityScore: 84,
    },
    summary:
      'JWT verification algorithm updated to enforce RS256 validation. Solved algorithm downgrade security flaws. Overall security is strong.',
    issuesCount: 3,
    suggestionsCount: 2,
    status: 'Approved',
  },
  {
    id: 'rev-2',
    pullRequest: {
      id: 'pr-38',
      number: 38,
      title: 'feat(api): add webhooks signature verification middleware using crypto HMAC',
      repository: 'trishyanigam/code-guardian',
      author: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      },
      branch: 'feat/webhook-sig -> main',
      date: '2026-08-03T07:30:00Z',
    },
    scores: {
      overallScore: 95,
      securityScore: 98,
      performanceScore: 94,
      readabilityScore: 96,
      maintainabilityScore: 92,
    },
    summary:
      'Flawless HMAC-SHA256 signature verification implementation for incoming GitHub webhooks. Followed timingSafeEqual constant time comparison.',
    issuesCount: 1,
    suggestionsCount: 1,
    status: 'Passed Security Scan',
  },
  {
    id: 'rev-3',
    pullRequest: {
      id: 'pr-19',
      number: 19,
      title: 'refactor(db): optimize MongoDB aggregation queries for repository metrics',
      repository: 'trishyanigam/auth-service-microservice',
      author: {
        name: 'Alex Rivera',
        username: 'arivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      },
      branch: 'refactor/mongo-perf -> main',
      date: '2026-08-02T19:45:00Z',
    },
    scores: {
      overallScore: 78,
      securityScore: 82,
      performanceScore: 92,
      readabilityScore: 74,
      maintainabilityScore: 70,
    },
    summary:
      'Database query execution times reduced by 65%. Suggested minor query indexing and schema validation updates for maintainability.',
    issuesCount: 4,
    suggestionsCount: 3,
    status: 'Approved',
  },
  {
    id: 'rev-4',
    pullRequest: {
      id: 'pr-55',
      number: 55,
      title: 'sec(deps): patch vulnerable SQL injection vector in query builder helper',
      repository: 'trishyanigam/cloud-infrastructure',
      author: {
        name: 'Marcus Vance',
        username: 'marcusv',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      },
      branch: 'security/sqli-patch -> main',
      date: '2026-08-02T14:10:00Z',
    },
    scores: {
      overallScore: 62,
      securityScore: 58,
      performanceScore: 75,
      readabilityScore: 65,
      maintainabilityScore: 60,
    },
    summary:
      'Critical SQL injection flaw detected in parameterized query builder logic. Requested immediate fix before merging to production.',
    issuesCount: 6,
    suggestionsCount: 4,
    status: 'Changes Requested',
  },
  {
    id: 'rev-5',
    pullRequest: {
      id: 'pr-12',
      number: 12,
      title: 'feat(ui): implement dark theme glassmorphic dashboard analytics cards',
      repository: 'trishyanigam/react-design-system',
      author: {
        name: 'Elena Rostova',
        username: 'elena-r',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      branch: 'feat/glassmorphism -> main',
      date: '2026-08-01T11:20:00Z',
    },
    scores: {
      overallScore: 91,
      securityScore: 95,
      performanceScore: 88,
      readabilityScore: 94,
      maintainabilityScore: 90,
    },
    summary:
      'High-quality UI design components added with responsive Tailwind styling and accessible dark theme tokens.',
    issuesCount: 0,
    suggestionsCount: 2,
    status: 'Passed Security Scan',
  },
];

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const ReviewHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOverallFilter, setSelectedOverallFilter] = useState('all');
  const [selectedSecurityFilter, setSelectedSecurityFilter] = useState('all');
  const [selectedPerformanceFilter, setSelectedPerformanceFilter] = useState('all');
  const [selectedRepoFilter, setSelectedRepoFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Extract unique repositories
  const repositoryOptions = useMemo(() => {
    const repos = Array.from(new Set(MOCK_REVIEW_HISTORY.map((r) => r.pullRequest.repository)));
    return ['all', ...repos];
  }, []);

  // Filtered Review History items based on Search (repo, author, date, score) & Category Filters
  const filteredReviews = useMemo(() => {
    return MOCK_REVIEW_HISTORY.filter((rev) => {
      const q = searchQuery.toLowerCase().trim();

      // Search matching across Repository, Author, Date, Score, Title, PR number
      const matchesSearch =
        !q ||
        rev.pullRequest.repository.toLowerCase().includes(q) ||
        rev.pullRequest.author.name.toLowerCase().includes(q) ||
        rev.pullRequest.author.username.toLowerCase().includes(q) ||
        rev.pullRequest.title.toLowerCase().includes(q) ||
        formatDate(rev.pullRequest.date).toLowerCase().includes(q) ||
        `#${rev.pullRequest.number}`.includes(q) ||
        String(rev.scores.overallScore).includes(q) ||
        String(rev.scores.securityScore).includes(q);

      // Overall Score Filter
      let matchesOverall = true;
      if (selectedOverallFilter === 'high') matchesOverall = rev.scores.overallScore >= 85;
      else if (selectedOverallFilter === 'medium') matchesOverall = rev.scores.overallScore >= 70 && rev.scores.overallScore < 85;
      else if (selectedOverallFilter === 'low') matchesOverall = rev.scores.overallScore < 70;

      // Security Score Filter
      let matchesSecurity = true;
      if (selectedSecurityFilter === 'excellent') matchesSecurity = rev.scores.securityScore >= 90;
      else if (selectedSecurityFilter === 'good') matchesSecurity = rev.scores.securityScore >= 75 && rev.scores.securityScore < 90;
      else if (selectedSecurityFilter === 'warning') matchesSecurity = rev.scores.securityScore < 75;

      // Performance Score Filter
      let matchesPerformance = true;
      if (selectedPerformanceFilter === 'fast') matchesPerformance = rev.scores.performanceScore >= 90;
      else if (selectedPerformanceFilter === 'moderate') matchesPerformance = rev.scores.performanceScore >= 75 && rev.scores.performanceScore < 90;
      else if (selectedPerformanceFilter === 'slow') matchesPerformance = rev.scores.performanceScore < 75;

      // Repository Filter
      const matchesRepo = selectedRepoFilter === 'all' || rev.pullRequest.repository === selectedRepoFilter;

      return matchesSearch && matchesOverall && matchesSecurity && matchesPerformance && matchesRepo;
    });
  }, [searchQuery, selectedOverallFilter, selectedSecurityFilter, selectedPerformanceFilter, selectedRepoFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">Review History</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Review History & Audits
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {filteredReviews.length} Records
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Historical archive of AI security audits, benchmark score trends, and vulnerability reports
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card rounded-2xl border border-white/10 p-4 bg-[#0a0f1d]/80 shadow-xl space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-4">
        {/* Search Bar (Search by Repo, Author, Date, Score) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by repository, author, date, score (e.g. 92)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Overall Score Filter */}
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedOverallFilter}
              onChange={(e) => {
                setSelectedOverallFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-[#0e1424]">All Overall Scores</option>
              <option value="high" className="bg-[#0e1424] text-emerald-400">High (≥ 85)</option>
              <option value="medium" className="bg-[#0e1424] text-amber-400">Medium (70-84)</option>
              <option value="low" className="bg-[#0e1424] text-rose-400">Low (&lt; 70)</option>
            </select>
          </div>

          {/* Security Filter */}
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedSecurityFilter}
              onChange={(e) => {
                setSelectedSecurityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-[#0e1424]">All Security</option>
              <option value="excellent" className="bg-[#0e1424] text-emerald-400">Excellent (≥ 90)</option>
              <option value="good" className="bg-[#0e1424] text-cyan-400">Good (75-89)</option>
              <option value="warning" className="bg-[#0e1424] text-amber-400">Warning (&lt; 75)</option>
            </select>
          </div>

          {/* Performance Filter */}
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedPerformanceFilter}
              onChange={(e) => {
                setSelectedPerformanceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-[#0e1424]">All Performance</option>
              <option value="fast" className="bg-[#0e1424] text-cyan-400">Fast (≥ 90)</option>
              <option value="moderate" className="bg-[#0e1424] text-yellow-400">Moderate (75-89)</option>
              <option value="slow" className="bg-[#0e1424] text-rose-400">Slow (&lt; 75)</option>
            </select>
          </div>

          {/* Repository Filter */}
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <FolderGit2 className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedRepoFilter}
              onChange={(e) => {
                setSelectedRepoFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1 max-w-[150px] truncate"
            >
              <option value="all" className="bg-[#0e1424]">All Repos</option>
              {repositoryOptions.filter((r) => r !== 'all').map((repo) => (
                <option key={repo} value={repo} className="bg-[#0e1424]">
                  {repo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Review History List */}
      {paginatedReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {paginatedReviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/[0.05] transition-all duration-300 space-y-4"
            >
              {/* Top Row: Title, Repo, Date, Author */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1 text-gray-300">
                      <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                      {rev.pullRequest.repository}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-emerald-400 font-bold">PR #{rev.pullRequest.number}</span>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {formatDate(rev.pullRequest.date)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white hover:text-emerald-300 transition-colors leading-snug">
                    {rev.pullRequest.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <img
                      src={rev.pullRequest.author.avatar}
                      alt={rev.pullRequest.author.name}
                      className="w-5 h-5 rounded-full border border-white/20 object-cover"
                    />
                    <span className="text-gray-300 font-medium">{rev.pullRequest.author.name}</span>
                  </div>

                  <Link
                    to={`/ai-reviews/${rev.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-lg shadow-emerald-500/5"
                  >
                    <span>View Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Middle Row: Benchmark Scores Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-white/5">
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-gray-400 block font-mono">Overall</span>
                  <span className="text-base font-extrabold text-white">{rev.scores.overallScore}/100</span>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-emerald-400/80 block font-mono">Security</span>
                  <span className="text-base font-bold text-emerald-400">{rev.scores.securityScore}/100</span>
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-cyan-400/80 block font-mono">Performance</span>
                  <span className="text-base font-bold text-cyan-400">{rev.scores.performanceScore}/100</span>
                </div>

                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-purple-400/80 block font-mono">Readability</span>
                  <span className="text-base font-bold text-purple-400">{rev.scores.readabilityScore}/100</span>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-amber-400/80 block font-mono">Maintainability</span>
                  <span className="text-base font-bold text-amber-400">{rev.scores.maintainabilityScore}/100</span>
                </div>
              </div>

              {/* Bottom Row: Summary & Issues/Suggestions count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400 pt-2 border-t border-white/5">
                <p className="line-clamp-2 text-gray-300 leading-relaxed max-w-3xl">
                  {rev.summary}
                </p>

                <div className="flex items-center gap-3 font-mono shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {rev.issuesCount} Issues
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {rev.suggestionsCount} Suggestions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card-linear rounded-2xl border border-white/10 p-12 text-center bg-[#0a0f1d]/80 my-6">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Review History Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            No audit records matched your active search or score criteria filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedOverallFilter('all');
              setSelectedSecurityFilter('all');
              setSelectedPerformanceFilter('all');
              setSelectedRepoFilter('all');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-white text-xs font-medium transition-all"
          >
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-400">
          <div>
            Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-white font-medium">
              {Math.min(currentPage * itemsPerPage, filteredReviews.length)}
            </span>{' '}
            of <span className="text-white font-medium">{filteredReviews.length}</span> Review Records
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

export default ReviewHistoryPage;
