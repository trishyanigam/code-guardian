import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  GitPullRequest,
  GitBranch,
  FolderGit2,
  User,
  Clock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCode2,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Activity,
  CheckCircle2,
  RefreshCw,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

const MOCK_PR_DETAILS = {
  id: 'pr-42',
  githubPrId: '1001',
  number: 42,
  title: 'fix(auth): update JWT verification algorithm and token expiration check',
  description:
    'Refactors JWT signature verification to enforce RS256 algorithm explicitly, prevents algorithm downgrade attacks, and updates token expiration handling in middleware.',
  repository: {
    fullName: 'trishyanigam/code-guardian',
    owner: 'trishyanigam',
    repoName: 'code-guardian',
    visibility: 'public',
    defaultBranch: 'main',
  },
  author: {
    name: 'Trishy Nigam',
    username: 'trishyanigam',
    avatar: 'https://github.com/github.png',
    role: 'Repository Owner',
  },
  sourceBranch: 'fix/jwt-auth',
  targetBranch: 'main',
  headSha: '3c4d5e6f7a',
  baseSha: '7f9a2b1c0d',
  state: 'open',
  status: 'Pending AI Review',
  createdAt: '2026-08-03T08:15:00Z',
  updatedAt: '2026-08-03T08:15:05Z',
  stats: {
    additions: 124,
    deletions: 45,
    changedFilesCount: 4,
  },
  timeline: [
    {
      id: 't-1',
      title: 'GitHub Webhook Received',
      description: 'Webhook signature payload verified via HMAC-SHA256 (x-hub-signature-256).',
      timestamp: '08:15:02 AM',
      status: 'completed',
    },
    {
      id: 't-2',
      title: 'Pull Request & Files Stored',
      description: 'Indexed PR metadata and 4 changed files into MongoDB repository records.',
      timestamp: '08:15:03 AM',
      status: 'completed',
    },
    {
      id: 't-3',
      title: 'AI Review Task Queued',
      description: 'Dispatched async background task for OpenAI AST static analysis.',
      timestamp: '08:15:05 AM',
      status: 'completed',
    },
    {
      id: 't-4',
      title: 'Pending AI Security Audit',
      description: 'Scanning code diffs for OWASP Top 10 vulnerabilities & secret leaks...',
      timestamp: 'In Progress',
      status: 'active',
    },
  ],
  changedFiles: [
    {
      id: 'f-1',
      filename: 'backend/src/utils/githubSignature.js',
      status: 'added',
      additions: 52,
      deletions: 0,
      changes: 52,
      patch: `@@ -0,0 +1,52 @@
+import crypto from 'crypto';
+import config from '../config/env.config.js';
+
+export const verifyGithubSignature = (arg1, arg2, arg3) => {
+  try {
+    let secret = arg3 || process.env.GITHUB_WEBHOOK_SECRET;
+    if (!secret) return false;
+
+    const hmac = crypto.createHmac('sha256', secret);
+    hmac.update(payloadData);
+    const actualHash = hmac.digest('hex');
+    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
+  } catch (error) {
+    return false;
+  }
+};`,
    },
    {
      id: 'f-2',
      filename: 'backend/src/models/pullRequest.model.js',
      status: 'added',
      additions: 45,
      deletions: 0,
      changes: 45,
      patch: `@@ -0,0 +1,45 @@
+import mongoose from 'mongoose';

+const pullRequestSchema = new mongoose.Schema(
+  {
+    githubPrId: { type: String, required: true },
+    repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
+    title: { type: String, required: true },
+    number: { type: Number, required: true },
+    status: { type: String, default: 'Pending AI Review' },
+  },
+  { timestamps: true }
+);

+export const PullRequest = mongoose.model('PullRequest', pullRequestSchema);
+export default PullRequest;`,
    },
    {
      id: 'f-3',
      filename: 'backend/src/middleware/auth.middleware.js',
      status: 'modified',
      additions: 15,
      deletions: 30,
      changes: 45,
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
      id: 'f-4',
      filename: 'backend/src/services/pullRequest.service.js',
      status: 'added',
      additions: 12,
      deletions: 15,
      changes: 27,
      patch: `@@ -1,15 +1,12 @@
 import { Octokit } from '@octokit/rest';
 import { PullRequest } from '../models/pullRequest.model.js';

 export const fetchChangedFiles = async ({ owner, repo, pullNumber, accessToken }) => {
   const octokit = new Octokit({ auth: accessToken });
   const { data } = await octokit.rest.pulls.listFiles({ owner, repo, pull_number: pullNumber });
   return data;
 };`,
    },
  ],
};

export const PullRequestDetailsPage = () => {
  const { id } = useParams();
  const pr = MOCK_PR_DETAILS;
  const [selectedFileId, setSelectedFileId] = useState(pr.changedFiles[0].id);
  const [expandedFiles, setExpandedFiles] = useState({
    [pr.changedFiles[0].id]: true,
    [pr.changedFiles[1].id]: true,
    [pr.changedFiles[2].id]: true,
    [pr.changedFiles[3].id]: true,
  });

  const toggleFileExpand = (fileId) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  const selectedFile = pr.changedFiles.find((f) => f.id === selectedFileId) || pr.changedFiles[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link to="/pull-requests" className="hover:text-emerald-400 transition-colors">
          Pull Requests
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium font-mono">#{pr.number}</span>
      </nav>

      {/* Header Section */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Badge: Pending AI Review */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10 animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{pr.status}</span>
              </span>

              {/* State Badge */}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {pr.state.toUpperCase()}
              </span>

              {/* PR Number */}
              <span className="text-xs font-mono font-bold text-gray-400">
                #{pr.number}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {pr.title}
            </h1>

            {/* Description */}
            <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">
              {pr.description}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/${pr.repository.fullName}/pull/${pr.number}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-gray-200 text-xs font-medium transition-all"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Sub-header Meta Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-200 font-mono font-medium">{pr.repository.fullName}</span>
            </div>

            <span className="text-gray-600">•</span>

            <div className="flex items-center gap-1.5 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-gray-400" />
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-gray-300 border border-white/10">
                {pr.sourceBranch}
              </span>
              <ArrowRight className="w-3 h-3 text-gray-500" />
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-emerald-400 border border-white/10">
                {pr.targetBranch}
              </span>
            </div>
          </div>

          {/* Lines changed stats */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-emerald-400 font-medium">+{pr.stats.additions}</span>
            <span className="text-rose-400 font-medium">-{pr.stats.deletions}</span>
            <span className="text-gray-400">({pr.stats.changedFilesCount} files changed)</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: 8 cols (Left: Changed Files) / 4 cols (Right: Metadata & Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Changed Files (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Changed Files</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/[0.06] text-gray-300 border border-white/10">
                {pr.changedFiles.length}
              </span>
            </h2>
            <div className="text-xs font-mono text-gray-400">
              <span className="text-emerald-400">+{pr.stats.additions}</span> /{' '}
              <span className="text-rose-400">-{pr.stats.deletions}</span>
            </div>
          </div>

          {/* Files List & Diffs */}
          <div className="space-y-4">
            {pr.changedFiles.map((file) => {
              const isExpanded = expandedFiles[file.id];
              const isSelected = selectedFileId === file.id;

              return (
                <div
                  key={file.id}
                  className={`glass-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? 'border-emerald-500/40 bg-[#0a0f1d]/90 shadow-lg shadow-emerald-500/[0.03]'
                      : 'border-white/10 bg-[#0a0f1d]/70 hover:border-white/20'
                  }`}
                >
                  {/* File Header Bar */}
                  <div
                    onClick={() => {
                      setSelectedFileId(file.id);
                      toggleFileExpand(file.id);
                    }}
                    className="flex items-center justify-between p-4 cursor-pointer select-none bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <FileCode2 className="w-4 h-4 text-emerald-400 shrink-0" />

                      <span className="text-xs font-mono font-medium text-white truncate">
                        {file.filename}
                      </span>

                      {/* File Status Tag */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                          file.status === 'added'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {file.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                      <span className="text-emerald-400">+{file.additions}</span>
                      <span className="text-rose-400">-{file.deletions}</span>
                    </div>
                  </div>

                  {/* File Code Diff Box */}
                  {isExpanded && (
                    <div className="border-t border-white/10 bg-[#060913] p-4 overflow-x-auto">
                      <pre className="font-mono text-xs leading-relaxed">
                        {file.patch.split('\n').map((line, idx) => {
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
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Metadata, Repository, Author, Status & Timeline (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: AI Review Status Card */}
          <div className="glass-card-linear rounded-2xl border border-amber-500/30 p-5 bg-[#0a0f1d]/90 shadow-xl shadow-amber-500/[0.05] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>AI Security Review Engine</span>
              </span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                Active Queue
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Pending AI Review
            </h3>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              Code diffs are being analyzed by Code Guardian AI. Vulnerability scanning & security suggestions will appear upon completion.
            </p>

            {/* Progress bar simulation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-gray-400">
                <span>Auditing AST diffs</span>
                <span className="text-amber-400">Processing...</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Card 2: Repository & PR Metadata */}
          <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span>Metadata & Repository</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Repository</span>
                <span className="text-white font-mono font-medium">{pr.repository.fullName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Visibility</span>
                <span className="capitalize text-gray-300">{pr.repository.visibility}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">PR Number</span>
                <span className="font-mono text-emerald-400 font-bold">#{pr.number}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Created Date</span>
                <span className="text-gray-300">Aug 3, 2026, 08:15 AM</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Head SHA</span>
                <span className="font-mono text-gray-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10">
                  {pr.headSha}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Author Info */}
          <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Author</span>
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={pr.author.avatar}
                alt={pr.author.name}
                className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-white">{pr.author.name}</div>
                <div className="text-xs text-gray-400 font-mono">@{pr.author.username}</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">{pr.author.role}</div>
              </div>
            </div>
          </div>

          {/* Card 4: Webhook & Processing Timeline */}
          <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Audit Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {pr.timeline.map((item) => (
                <div key={item.id} className="relative">
                  {/* Circle Indicator */}
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-amber-500/20 border-amber-500 text-amber-400 animate-ping'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{item.title}</span>
                      <span className="text-[10px] font-mono text-gray-400">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PullRequestDetailsPage;
