import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiGithub, FiTwitter, FiDisc } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-[#030712] border-t border-gray-800/80 pt-16 pb-12 text-gray-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                  <FiShield className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="font-bold text-base text-white tracking-wide">
                Code<span className="text-emerald-400">Guardian</span> AI
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              LLM-powered static code analysis, vulnerability remediation, and automated DevSecOps pull request guard.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Security Scanners Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-4 font-mono">
              Product
            </h3>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">AST Vulnerability Scanner</a></li>
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">AI PR Review Bot</a></li>
              <li><a href="#analytics" className="hover:text-emerald-400 transition-colors">Engineering Analytics</a></li>
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Dependency Shield</a></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-4 font-mono">
              Developers
            </h3>
            <ul className="space-y-2.5">
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">GitHub Action Integration</a></li>
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">GitLab CI Config</a></li>
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">Custom Semgrep Rules</a></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-4 font-mono">
              Compliance & Legal
            </h3>
            <ul className="space-y-2.5">
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">Privacy & Data Isolation</a></li>
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">SOC2 Type II Report</a></li>
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">ISO 27001 Certification</a></li>
              <li><a href="#ai-review" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. Engineered for modern high-velocity security teams.
          </p>
          <div className="flex items-center space-x-5 text-gray-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
              <FiGithub className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
              <FiTwitter className="w-4 h-4" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Discord">
              <FiDisc className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
