import React, { createContext, useContext, useState, useEffect } from 'react';

const USER_STORAGE_KEY = 'cg_user';
const TOKEN_STORAGE_KEY = 'cg_token';

// Create Auth Context
export const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap application and supply auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse stored authentication data:', error);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
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
