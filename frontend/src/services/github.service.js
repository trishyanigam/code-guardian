import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance configured for GitHub API endpoints
 */
const githubApi = axios.create({
  baseURL: `${API_URL}/github`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach Authorization Bearer token from localStorage on requests if present
githubApi.interceptors.request.use(
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
 * Redirect user to backend GitHub OAuth login workflow
 */
export const login = () => {
  window.location.href = `${API_URL}/github/login`;
};

/**
 * Fetch profile information for authenticated GitHub user
 * @returns {Promise<Object>} API response data
 */
export const getProfile = async () => {
  const response = await githubApi.get('/profile');
  return response.data;
};

/**
 * Fetch available GitHub repositories
 * @returns {Promise<Object>} API response data
 */
export const getRepositories = async () => {
  const response = await githubApi.get('/repositories');
  return response.data;
};

/**
 * Connect a repository to the workspace database
 * @param {Object} repoData - Repository metadata payload ({ owner, repoName, githubRepoId, defaultBranch, visibility, language })
 * @returns {Promise<Object>} API response data
 */
export const connectRepository = async (repoData) => {
  const response = await githubApi.post('/connect', repoData);
  return response.data;
};

/**
 * Disconnect a repository from the workspace database
 * @param {string} repositoryId - MongoDB ID or githubRepoId
 * @returns {Promise<Object>} API response data
 */
export const disconnectRepository = async (repositoryId) => {
  const response = await githubApi.delete(`/disconnect/${repositoryId}`);
  return response.data;
};

export default {
  login,
  getProfile,
  getRepositories,
  connectRepository,
  disconnectRepository,
};
