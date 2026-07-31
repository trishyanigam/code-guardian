import React, { useState } from 'react';
import { FiAlertTriangle, FiCheck, FiCode, FiCopy, FiZap } from 'react-icons/fi';
import { MOCK_SECURITY_SCAN } from '../../utils/constants';
import { formatSeverityColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export const CodePreviewSection = () => {
  const [activeTab, setActiveTab] = useState('vulnerable');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeToCopy =
      activeTab === 'vulnerable'
        ? MOCK_SECURITY_SCAN.vulnerableCode
        : MOCK_SECURITY_SCAN.fixedCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="py-24 bg-gray-950 relative border-t border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="rose">Interactive Vulnerability Demo</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            See CodeGuardian AI in Action
          </h2>
          <p className="text-gray-400 text-base">
            Compare vulnerable code patterns with instant AI-generated secure replacements.
          </p>
        </div>

        {/* Live Code Preview Container */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Code Viewer (8 cols) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            {/* Header Tabs */}
            <div className="flex items-center justify-between bg-gray-900/90 px-4 py-3 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('vulnerable')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'vulnerable'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <FiAlertTriangle className="w-3.5 h-3.5" />
                  <span>Detected Vulnerability</span>
                </button>
                <button
                  onClick={() => setActiveTab('fixed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'fixed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <FiCheck className="w-3.5 h-3.5" />
                  <span>AI Patched Code</span>
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-sm overflow-x-auto bg-gray-950 leading-relaxed">
              <pre className={activeTab === 'vulnerable' ? 'text-rose-300' : 'text-emerald-300'}>
                <code>
                  {activeTab === 'vulnerable'
                    ? MOCK_SECURITY_SCAN.vulnerableCode
                    : MOCK_SECURITY_SCAN.fixedCode}
                </code>
              </pre>
            </div>
          </div>

          {/* Vulnerability Analysis Card (4 cols) */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-gray-800 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Security Audit Details
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold border ${formatSeverityColor(
                  MOCK_SECURITY_SCAN.vulnerabilityDetails.severity
                )}`}
              >
                {MOCK_SECURITY_SCAN.vulnerabilityDetails.severity} SEVERITY
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {MOCK_SECURITY_SCAN.vulnerabilityDetails.type}
              </h3>
              <p className="text-xs text-gray-400">
                CVSS Score: <span className="text-rose-400 font-bold">{MOCK_SECURITY_SCAN.vulnerabilityDetails.score}</span>
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-800 text-xs">
              <div>
                <span className="text-gray-400 font-semibold block mb-1">Impact Description:</span>
                <p className="text-gray-300 leading-relaxed">
                  {MOCK_SECURITY_SCAN.vulnerabilityDetails.description}
                </p>
              </div>

              <div>
                <span className="text-emerald-400 font-semibold block mb-1">Remediation Strategy:</span>
                <p className="text-gray-300 leading-relaxed">
                  {MOCK_SECURITY_SCAN.vulnerabilityDetails.recommendation}
                </p>
              </div>
            </div>

            <div className="pt-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
                <FiZap className="w-4 h-4 flex-shrink-0" />
                <span>Auto-fix verified by CodeGuardian AI agent engine</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
