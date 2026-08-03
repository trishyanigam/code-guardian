import React, { useState } from 'react';
import {
  FileCode2,
  Code2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

/**
 * SuggestionCard Component
 * Reusable dark SaaS component for displaying AI code refactoring suggestions with syntax-highlighted code patches.
 *
 * @param {Object} props
 * @param {Object} props.suggestion - Suggestion object
 * @param {string} [props.suggestion.filename]
 * @param {string} [props.suggestion.title]
 * @param {string} [props.suggestion.suggestion]
 * @param {string} [props.suggestion.patch]
 * @param {string} [props.suggestion.codeSnippet]
 * @param {string} [props.className]
 */
export const SuggestionCard = ({ suggestion = {}, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const patchCode = suggestion.patch || suggestion.codeSnippet || null;
  const fileName = suggestion.filename || suggestion.file || '';

  const handleCopyPatch = () => {
    if (!patchCode) return;
    navigator.clipboard.writeText(patchCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glass-card rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/90 space-y-3 shadow-lg hover:border-cyan-500/30 transition-all ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate">{fileName || 'Refactoring Suggestion'}</span>
        </div>

        {/* Copy Patch Action Button */}
        {patchCode && (
          <button
            onClick={handleCopyPatch}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 text-xs font-mono transition-all active:scale-95"
          >
            {copied ? (
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
        )}
      </div>

      {/* Suggestion Title & Text */}
      <div>
        {suggestion.title && (
          <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{suggestion.title}</span>
          </h4>
        )}
        {suggestion.suggestion && (
          <p className="text-xs text-gray-300 leading-relaxed">
            {suggestion.suggestion}
          </p>
        )}
      </div>

      {/* Syntax Highlighted Code Patch */}
      {patchCode && (
        <div className="bg-[#060913] rounded-xl border border-white/10 p-4 overflow-x-auto">
          <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
            {patchCode.split('\n').map((line, idx) => {
              let lineStyle = 'text-cyan-300';
              if (line.startsWith('+') && !line.startsWith('+++')) {
                lineStyle = 'text-emerald-300 bg-emerald-500/10 -mx-4 px-4 block';
              } else if (line.startsWith('-') && !line.startsWith('---')) {
                lineStyle = 'text-rose-300 bg-rose-500/10 -mx-4 px-4 block';
              }

              return (
                <span key={idx} className={lineStyle}>
                  {line}
                </span>
              );
            })}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
