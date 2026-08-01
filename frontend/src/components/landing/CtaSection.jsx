import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiGithub, FiCheck } from 'react-icons/fi';
import { Button } from '../common/Button';

export const CtaSection = () => {
  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow Container */}
        <div className="glass-card-linear rounded-3xl p-10 sm:p-20 border border-emerald-500/30 text-center relative overflow-hidden shadow-2xl bg-hero-glow">
          
          {/* Ambient Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            {/* Top Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto glow-emerald">
              <FiShield className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Secure Your Codebase in Under 2 Minutes
            </h2>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Connect your GitHub or GitLab repository to enable automated AST scanning and instant AI pull-request reviews.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="gradient" size="lg" icon={FiGithub}>
                  Authorize GitHub App
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="lg" icon={FiArrowRight}>
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Certification Badges */}
            <div className="pt-8 border-t border-gray-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-400">
              <span className="flex items-center space-x-1.5">
                <FiCheck className="w-4 h-4 text-emerald-400" />
                <span>SOC2 Type II Certified</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <FiCheck className="w-4 h-4 text-emerald-400" />
                <span>ISO 27001 Compliant</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <FiCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Data Training</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CtaSection;
