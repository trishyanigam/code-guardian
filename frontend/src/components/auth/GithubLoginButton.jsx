import React from 'react';
import { FaGithub } from 'react-icons/fa';

/**
 * Premium SaaS GitHub OAuth Login Button Component
 * Redirects user to backend GitHub authentication endpoint on click.
 */
export const GithubLoginButton = ({
  label = 'Continue with GitHub',
  className = '',
  onClick,
}) => {
  const handleGithubLogin = () => {
    if (onClick) {
      onClick();
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiUrl}/github/login`;
  };

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      className={`w-full flex items-center justify-center gap-3 rounded-xl bg-slate-900/90 border border-white/15 px-4 py-3 text-sm font-medium text-white shadow-md hover:bg-slate-800/90 hover:border-emerald-500/40 hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200 cursor-pointer group ${className}`}
    >
      <FaGithub className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      <span>{label}</span>
    </button>
  );
};

export default GithubLoginButton;
