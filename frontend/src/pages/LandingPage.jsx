import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Hero } from '../components/landing/Hero';
import { AiCodeReviewPreview } from '../components/landing/AiCodeReviewPreview';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { EngineeringAnalyticsSection } from '../components/landing/EngineeringAnalyticsSection';
import { CtaSection } from '../components/landing/CtaSection';

export const LandingPage = () => {
  useDocumentTitle('AI Code Security & PR Review Guard');

  return (
    <div className="landing-page selection:bg-emerald-500 selection:text-gray-950">
      <Hero />
      <AiCodeReviewPreview />
      <FeaturesSection />
      <EngineeringAnalyticsSection />
      <CtaSection />
    </div>
  );
};

export default LandingPage;
