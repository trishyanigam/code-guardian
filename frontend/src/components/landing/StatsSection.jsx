import React from 'react';
import { STATS_DATA } from '../../utils/constants';

export const StatsSection = () => {
  return (
    <section id="stats" className="py-20 bg-gray-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gray-800/80 glow-cyan">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
            {STATS_DATA.map((stat, idx) => (
              <div key={idx} className={`pt-4 md:pt-0 ${idx !== 0 ? 'md:pl-6' : ''}`}>
                <div className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
