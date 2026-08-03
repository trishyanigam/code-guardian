import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  BookOpen,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  Info,
  FileCode2,
  ChevronRight,
  ArrowRight,
  FolderGit2,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  GitPullRequest,
  ChevronDown,
  ChevronUp,
  Code2,
  FileText,
} from 'lucide-react';

const MOCK_REVIEW_DETAILS = {
  id: 'rev-1',
  pullRequest: {
    id: 'pr-42',
    number: 42,
    title: 'fix(auth): update JWT verification algorithm and token expiration check',
    repository: 'trishyanigam/code-guardian',
    author: 'trishyanigam',
    sourceBranch: 'fix/jwt-auth',
    targetBranch: 'main',
    date: 'Aug 03, 2026, 08:15 AM',
  },
  scores: {
    overallScore: 88,
    securityScore: 92,
    performanceScore: 85,
    readabilityScore: 88,
    maintainabilityScore: 84,
  },
  summary:
    'The AI audit confirmed that JWT signature verification has been upgraded to enforce RS256 algorithm validation, successfully closing algorithm downgrade attack vectors. Code readability is high with proper error handling. Minor security hardening is recommended for fallback secret handling in non-production environments.',
  issues: [
    {
      id: 'iss-1',
      filename: 'backend/src/middleware/auth.middleware.js',
      line: 30,
      severity: 'high',
      category: 'Security / Authentication',
      title: 'Hardcoded Fallback Secret in Non-Production Mode',
      description:
        'A default fallback secret string is used when process.env.JWT_SECRET is undefined. If environment variables fail to load in production, this fallback could compromise token integrity.',
      suggestion:
        'Throw an explicit error during server startup if JWT_SECRET is not configured.',
    },
    {
      id: 'iss-2',
      filename: 'backend/src/utils/githubSignature.js',
      line: 85,
      severity: 'medium',
      category: 'Security / HMAC Validation',
      title: 'Buffer Length Mismatch in timingSafeEqual',
      description:
        'crypto.timingSafeEqual requires equal byte lengths for both Buffer arguments to avoid throwing a TypeError.',
      suggestion:
        'Add a pre-check verifying expectedBuffer.length === actualBuffer.length before invoking timingSafeEqual.',
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
  changedFiles: [
    {
      id: 'f-1',
      filename: 'backend/src/middleware/auth.middleware.js',
      status: 'modified',
      additions: 15,
      deletions: 30,
      patch: `@@ -15,20 +15,10 @@ export const authenticate = asyncHandler(async (req, res, next) => {
-   const token = req.headers.authorization;
+   const authHeader = req.headers.authorization;
+   if (!authHeader || !authHeader.startsWith('Bearer ')) {
+     throw new ApiError(401, 'Access denied. Missing bearer token.');
+   }
+   const token = authHeader.split(' ')[1];
-   const decoded = jwt.decode(token); // VULNERABLE: No algorithm verification!
+   const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'RS256'] });
    req.user = await User.findById(decoded.id).select('-password');
    next();
 });`,
    },
    {
      id: 'f-2',
      filename: 'backend/src/utils/githubSignature.js',
      status: 'modified',
      additions: 52,
      deletions: 5,
      patch: `@@ -40,15 +40,52 @@ export const verifyGithubSignature = (arg1, arg2, arg3) => {
+    const hmac = crypto.createHmac('sha256', secret);
+    hmac.update(payloadData);
+    const actualHash = hmac.digest('hex');
+    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
   } catch (error) {
     return false;
   }
 };`,
    },
    {
      id: 'f-3',
      filename: 'backend/src/services/pullRequest.service.js',
      status: 'added',
      additions: 45,
      deletions: 0,
      patch: `@@ -0,0 +1,45 @@
+import { Octokit } from '@octokit/rest';
+import { PullRequest } from '../models/pullRequest.model.js';
+
+export const fetchChangedFiles = async ({ owner, repo, pullNumber, accessToken }) => {
+  const octokit = new Octokit({ auth: accessToken });
+  const { data } = await octokit.rest.pulls.listFiles({ owner, repo, pull_number: pullNumber });
+  return data;
+};`,
    },
  ],
};

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

export const ReviewDetailsPage = () => {
  const { id } = useParams();
  const review = MOCK_REVIEW_DETAILS;
  const [selectedFileId, setSelectedFileId] = useState(review.changedFiles[0].id);
  const [copiedId, setCopiedId] = useState(null);

  const selectedFile = review.changedFiles.find((f) => f.id === selectedFileId) || review.changedFiles[0];

  const handleCopy = (idText, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(idText);
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
        <Link to="/ai-reviews" className="hover:text-emerald-400 transition-colors">
          AI Reviews
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium font-mono">Review #{review.id}</span>
      </nav>

      {/* Header Banner */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Security Review Completed</span>
              </span>

              <span className="text-xs font-mono text-gray-400">
                PR #{review.pullRequest.number}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {review.pullRequest.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/pull-requests/${review.pullRequest.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-gray-200 text-xs font-medium transition-all"
            >
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Pull Request</span>
            </Link>
          </div>
        </div>

        {/* Header Meta Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-200 font-mono">{review.pullRequest.repository}</span>
            <span className="text-gray-600">•</span>
            <span>By @{review.pullRequest.author}</span>
            <span className="text-gray-600">•</span>
            <span>{review.pullRequest.date}</span>
          </div>
        </div>
      </div>

      {/* Modern Split Layout: Left 6 cols (Changed Code) / Right 6 cols (AI Review, Scores, Badges, Suggestions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Changed Code (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Changed Code</span>
            </h2>
            <span className="text-xs font-mono text-gray-400">
              {review.changedFiles.length} Files Modified
            </span>
          </div>

          {/* File Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {review.changedFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 border ${
                  selectedFileId === file.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/[0.04] text-gray-400 border-white/10 hover:text-gray-200'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>{file.filename.split('/').pop()}</span>
                <span className="text-[10px] text-emerald-400">+{file.additions}</span>
              </button>
            ))}
          </div>

          {/* Selected File Diff Viewer */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden bg-[#060913]">
            <div className="p-3.5 bg-[#0e1424] border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 font-medium truncate">
                {selectedFile.filename}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">+{selectedFile.additions}</span>
                <span className="text-rose-400">-{selectedFile.deletions}</span>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-xs leading-relaxed">
                {selectedFile.patch.split('\n').map((line, idx) => {
                  let lineStyle = 'text-gray-400';
                  let bgStyle = '';

                  if (line.startsWith('+') && !line.startsWith('+++')) {
                    lineStyle = 'text-emerald-300';
                    bgStyle = 'bg-emerald-500/10 -mx-4 px-4 block';
                  } else if (line.startsWith('-') && !line.startsWith('---')) {
                    lineStyle = 'text-rose-300';
                    bgStyle = 'bg-rose-500/10 -mx-4 px-4 block';
                  } else if (line.startsWith('@@')) {
                    lineStyle = 'text-cyan-400 font-bold';
                    bgStyle = 'bg-cyan-500/10 -mx-4 px-4 block border-y border-cyan-500/20 my-1 py-0.5';
                  }

                  return (
                    <span key={idx} className={`${lineStyle} ${bgStyle}`}>
                      {line}
                    </span>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Review, Score Cards, Severity Badges, Suggestions (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Section 1: Score Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
              AI Security & Quality Scores
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Overall Score */}
              <div className="glass-card-linear rounded-xl border border-emerald-500/30 p-3.5 bg-[#0a0f1d]/90">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>Overall</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white tracking-tight">
                  {review.scores.overallScore}
                  <span className="text-xs text-gray-400 font-normal">/100</span>
                </div>
              </div>

              {/* Security Score */}
              <div className="glass-card rounded-xl border border-white/10 p-3.5 bg-[#0a0f1d]/80">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>Security</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-emerald-400 tracking-tight">
                  {review.scores.securityScore}
                  <span className="text-xs text-gray-400 font-normal">/100</span>
                </div>
              </div>

              {/* Performance Score */}
              <div className="glass-card rounded-xl border border-white/10 p-3.5 bg-[#0a0f1d]/80">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>Performance</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-cyan-400 tracking-tight">
                  {review.scores.performanceScore}
                  <span className="text-xs text-gray-400 font-normal">/100</span>
                </div>
              </div>

              {/* Readability Score */}
              <div className="glass-card rounded-xl border border-white/10 p-3.5 bg-[#0a0f1d]/80">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>Readability</span>
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-purple-400 tracking-tight">
                  {review.scores.readabilityScore}
                  <span className="text-xs text-gray-400 font-normal">/100</span>
                </div>
              </div>

              {/* Maintainability Score */}
              <div className="glass-card rounded-xl border border-white/10 p-3.5 bg-[#0a0f1d]/80">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>Maintainability</span>
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-amber-400 tracking-tight">
                  {review.scores.maintainabilityScore}
                  <span className="text-xs text-gray-400 font-normal">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Executive Summary */}
          <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 shadow-xl space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Review Summary</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {review.summary}
            </p>
          </div>

          {/* Section 3: Severity Badges & Issues */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Detected Issues</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {review.issues.length}
              </span>
            </h3>

            <div className="space-y-3">
              {review.issues.map((issue) => {
                const badge = getSeverityBadge(issue.severity);

                return (
                  <div
                    key={issue.id}
                    className="glass-card rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/90 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {/* Severity Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>

                      {/* File & Line */}
                      <span className="text-xs font-mono text-gray-400">
                        {issue.filename.split('/').pop()}:<span className="text-emerald-400 font-bold">L{issue.line}</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{issue.title}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{issue.description}</p>

                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2.5 text-xs text-gray-300">
                      <span className="font-semibold text-emerald-400 block mb-0.5">Recommendation:</span>
                      {issue.suggestion}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: AI Code Suggestions & Code Patches */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>AI Refactoring Suggestions</span>
            </h3>

            <div className="space-y-3">
              {review.suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="glass-card rounded-xl border border-white/10 p-4 bg-[#0a0f1d]/90 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-medium">
                      {sug.filename}
                    </span>

                    <button
                      onClick={() => handleCopy(sug.id, sug.patch)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 text-[11px] font-mono transition-all"
                    >
                      {copiedId === sug.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-gray-400" />
                          <span>Copy Patch</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="text-xs font-semibold text-white">{sug.title}</h4>
                  <p className="text-xs text-gray-300">{sug.suggestion}</p>

                  {sug.patch && (
                    <div className="bg-[#060913] rounded-lg border border-white/10 p-3 overflow-x-auto">
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
      </div>
    </div>
  );
};

export default ReviewDetailsPage;
