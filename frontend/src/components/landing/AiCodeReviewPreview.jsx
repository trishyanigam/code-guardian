import React, { useState } from 'react';
import { 
  FiGitPullRequest, 
  FiFileText, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiZap, 
  FiCheck,
  FiCode,
  FiShield
} from 'react-icons/fi';
import { PR_DIFF_MOCK } from '../../utils/constants';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const AiCodeReviewPreview = () => {
  const [selectedFileId, setSelectedFileId] = useState(PR_DIFF_MOCK.files[0].id);
  const [appliedPatches, setAppliedPatches] = useState({});

  const selectedFile = PR_DIFF_MOCK.files.find((f) => f.id === selectedFileId) || PR_DIFF_MOCK.files[0];
  const isPatched = !!appliedPatches[selectedFile.id];

  const handleApplyFix = (fileId) => {
    setAppliedPatches((prev) => ({ ...prev, [fileId]: true }));
  };

  return (
    <section id="ai-review" className="py-24 bg-[#030712] relative border-t border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="cyan">GitHub & GitLab Native PR Guard</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            AI PR Security Reviewer
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Experience line-by-line security review comments and automated non-breaking patch generation.
          </p>
        </div>

        {/* PR Review Wrapper Window */}
        <div className="glass-card-linear rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          
          {/* PR Header Bar */}
          <div className="bg-gray-900/90 px-6 py-4 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FiGitPullRequest className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">
                    PR #{PR_DIFF_MOCK.prNumber}: {PR_DIFF_MOCK.prTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                    Open
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  Author: <span className="text-gray-300">{PR_DIFF_MOCK.author}</span> &bull; Branch:{' '}
                  <span className="text-cyan-400">{PR_DIFF_MOCK.branch}</span> &rarr;{' '}
                  <span className="text-gray-300">{PR_DIFF_MOCK.targetBranch}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-xs text-gray-400 font-mono">
                {isPatched ? (
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>0 Vulnerabilities Remaining</span>
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center space-x-1">
                    <FiAlertTriangle className="w-4 h-4" />
                    <span>1 Security Flag Found</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area: Sidebar File List + Code Diff */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-800 min-h-[480px]">
            
            {/* Sidebar File Tree (3 Cols) */}
            <div className="lg:col-span-3 bg-[#030712]/80 p-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-2 mb-3">
                Changed Files ({PR_DIFF_MOCK.files.length})
              </div>
              {PR_DIFF_MOCK.files.map((file) => {
                const filePatched = !!appliedPatches[file.id];
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      selectedFileId === file.id
                        ? 'bg-gray-800 text-white border border-gray-700 font-semibold shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FiFileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{file.filename}</span>
                    </div>
                    {filePatched ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Patched"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" title="Needs Attention"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Code Diff Container (9 Cols) */}
            <div className="lg:col-span-9 bg-gray-950 p-5 font-mono text-xs overflow-x-auto">
              
              {/* File Title */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-900">
                <div className="flex items-center space-x-2">
                  <FiCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">{selectedFile.filename}</span>
                  <span className="text-gray-500">{selectedFile.changes}</span>
                </div>
                {isPatched && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center space-x-1.5">
                    <FiCheck className="w-3.5 h-3.5" />
                    <span>AI Patch Applied</span>
                  </span>
                )}
              </div>

              {/* Code Diff Table */}
              <div className="space-y-1 rounded-xl bg-[#030712] border border-gray-900 p-3">
                {selectedFile.diffLines.map((line, idx) => {
                  let lineBg = 'text-gray-300';
                  let prefix = ' ';
                  if (line.type === 'remove') {
                    lineBg = isPatched ? 'text-gray-600 line-through opacity-50' : 'bg-rose-500/10 text-rose-300 border-l-2 border-rose-500';
                    prefix = '-';
                  } else if (line.type === 'add') {
                    lineBg = 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500';
                    prefix = '+';
                  }

                  return (
                    <div key={idx} className={`flex items-start px-2 py-0.5 rounded ${lineBg}`}>
                      <span className="w-8 text-gray-600 select-none text-right pr-3">
                        {line.newLine || line.oldLine || ''}
                      </span>
                      <span className="w-4 text-gray-500 select-none">{prefix}</span>
                      <span className="whitespace-pre-wrap">{line.content}</span>
                    </div>
                  );
                })}
              </div>

              {/* Inline AI Review Card */}
              {selectedFile.comment && (
                <div className="mt-5 glass-card-linear rounded-2xl p-5 border border-rose-500/30 bg-rose-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <FiShield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>{selectedFile.comment.author}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {selectedFile.comment.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {selectedFile.comment.cwe} &bull; {selectedFile.comment.timestamp}
                        </div>
                      </div>
                    </div>

                    {!isPatched ? (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={FiZap}
                        onClick={() => handleApplyFix(selectedFile.id)}
                      >
                        Apply AI Fix
                      </Button>
                    ) : (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Fix Merged into Branch</span>
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">
                    {selectedFile.comment.description}
                  </p>

                  <div className="bg-gray-950 rounded-xl p-3 border border-gray-900 font-mono text-[11px] text-emerald-300">
                    <div className="text-gray-500 text-[10px] mb-1">// Recommended AI Fix:</div>
                    <pre><code>{selectedFile.comment.fixSnippet}</code></pre>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
