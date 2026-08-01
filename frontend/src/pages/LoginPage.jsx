import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiCheckCircle } from 'react-icons/fi';
import LoginForm from '../components/auth/LoginForm';

export const LoginPage = () => {
  const handleLoginSubmit = (formData) => {
    console.log('Login form submitted:', formData);
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-gray-100 bg-linear-grid bg-hero-glow flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Header / Brand Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <FiShield className="w-5 h-5 text-gray-950 font-bold" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            CodeGuardian <span className="text-emerald-400 font-mono text-sm font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">AI</span>
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
        >
          ← Back to home
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md">
          {/* Centered Authentication Card */}
          <div className="glass-card-linear rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden bg-[#0a0f1d]/80">
            {/* Top Card Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>

            {/* Header Text */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">
                Welcome back
              </h1>
              <p className="text-xs text-gray-400">
                Sign in to your CodeGuardian AI security workspace
              </p>
            </div>

            {/* LoginForm Component */}
            <LoginForm onSubmit={handleLoginSubmit} />
          </div>

          {/* Security Compliance Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit AES Encrypted & SOC2 Compliant</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 z-10 gap-2">
        <p>© {new Date().getFullYear()} CodeGuardian AI Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
