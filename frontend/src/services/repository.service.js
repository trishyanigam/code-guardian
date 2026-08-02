import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Axios instance configured for Repository API endpoints
 */
const repositoryApi = axios.create({
  baseURL: `${API_URL}/repositories`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor to automatically attach JWT Authorization header
repositoryApi.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('cg_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('jwt');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Sync repositories from GitHub to MongoDB database
 * @param {string} [githubToken] - Optional GitHub access token
 * @returns {Promise<Object>} Response payload containing synced repositories
 */
export const syncRepositories = async (githubToken = null) => {
  const headers = githubToken ? { 'x-github-token': githubToken } : {};
  const response = await repositoryApi.post('/sync', {}, { headers });
  return response.data;
};

/**
 * Fetch repositories stored in database
 * @param {Object} [params] - Optional filter and pagination parameters
 * @returns {Promise<Object>} Response payload containing repository list
 */
export const getRepositories = async (params = {}) => {
  const response = await repositoryApi.get('/', { params });
  return response.data;
};

/**
 * Connect a repository
 * @param {string|Object} repositoryData - Repository ID or object containing repositoryId
 * @returns {Promise<Object>} Response payload containing connected repository details
 */
export const connectRepository = async (repositoryData) => {
  const payload =
    typeof repositoryData === 'object' && repositoryData !== null
      ? repositoryData
      : { repositoryId: repositoryData };
  const response = await repositoryApi.post('/connect', payload);
  return response.data;
};

/**
 * Disconnect a repository by ID
 * @param {string} repositoryId - MongoDB ObjectId or GitHub repository ID
 * @returns {Promise<Object>} Response payload confirming disconnection
 */
export const disconnectRepository = async (repositoryId) => {
  const response = await repositoryApi.delete(`/${repositoryId}`);
  return response.data;
};

/**
 * Fetch all connected repositories
 * @param {Object} [params] - Optional query parameters
 * @returns {Promise<Object>} Response payload containing connected repositories
 */
export const getConnectedRepositories = async (params = {}) => {
  const response = await repositoryApi.get('/connected', { params });
  return response.data;
};

export default {
  syncRepositories,
  getRepositories,
  connectRepository,
  disconnectRepository,
  getConnectedRepositories,
};
