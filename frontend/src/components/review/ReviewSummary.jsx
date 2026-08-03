import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  BookOpen,
  Wrench,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

/**
 * Helper to determine score status label and color classes
 */
const getScoreStatus = (score = 0) => {
  if (score >= 90) {
    return { label: 'Excellent', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
  }
  if (score >= 75) {
    return { label: 'Good', text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
  }
  if (score >= 60) {
    return { label: 'Needs Attention', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
  }
  return { label: 'Critical', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
};

/**
 * ReviewSummary Component
 * Reusable dark SaaS review summary widget displaying scores and executive summary.
 *
 * @param {Object} props
 * @param {Object} props.review - Review object containing scores and summary
 * @param {number} [props.review.overallScore]
 * @param {number} [props.review.securityScore]
 * @param {number} [props.review.performanceScore]
 * @param {number} [props.review.readabilityScore]
 * @param {number} [props.review.maintainabilityScore]
 * @param {string} [props.review.summary]
 * @param {string} [props.className]
 */
export const ReviewSummary = ({ review = {}, className = '' }) => {
  // Extract scores with safe fallbacks
  const scores = review.scores || {};
  const overall = Number(review.overallScore ?? scores.overallScore ?? 0);
  const security = Number(review.securityScore ?? scores.securityScore ?? overall);
  const performance = Number(review.performanceScore ?? scores.performanceScore ?? overall);
  const readability = Number(review.readabilityScore ?? scores.readabilityScore ?? overall);
  const maintainability = Number(review.maintainabilityScore ?? scores.maintainabilityScore ?? overall);
  const summaryText = review.summary || 'AI code review analysis completed successfully.';

  const overallStatus = getScoreStatus(overall);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Benchmark Scores Grid */}
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
              {overall}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className={`px-2 py-0.5 rounded-full border ${overallStatus.bg} ${overallStatus.text} ${overallStatus.border}`}>
                {overallStatus.label}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(overall, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Security Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Security</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-emerald-400 tracking-tight">
              {security}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(security, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Performance Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Performance</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-cyan-400 tracking-tight">
              {performance}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(performance, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Readability Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Readability</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-purple-400 tracking-tight">
              {readability}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(readability, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Maintainability Score */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 flex flex-col justify-between hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="text-gray-300 font-medium">Maintainability</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-amber-400 tracking-tight">
              {maintainability}
            </span>
            <span className="text-xs font-mono text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(maintainability, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="glass-card-linear rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Executive Summary</span>
          </h3>
          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Verified</span>
          </span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          {summaryText}
        </p>
      </div>
    </div>
  );
};

export default ReviewSummary;
