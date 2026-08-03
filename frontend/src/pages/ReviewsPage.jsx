import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  BookOpen,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileCode2,
  ChevronRight,
  GitPullRequest,
  FolderGit2,
  Calendar,
  User,
  ArrowRight,
  Filter,
  Check,
  Copy,
  Code2,
  Terminal,
  Clock,
  Layers,
  ShieldAlert,
} from 'lucide-react';

const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    pullRequest: {
      number: 42,
      title: 'fix(auth): update JWT verification algorithm and token expiration check',
      repository: 'trishyanigam/code-guardian',
      author: 'trishyanigam',
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
      'The pull request successfully updates JWT signature verification to enforce RS256 algorithm validation and fixes potential algorithm downgrade vulnerabilities. Overall code structure is clean and well-documented. Minor recommendations include adding token revoke blacklisting checks and rate-limiting auth endpoints.',
    issues: [
      {
        id: 'iss-1',
        filename: 'backend/src/middleware/auth.middleware.js',
        line: 30,
        severity: 'high',
        category: 'Security / Authentication',
        title: 'JWT Secret Fallback Hardcoded String in Non-Production Mode',
        description:
          'A default fallback secret string is used when process.env.JWT_SECRET is undefined. While convenient for local development, this poses a risk if production environment variables fail to load.',
        suggestion:
          'Enforce mandatory process.env.JWT_SECRET validation on server bootstrap and crash early if missing.',
      },
      {
        id: 'iss-2',
        filename: 'backend/src/utils/githubSignature.js',
        line: 85,
        severity: 'medium',
        category: 'Security / Constant-Time Comparison',
        title: 'Potential Buffer Length Mismatch Exception in timingSafeEqual',
        description:
          'crypto.timingSafeEqual requires both Buffer inputs to have equal byte lengths, otherwise it throws a TypeError exception instead of returning false.',
        suggestion:
          'Verify expectedBuffer.length === actualBuffer.length before invoking timingSafeEqual.',
      },
      {
        id: 'iss-3',
        filename: 'backend/src/services/pullRequest.service.js',
        line: 125,
        severity: 'low',
        category: 'Performance / Database',
        title: 'Sequential DB Operations in Loop Could Be Batched',
        description:
          'Deleting and re-inserting changed files sequentially can be optimized into a single bulkWrite or transactional upsert.',
        suggestion:
          'Use ChangedFile.bulkWrite or insertMany with ordered: false for improved write throughput.',
      },
    ],
    suggestions: [
      {
        id: 'sug-1',
        filename: 'backend/src/middleware/auth.middleware.js',
        title: 'Explicitly specify algorithms array in jwt.verify call',
        suggestion: 'Pass algorithms: ["RS256", "HS256"] explicitly to prevent algorithm confusion attacks.',
        patch: `// Recommended Fix:
const decoded = jwt.verify(token, JWT_SECRET, {
  algorithms: ['HS256', 'RS256'],
  issuer: 'code-guardian-auth'
});`,
      },
      {
        id: 'sug-2',
        filename: 'backend/src/utils/githubSignature.js',
        title: 'Add early exit guard for empty webhook secret',
        suggestion: 'Return false immediately if secret is not present or signature header is malformed.',
        patch: `// Recommended Guard:
if (!secret || !signature || typeof signature !== 'string') {
  return false;
}`,
      },
    ],
  },
  {
    id: 'rev-2',
    pullRequest: {
      number: 38,
      title: 'feat(api): add webhooks signature verification middleware using crypto HMAC',
      repository: 'trishyanigam/code-guardian',
      author: 'sarahchen',
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
      'Outstanding implementation of HMAC-SHA256 signature verification for GitHub webhooks. Follows constant-time security recommendations and handles multiple argument formats seamlessly.',
    issues: [
      {
        id: 'iss-4',
        filename: 'backend/src/controllers/webhook.controller.js',
        line: 45,
        severity: 'info',
        category: 'Code Quality',
        title: 'Consider adding optional IP range check for GitHub Webhook IPs',
        description: 'Validating payload IP origin against GitHub hook IP subnet ranges provides an extra defense-in-depth layer.',
        suggestion: 'Optional: Use github-webhook-ip validator middleware.',
      },
    ],
    suggestions: [
      {
        id: 'sug-3',
        filename: 'backend/src/controllers/webhook.controller.js',
        title: 'Log audit trail for ignored non-PR webhook events',
        suggestion: 'Add debug logging when non-PR event headers are received.',
        patch: `logger.debug(\`Webhook event '\${event}' received and skipped.\`);`,
      },
    ],
  },
];

const getSeverityBadge = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return {
        label: 'Critical',
        className: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10',
        icon: <ShieldAlert className="w-3.5 h-3.5" />,
      };
    case 'high':
      return {
        label: 'High',
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    case 'medium':
      return {
        label: 'Medium',
        className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-yellow-500/10',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    case 'low':
      return {
        label: 'Low',
        className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10',
        icon: <Info className="w-3.5 h-3.5" />,
      };
    default:
      return {
        label: 'Info',
        className: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        icon: <Info className="w-3.5 h-3.5" />,
      };
  }
};

const getScoreColor = (score) => {
  if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  if (score >= 75) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
  if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
};

export const ReviewsPage = () => {
  const [selectedReviewId, setSelectedReviewId] = useState(MOCK_REVIEWS[0].id);
  const [issueFilter, setIssueFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const activeReview = useMemo(() => {
    return MOCK_REVIEWS.find((r) => r.id === selectedReviewId) || MOCK_REVIEWS[0];
  }, [selectedReviewId]);

  const filteredIssues = useMemo(() => {
    if (issueFilter === 'all') return activeReview.issues;
    return activeReview.issues.filter((i) => i.severity.toLowerCase() === issueFilter.toLowerCase());
  }, [activeReview, issueFilter]);

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">AI Reviews & Audits</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              AI Code Reviews
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                LLM Security Audits
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Automated AI security scanning, score breakdown, issue detection, and refactoring suggestions
            </p>
          </div>
        </div>

        {/* PR Review Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2 text-xs">
          <GitPullRequest className="w-4 h-4 text-emerald-400" />
          <select
            value={selectedReviewId}
            onChange={(e) => setSelectedReviewId(e.target.value)}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-2 max-w-[260px] truncate"
          >
            {MOCK_REVIEWS.map((rev) => (
              <option key={rev.id} value={rev.id} className="bg-[#0e1424] text-gray-200">
                PR #{rev.pullRequest.number}: {rev.pullRequest.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active PR Header Info */}
      <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-gray-300">{activeReview.pullRequest.repository}</span>
              <span className="text-gray-600">•</span>
              <span className="text-emerald-400 font-bold">PR #{activeReview.pullRequest.number}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              {activeReview.pullRequest.title}
            </h2>
          </div>

          <Link
            to={`/pull-requests/pr-${activeReview.pullRequest.number}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-gray-200 text-xs font-medium transition-all shrink-0 self-start md:self-auto"
          >
            <span>View PR Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Benchmark Score Grid: Overall Score + Category Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Overall Score Box */}
        <div className="glass-card-linear rounded-2xl border border-emerald-500/30 p-5 bg-[#0a0f1d]/90 flex flex-col justify-between shadow-xl shadow-emerald-500/[0.05] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="font-semibold text-gray-300">Overall Score</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {activeReview.scores.overallScore}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
              style={{ width: `${activeReview.scores.overallScore}%` }}
            />
          </div>
        </div>

        {/* Security Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Security</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-emerald-400 tracking-tight">
              {activeReview.scores.securityScore}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${activeReview.scores.securityScore}%` }}
            />
          </div>
        </div>

        {/* Performance Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Performance</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-cyan-400 tracking-tight">
              {activeReview.scores.performanceScore}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${activeReview.scores.performanceScore}%` }}
            />
          </div>
        </div>

        {/* Readability Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Readability</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-purple-400 tracking-tight">
              {activeReview.scores.readabilityScore}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-purple-400 rounded-full"
              style={{ width: `${activeReview.scores.readabilityScore}%` }}
            />
          </div>
        </div>

        {/* Maintainability Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Maintainability</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-amber-400 tracking-tight">
              {activeReview.scores.maintainabilityScore}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${activeReview.scores.maintainabilityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="glass-card-linear rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Executive Summary</span>
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          {activeReview.summary}
        </p>
      </div>

      {/* Detected Issues Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Detected Security & Code Issues</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {filteredIssues.length} Found
            </span>
          </h3>

          {/* Severity Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs">
            {['all', 'high', 'medium', 'low', 'info'].map((sev) => (
              <button
                key={sev}
                onClick={() => setIssueFilter(sev)}
                className={`px-3 py-1 rounded-lg capitalize transition-all font-medium ${
                  issueFilter === sev
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        {filteredIssues.length > 0 ? (
          <div className="space-y-4">
            {filteredIssues.map((issue) => {
              const sevBadge = getSeverityBadge(issue.severity);

              return (
                <div
                  key={issue.id}
                  className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${sevBadge.className}`}>
                        {sevBadge.icon}
                        <span>{sevBadge.label}</span>
                      </span>

                      <span className="text-xs font-mono text-gray-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                        {issue.category}
                      </span>
                    </div>

                    {/* Filename & Line Number */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                      <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-gray-300">{issue.filename}</span>
                      <span className="text-emerald-400 font-bold">: L{issue.line}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {issue.title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {/* Recommended Fix Box */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-xs space-y-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recommended Fix</span>
                    </span>
                    <p className="text-gray-300 leading-relaxed">
                      {issue.suggestion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-white/10 p-8 text-center bg-[#0a0f1d]/80 text-gray-400 text-xs">
            No issues found matching severity filter "{issueFilter}".
          </div>
        )}
      </div>

      {/* AI Code Refactoring Suggestions Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Refactoring & Code Suggestions</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {activeReview.suggestions.length} Suggestions
          </span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {activeReview.suggestions.map((sug) => (
            <div
              key={sug.id}
              className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{sug.filename}</span>
                </div>

                <button
                  onClick={() => handleCopyCode(sug.id, sug.patch)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 text-xs font-mono transition-all"
                >
                  {copiedId === sug.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy Patch</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-1">{sug.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{sug.suggestion}</p>
              </div>

              {/* Code Patch Box */}
              {sug.patch && (
                <div className="bg-[#060913] rounded-xl border border-white/10 p-4 overflow-x-auto">
                  <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
                    {sug.patch}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
