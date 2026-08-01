import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Reusable ProtectedRoute component for React Router v7
 * Redirects unauthenticated users to /login preserving target location state.
 * Supports both direct children wrapper and React Router Outlet.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show sleek loading state while verifying auth session
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-gray-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children when authenticated or fallback to Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
