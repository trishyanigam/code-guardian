import React from 'react';
import { WORKFLOW_STEPS } from '../../utils/constants';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

export const HowItWorksSection = () => {
  return (
    <section id="workflow" className="py-24 bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="purple">Simple Integration</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Three Steps to Full Code Guarding
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Effortlessly plug CodeGuardian AI into existing engineering workflows within 5 minutes.
          </p>
        </div>

        {/* 3 Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {WORKFLOW_STEPS.map((step) => (
            <Card key={step.step} className="relative group">
              <div className="text-5xl font-black text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors mb-4 font-mono">
                {step.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
