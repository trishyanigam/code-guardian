import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiHome, FiArrowLeft } from 'react-icons/fi';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  useDocumentTitle('404 Page Not Found');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 bg-cyber-grid bg-radial-gradient px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Glow Icon */}
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto glow-rose animate-bounce">
          <FiAlertOctagon className="w-10 h-10" />
        </div>

        {/* 404 Large Text */}
        <div className="space-y-2">
          <span className="text-7xl font-extrabold gradient-text-alt tracking-tight block">
            404
          </span>
          <h1 className="text-2xl font-bold text-white">
            Lost in Hyperspace?
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            The security payload or page route you requested could not be located on the server.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" size="md" icon={FiHome}>
              Return to Safety
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
