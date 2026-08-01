import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopNavbar from '../components/dashboard/TopNavbar';
import { useAuth } from '../hooks/useAuth';

/**
 * Production-ready Authenticated Dashboard Layout
 * Wraps protected pages with a responsive sidebar and top navigation bar.
 */
export const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-gray-100 bg-linear-grid flex overflow-hidden font-sans">
      {/* Background Radial Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none"></div>

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
