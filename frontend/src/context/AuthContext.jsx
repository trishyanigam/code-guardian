import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth.service';

const USER_STORAGE_KEY = 'cg_user';
const TOKEN_STORAGE_KEY = 'cg_token';

// Create Auth Context
export const AuthContext = createContext(null);

/**
 * Helper function to safely decode JWT payload
 */
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * AuthProvider component to wrap application and supply auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount (detects OAuth URL query params or localStorage)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Detect JWT token from URL query parameter (?token=...)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
          // 2. Save token to localStorage
          localStorage.setItem(TOKEN_STORAGE_KEY, tokenFromUrl);

          // 3. Construct user profile from JWT payload
          const decoded = decodeJwtPayload(tokenFromUrl);
          let userData = decoded
            ? {
                _id: decoded.id || decoded._id,
                email: decoded.email,
                name: decoded.name || decoded.email?.split('@')[0] || 'GitHub User',
                role: decoded.role || 'user',
                avatar: decoded.avatar || '',
              }
            : null;

          // Attempt to fetch full fresh user profile from backend
          try {
            const response = await getCurrentUser();
            if (response && response.data) {
              userData = response.data;
            }
          } catch (apiError) {
            // Fall back to decoded JWT payload if API request fails
          }

          if (userData) {
            setUser(userData);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
          }

          // 4 & 5. Remove query parameters from URL and cleanly update history
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } else {
          // 7. If no token in URL, continue using existing localStorage session
          const storedUser = localStorage.getItem(USER_STORAGE_KEY);
          const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

          if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Log in user and persist state to localStorage
   * @param {Object} userData - User details object
   * @param {string} token - JWT authentication token
   */
  const login = (userData, token) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  };

  /**
   * Log out user and clear persisted localStorage data
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * @returns {{ user: Object|null, login: Function, logout: Function, loading: boolean, isAuthenticated: boolean }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
