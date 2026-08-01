import React from 'react';
import { FiGitBranch, FiLock, FiGlobe, FiCheck, FiPlus, FiCode } from 'react-icons/fi';

/**
 * Language indicator color mapper
 */
const getLanguageColor = (lang) => {
  const language = (lang || '').toLowerCase();
  switch (language) {
    case 'javascript':
      return 'bg-amber-400';
    case 'typescript':
      return 'bg-blue-400';
    case 'python':
      return 'bg-emerald-400';
    case 'go':
      return 'bg-cyan-400';
    case 'rust':
      return 'bg-orange-500';
    case 'html':
      return 'bg-rose-500';
    case 'css':
      return 'bg-indigo-400';
    case 'java':
      return 'bg-red-400';
    default:
      return 'bg-slate-400';
  }
};

/**
 * RepositoryCard Component
 * Displays repository metadata (name, visibility, language, branch) with a connect action button.
 */
export const RepositoryCard = ({
  repo,
  onConnect,
  isConnecting = false,
  isConnected = false,
}) => {
  const {
    owner,
    repoName,
    visibility = 'public',
    language = 'JavaScript',
    defaultBranch = 'main',
    description,
  } = repo;

  const isPrivate = visibility.toLowerCase() === 'private';

  return (
    <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/80 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden">
      {/* Top Border Accent Line Effect on Hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div>
        {/* Header: Owner & Repository Name */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-mono text-gray-400 block truncate">
              {owner}/
            </span>
            <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-emerald-400 transition-colors">
              {repoName}
            </h3>
          </div>

          {/* Visibility Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${
              isPrivate
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}
          >
            {isPrivate ? (
              <FiLock className="w-3 h-3" />
            ) : (
              <FiGlobe className="w-3 h-3" />
            )}
            <span className="capitalize">{visibility}</span>
          </span>
        </div>

        {/* Optional Description */}
        {description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Meta Attributes: Language & Default Branch */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-300">
          {/* Language Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5">
            <span
              className={`w-2 h-2 rounded-full ${getLanguageColor(language)}`}
            ></span>
            <span className="font-medium">{language || 'JavaScript'}</span>
          </div>

          {/* Default Branch Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-gray-300 font-mono">
            <FiGitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>{defaultBranch}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {isConnected ? 'Status: Active' : 'Ready to scan'}
        </span>

        {/* Connect Action Button */}
        {isConnected ? (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold select-none cursor-default"
          >
            <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Connected</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onConnect && onConnect(repo)}
            disabled={isConnecting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 transition-all duration-200 cursor-pointer"
          >
            {isConnecting ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <FiPlus className="w-3.5 h-3.5" />
                <span>Connect</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default RepositoryCard;
