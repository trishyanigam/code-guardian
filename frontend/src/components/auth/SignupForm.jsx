import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setValidationError('');
  };

  // Real-time password validation indicators
  const isMinLength = formData.password.length >= 8;
  const isPasswordMatch = Boolean(formData.password) && formData.password === formData.confirmPassword;
  const passwordsMismatch = Boolean(formData.confirmPassword) && formData.password !== formData.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!isMinLength) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }

    if (!isPasswordMatch) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setValidationError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

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
    <div className="w-full space-y-5">
      {/* Social Registration Options */}
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
          or register with email
        </span>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300 flex items-center gap-2">
          <FiX className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name Input */}
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiUser className="w-4 h-4" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all duration-200"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
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
              placeholder="jane@company.com"
              className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all duration-200"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
            Password
          </label>
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
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-11 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all duration-200"
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

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
            Confirm Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiLock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`w-full rounded-xl bg-slate-900/80 border pl-10 pr-11 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                passwordsMismatch
                  ? 'border-rose-500/60 focus:ring-rose-500/40 focus:border-rose-500'
                  : 'border-white/10 focus:ring-emerald-500/40 focus:border-emerald-500/80'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Validation Indicators UI */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            {isMinLength ? (
              <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-gray-600 shrink-0 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              </div>
            )}
            <span className={isMinLength ? 'text-emerald-300 font-medium' : 'text-gray-400'}>
              At least 8 characters
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPasswordMatch ? (
              <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-gray-600 shrink-0 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              </div>
            )}
            <span className={isPasswordMatch ? 'text-emerald-300 font-medium' : 'text-gray-400'}>
              Passwords match
            </span>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start pt-1">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer"
          />
          <label htmlFor="agreeTerms" className="ml-2.5 text-xs text-gray-300 leading-snug select-none cursor-pointer">
            I agree to the{' '}
            <a href="#" className="text-emerald-400 hover:text-emerald-300 underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-emerald-400 hover:text-emerald-300 underline">Privacy Policy</a>
          </label>
        </div>

        {/* Submit Button */}
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
              Creating account...
            </span>
          ) : (
            <>
              <span>Create Account</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Link to Login */}
      <p className="text-center text-xs text-gray-400 pt-1">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
