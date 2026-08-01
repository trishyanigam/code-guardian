import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance configured for Auth endpoints
 */
const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach Authorization Bearer token from localStorage on requests if present
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Register a new user
 * @param {Object} userData - User registration payload ({ name, email, password, avatar, role })
 * @returns {Promise<Object>} API response data containing user and token
 */
export const register = async (userData) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};

/**
 * Authenticate user with credentials
 * @param {Object} credentials - User credentials ({ email, password })
 * @returns {Promise<Object>} API response data containing user and token
 */
export const login = async (credentials) => {
  const response = await authApi.post('/login', credentials);
  return response.data;
};

/**
 * Logout current authenticated user session
 * @returns {Promise<Object>} API response payload
 */
export const logout = async () => {
  const response = await authApi.post('/logout');
  return response.data;
};

/**
 * Fetch profile details for the currently authenticated user
 * @returns {Promise<Object>} API response data containing user profile
 */
export const getCurrentUser = async () => {
  const response = await authApi.get('/me');
  return response.data;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
