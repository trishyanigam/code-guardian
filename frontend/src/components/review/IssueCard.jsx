import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  FileCode2,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

/**
 * Helper to resolve severity badge styling and icon
 */
const getSeverityConfig = (severity = '') => {
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

/**
 * IssueCard Component
 * Reusable dark SaaS card displaying detected code vulnerabilities & issues with severity badges.
 *
 * @param {Object} props
 * @param {Object} props.issue - Issue metadata object
 * @param {string} [props.issue.severity] - 'critical' | 'high' | 'medium' | 'low' | 'info'
 * @param {string} [props.issue.title]
 * @param {string} [props.issue.description]
 * @param {string} [props.issue.filename]
 * @param {number} [props.issue.line]
 * @param {string} [props.issue.category]
 * @param {string} [props.issue.suggestion]
 * @param {string} [props.issue.codeSnippet]
 * @param {string} [props.className]
 */
export const IssueCard = ({ issue = {}, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const severityConfig = getSeverityConfig(issue.severity || 'medium');
  const codeSnippet = issue.codeSnippet || issue.patch || null;

  const handleCopyCode = () => {
    if (!codeSnippet) return;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 hover:border-white/20 transition-all space-y-3 shadow-lg ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Severity Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${severityConfig.className}`}>
            {severityConfig.icon}
            <span>{severityConfig.label}</span>
          </span>

          {/* Issue Category Tag */}
          {issue.category && (
            <span className="text-xs font-mono text-gray-400 bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/10">
              {issue.category}
            </span>
          )}
        </div>

        {/* File & Line Badge */}
        {issue.filename && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/5">
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-300">{issue.filename}</span>
            {issue.line && (
              <span className="text-emerald-400 font-bold">: L{issue.line}</span>
            )}
          </div>
        )}
      </div>

      {/* Issue Title & Description */}
      <div>
        <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
          {issue.title || 'Code Issue Detected'}
        </h4>
        {issue.description && (
          <p className="text-xs text-gray-300 leading-relaxed">
            {issue.description}
          </p>
        )}
      </div>

      {/* Optional Syntax Highlighted Code Snippet */}
      {codeSnippet && (
        <div className="relative group/code bg-[#060913] rounded-xl border border-white/10 p-3.5 overflow-x-auto">
          <button
            onClick={handleCopyCode}
            className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-gray-300 text-[10px] font-mono transition-all flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-gray-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <pre className="font-mono text-xs text-rose-300/90 leading-relaxed pr-12">
            {codeSnippet}
          </pre>
        </div>
      )}

      {/* Recommended Fix Box */}
      {issue.suggestion && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 text-xs space-y-1">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Recommended Fix</span>
          </span>
          <p className="text-gray-300 leading-relaxed">
            {issue.suggestion}
          </p>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
