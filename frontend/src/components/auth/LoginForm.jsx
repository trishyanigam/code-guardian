import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (onSubmit) {
      onSubmit(formData);
    }
    // Simulation of form submission state
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Social Login Options (Clerk / Vercel / Linear Style) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-pointer group"
        >
          <FaGithub className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>GitHub</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-pointer group"
        >
          <FcGoogle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-white/10"></div>
        <span className="absolute bg-[#0b1329] px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
          or continue with email
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiMail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="developer@codeguardian.ai"
              className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all duration-200"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiLock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-11 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2.5 text-xs text-gray-300 select-none cursor-pointer">
            Remember me on this device
          </label>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all duration-200 cursor-pointer group mt-2"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            <>
              <span>Sign in</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-center text-xs text-gray-400 pt-2">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
