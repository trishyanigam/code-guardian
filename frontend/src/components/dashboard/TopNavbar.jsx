import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

/**
 * Sticky Top Navigation Bar Component
 * Includes Search Bar, Notification Bell with Dropdown, Theme Toggle, and User Avatar Menu.
 */
export const TopNavbar = ({ onOpenMobileSidebar, user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const userName = user?.name || 'Developer';
  const userEmail = user?.email || 'developer@codeguardian.ai';
  const avatarUrl = user?.avatar || '';

  return (
    <header className="h-16 w-full bg-[#0a0f1d]/90 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl sticky top-0 z-30 select-none">
      {/* Left Section: Mobile Sidebar Hamburger Toggle & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code vulnerabilities, PRs, or repos..."
            className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-9 pr-12 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white/5 rounded border border-white/10 pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: System Status, Theme Toggle, Notification Bell, User Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* AI System Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI Engine Active</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-300" />
          )}
        </button>

        {/* Notification Bell Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0a0f1d]" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0a0f1d] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-xs font-bold text-white">Security Notifications</span>
                <span className="text-[10px] text-emerald-400 font-mono">3 Unread</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <span className="font-semibold block">Critical Alert Blocked</span>
                    <span className="text-[11px] text-gray-400">SQL injection threat prevented in auth endpoint.</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="font-semibold block">PR Review Passed</span>
                    <span className="text-[11px] text-gray-400">PR #128 passed automated AI checks.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all cursor-pointer group"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 text-gray-950 font-bold text-xs flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-white block group-hover:text-emerald-400 transition-colors leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-gray-400 block leading-tight">
                {userEmail}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0a0f1d] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in duration-200">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <span className="text-xs font-bold text-white block truncate">{userName}</span>
                <span className="text-[11px] text-gray-400 block truncate">{userEmail}</span>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-emerald-400" />
                <span>Your Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Account Settings</span>
              </Link>
              <div className="my-1 border-t border-white/10" />
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
