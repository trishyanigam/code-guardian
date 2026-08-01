import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Reusable ProtectedRoute Component for React Router v7
 * Checks user authentication status, handles loading session guard,
 * redirects unauthenticated users to /login, and supports nested routes (<Outlet />).
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show dark SaaS loading spinner while resolving authentication state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-gray-400">Verifying security session...</span>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to /login preserving target location state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render direct children if provided, otherwise render nested routes via Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
