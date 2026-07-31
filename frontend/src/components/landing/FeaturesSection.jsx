import React from 'react';
import { 
  FiShield, 
  FiCpu, 
  FiGitPullRequest, 
  FiFileText, 
  FiLock, 
  FiCode,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';
import { BENTO_FEATURES } from '../../utils/constants';
import { Badge } from '../common/Badge';

const iconMap = {
  'ast-llm-scanner': FiCpu,
  'pr-guard-bot': FiGitPullRequest,
  'dependency-shield': FiLock,
  'compliance-engine': FiFileText,
  'zero-knowledge': FiShield,
  'custom-rules': FiCode,
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-28 bg-[#030712] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <Badge variant="emerald">Engineering Architecture</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for High-Velocity DevSecOps
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Purpose-built security engine engineered to eliminate vulnerability backlogs without slowing down developer velocity.
          </p>
        </div>

        {/* Linear Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENTO_FEATURES.map((feature) => {
            const IconComponent = iconMap[feature.id] || FiShield;
            const isLarge = feature.size === 'lg';

            return (
              <div
                key={feature.id}
                className={`glass-card-linear rounded-3xl p-8 glass-card-hover flex flex-col justify-between group relative overflow-hidden ${
                  isLarge ? 'lg:col-span-2' : ''
                }`}
              >
                {/* Accent Corner Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>

                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-gray-950 transition-all duration-300 shadow-inner">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="cyan">{feature.badge}</Badge>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <div className="text-xs font-mono text-emerald-400/90 mb-3 font-semibold">
                    {feature.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Metric Footer Pill */}
                <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="flex items-center space-x-1.5">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Guard Protocol</span>
                  </span>
                  <span className="text-white font-bold bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">
                    {feature.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
