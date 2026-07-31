import React from 'react';
import { FiShield, FiZap, FiArrowRight, FiCheck, FiTerminal, FiGitPullRequest, FiLock } from 'react-icons/fi';
import { Button } from '../common/Button';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-linear-grid bg-hero-glow">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Linear Style Top Pill */}
          <a
            href="#features"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 hover:border-emerald-500/50 text-gray-300 text-xs font-medium transition-all group shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-gray-200">CodeGuardian 2.0</span>
            <span className="text-gray-500">&bull;</span>
            <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              Automated PR Security Reviews ➔
            </span>
          </a>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Automated Code Security with{' '}
            <span className="gradient-text">LLM Precision</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Instant AST static analysis, real-time OWASP vulnerability detection, and automated PR remediation patches before code reaches production.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="gradient" size="lg" icon={FiArrowRight} href="#ai-review">
              Start Free Security Audit
            </Button>
            <Button variant="secondary" size="lg" icon={FiTerminal} href="#features">
              Explore Features
            </Button>
          </div>

          {/* Security Compliance Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono">
            <span className="flex items-center space-x-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              <span>OWASP Top 10 Guarded</span>
            </span>
            <span className="flex items-center space-x-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Knowledge Privacy</span>
            </span>
            <span className="flex items-center space-x-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC2 Type II Certified</span>
            </span>
          </div>

        </div>

        {/* Hero Interactive Terminal Window Graphic */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="glass-card-linear rounded-2xl p-4 shadow-2xl border border-gray-800 glow-emerald relative">
            
            {/* Topbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800/80 text-xs font-mono text-gray-400 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-gray-400 border-l border-gray-800 pl-3 flex items-center space-x-2">
                  <FiGitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                  <span>pr-402-security-audit.ts</span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                  GUARD STATUS: ACTIVE
                </span>
                <kbd>⌘K</kbd>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="bg-[#030712]/90 rounded-xl p-5 font-mono text-xs text-gray-300 overflow-x-auto leading-relaxed border border-gray-900 space-y-3">
              <div className="text-gray-500 flex items-center justify-between">
                <span>// Running CodeGuardian Security Inspection Engine v2.0</span>
                <span className="text-gray-600">Scan duration: 412ms</span>
              </div>
              
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <div className="font-bold flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>CRITICAL (CWE-89): SQL Injection Risk Detected at line 17</span>
                </div>
                <div className="mt-1 text-gray-400">
                  Direct string concatenation allows malicious input manipulation.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center space-x-2">
                  <FiZap className="w-3.5 h-3.5" />
                  <span>AI Automated Remediation Generated:</span>
                </div>
                <div className="text-gray-400 font-mono pt-1">
                  - const query = `SELECT * FROM users WHERE id = '${'${userId}'}'`;
                </div>
                <div className="text-emerald-400 font-mono font-semibold">
                  + const query = "SELECT * FROM users WHERE id = $1";
                </div>
                <div className="text-emerald-400 font-mono font-semibold">
                  + const result = await db.query(query, [userId]);
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
