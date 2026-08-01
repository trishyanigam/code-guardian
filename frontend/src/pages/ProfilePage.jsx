import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, User, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Developer';
  const userEmail = user?.email || 'developer@codeguardian.ai';

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">Profile</span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Developer Profile</h1>
        <p className="text-xs text-gray-400 mt-1">Manage your account credentials, GitHub tokens, and developer profile</p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card-linear rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/80 max-w-2xl mx-auto shadow-xl mb-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-gray-950 font-bold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{userName}</h3>
            <span className="text-xs text-gray-400 font-mono">{userEmail}</span>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="glass-card-linear rounded-2xl border border-white/10 p-12 text-center bg-[#0a0f1d]/80 max-w-xl mx-auto my-8 relative overflow-hidden shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/10">
          <User className="w-7 h-7" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Feature In Development</span>
        </span>
        <h2 className="text-xl font-bold text-white mb-2">Profile Customization Coming Soon</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
          Avatar management, 2FA security authentication, and personal GitHub personal access token (PAT) management are coming soon.
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

export default ProfilePage;
