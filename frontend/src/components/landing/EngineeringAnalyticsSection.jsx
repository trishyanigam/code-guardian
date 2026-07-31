import React from 'react';
import { FiTrendingDown, FiClock, FiShield, FiBarChart2, FiCheck } from 'react-icons/fi';
import { ANALYTICS_DATA } from '../../utils/constants';
import { Badge } from '../common/Badge';

export const EngineeringAnalyticsSection = () => {
  return (
    <section id="analytics" className="py-24 bg-[#030712] relative border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="purple">Engineering Metrics</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Security Velocity Analytics
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Quantify security debt reduction, scan performance, and team PR velocity in real-time.
          </p>
        </div>

        {/* 4 Metric Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ANALYTICS_DATA.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="glass-card-linear rounded-2xl p-6 border border-gray-800 glass-card-hover space-y-3"
            >
              <div className="text-xs font-mono text-gray-400">{metric.label}</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {metric.value}
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <FiTrendingDown className="w-3.5 h-3.5" />
                <span>{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Main Dashboard Graphic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* MTTR Reduction Chart (7 Cols) */}
          <div className="lg:col-span-7 glass-card-linear rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Mean Time to Remediate (MTTR)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Comparison of traditional security review time vs CodeGuardian AI automated patching (Hours)
                  </p>
                </div>
                <Badge variant="emerald">85% Faster</Badge>
              </div>

              {/* Bar Chart Mockup */}
              <div className="space-y-4 pt-4">
                {ANALYTICS_DATA.monthlyTrend.map((item) => (
                  <div key={item.month} className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>{item.month}</span>
                      <span className="text-emerald-400 font-bold">{item.codeGuardianMTTR} mins vs {item.traditionalMTTR} hrs</span>
                    </div>
                    <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                        style={{ width: `${(item.codeGuardianMTTR / item.traditionalMTTR) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-gray-300 font-semibold">CodeGuardian AI (Automated)</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-gray-700 inline-block"></span>
                <span>Traditional Security Review</span>
              </span>
            </div>
          </div>

          {/* Severity Distribution Breakdown (5 Cols) */}
          <div className="lg:col-span-5 glass-card-linear rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Vulnerability Distribution
                </h3>
                <Badge variant="cyan">Real-time Categorization</Badge>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                Active security flags prevented across repository branches by severity rank.
              </p>

              <div className="space-y-5">
                {ANALYTICS_DATA.severityDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-200 font-medium">{item.type}</span>
                      <span className="text-gray-400 font-bold">{item.count} flagged ({item.percentage}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage * 2}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 text-xs text-gray-400 flex items-center space-x-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              <span>All flagged vulnerabilities include automated LLM patch recommendations</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
