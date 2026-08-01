import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiMenu, FiX, FiGithub, FiArrowRight, FiSearch } from 'react-icons/fi';
import { NAV_LINKS } from '../../utils/constants';
import { useScroll } from '../../hooks/useScroll';
import { Button } from './Button';

export const Navbar = () => {
  const isScrolled = useScroll(15);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-gray-800/80 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <FiShield className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white tracking-wide">
                Code<span className="text-emerald-400">Guardian</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Search/Command Trigger */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-gray-400 text-xs cursor-pointer hover:border-gray-700 transition-all">
              <FiSearch className="w-3.5 h-3.5 text-gray-400" />
              <span>Search docs...</span>
              <kbd className="ml-2">⌘K</kbd>
            </div>

            {/* GitHub Star Pill */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-900/60 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs font-mono transition-colors"
            >
              <FiGithub className="w-3.5 h-3.5 text-gray-400" />
              <span>★ 4.8k</span>
            </a>

            {/* Login Button */}
            <Link
              to="/login"
              className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-2 transition-colors"
            >
              Login
            </Link>

            {/* Get Started Button -> /signup */}
            <Link to="/signup">
              <Button variant="primary" size="sm" icon={FiArrowRight}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030712]/95 backdrop-blur-2xl border-b border-gray-800 px-4 pt-4 pb-6 mt-3 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-300 hover:text-emerald-400"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-gray-800 space-y-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 text-sm font-semibold text-gray-300 hover:text-white bg-gray-900/80 rounded-xl border border-gray-800"
            >
              Login
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={FiArrowRight}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
