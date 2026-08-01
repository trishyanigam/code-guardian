import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Settings, Sparkles } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">Settings</span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-gray-400 mt-1">Configure AI security guardrails, API tokens, and team access</p>
      </div>

      {/* Coming Soon Card */}
      <div className="glass-card-linear rounded-2xl border border-white/10 p-12 text-center bg-[#0a0f1d]/80 max-w-xl mx-auto my-8 relative overflow-hidden shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/10">
          <Settings className="w-7 h-7" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Feature In Development</span>
        </span>
        <h2 className="text-xl font-bold text-white mb-2">Workspace Settings Coming Soon</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
          Custom OpenAI key integration, secret pattern rules, RBAC permissions, and enterprise single sign-on (SSO) are in active development.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-white text-xs font-semibold transition-all"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
