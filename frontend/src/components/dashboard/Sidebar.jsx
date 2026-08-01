import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutGrid,
  FolderGit2,
  GitPullRequest,
  Zap,
  BarChart3,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

/**
 * Sidebar Navigation Items Configuration
 */
const PRIMARY_NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  { label: 'Repositories', path: '/repositories/connect', icon: FolderGit2 },
  { label: 'Pull Requests', path: '/pull-requests', icon: GitPullRequest, badge: '4' },
  { label: 'AI Reviews', path: '/ai-reviews', icon: Zap, badge: 'New' },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Notifications', path: '/notifications', icon: Bell, badge: '3' },
];

const SECONDARY_NAV = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Profile', path: '/profile', icon: User },
];

/**
 * Collapsible & Mobile Responsive Sidebar Component using Lucide Icons
 */
export const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isPathActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#0a0f1d]/95 border-r border-white/10 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 select-none ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 relative">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 group transition-all ${
                isCollapsed ? 'lg:justify-center w-full' : ''
              }`}
              onClick={onClose}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Shield className="w-5 h-5 text-gray-950 stroke-[2.5]" />
              </div>
              {(!isCollapsed || isOpen) && (
                <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                  CodeGuardian <span className="text-emerald-400 font-mono text-xs font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">AI</span>
                </span>
              )}
            </Link>

            {/* Desktop Collapse Toggle Button */}
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-white/15 text-gray-400 hover:text-white hover:border-emerald-500/50 transition-all absolute -right-3 top-5 z-20 cursor-pointer shadow-md"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation Links */}
          <div className="p-3 space-y-1">
            {(!isCollapsed || isOpen) && (
              <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 transition-opacity">
                Platform
              </p>
            )}
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const active = isPathActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.04]'
                  } ${isCollapsed && !isOpen ? 'lg:justify-center' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 transition-colors shrink-0 ${active ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                    {(!isCollapsed || isOpen) && (
                      <span className="whitespace-nowrap">{item.label}</span>
                    )}
                  </div>

                  {(!isCollapsed || isOpen) && item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                        active
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : item.badge === 'New'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation Links */}
          <div className="p-3 pt-4 border-t border-white/5 space-y-1">
            {(!isCollapsed || isOpen) && (
              <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Settings & Account
              </p>
            )}
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              const active = isPathActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.04]'
                  } ${isCollapsed && !isOpen ? 'lg:justify-center' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 transition-colors shrink-0 ${active ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                    {(!isCollapsed || isOpen) && (
                      <span className="whitespace-nowrap">{item.label}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Fixed Bottom Footer: Logout Button */}
        <div className="p-3 border-t border-white/10 bg-[#0a0f1d]/90">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              if (onLogout) onLogout();
            }}
            title={isCollapsed ? 'Logout Session' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer ${
              isCollapsed && !isOpen ? 'lg:justify-center' : ''
            }`}
          >
            <LogOut className="w-4.5 h-4.5 text-rose-400 shrink-0" />
            {(!isCollapsed || isOpen) && <span className="whitespace-nowrap">Logout Session</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
