import { Octokit } from '@octokit/rest';
import { Repository } from '../models/repository.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Initialize Octokit REST client instance using access token
 * @param {string} accessToken 
 * @returns {Octokit} Octokit instance
 */
const getOctokitInstance = (accessToken) => {
  if (!accessToken) {
    throw new ApiError(400, 'GitHub access token is required');
  }
  return new Octokit({ auth: accessToken });
};

/**
 * Fetch authenticated GitHub user profile details
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Object>} Clean GitHub user profile object
 */
export const fetchGithubProfile = async (accessToken) => {
  try {
    const octokit = getOctokitInstance(accessToken);
    const { data } = await octokit.rest.users.getAuthenticated();
    return {
      githubId: String(data.id),
      username: data.login,
      name: data.name || data.login,
      email: data.email,
      avatarUrl: data.avatar_url,
      profileUrl: data.html_url,
      publicRepos: data.public_repos,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.status || 500, `Failed to fetch GitHub profile: ${error.message}`);
  }
};

/**
 * Fetch list of repositories for the authenticated GitHub user
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Array<Object>>} Array of user repositories
 */
export const fetchRepositories = async (accessToken) => {
  try {
    const octokit = getOctokitInstance(accessToken);
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
      visibility: 'all',
    });

    return data.map((repo) => ({
      githubRepoId: String(repo.id),
      owner: repo.owner ? repo.owner.login : '',
      repoName: repo.name,
      fullName: repo.full_name,
      defaultBranch: repo.default_branch || 'main',
      visibility: repo.private ? 'private' : 'public',
      language: repo.language || 'Unknown',
      htmlUrl: repo.html_url,
      description: repo.description || '',
      updatedAt: repo.updated_at,
    }));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.status || 500, `Failed to fetch GitHub repositories: ${error.message}`);
  }
};

/**
 * Connect a GitHub repository to the platform workspace database
 * @param {Object} payload - { owner, repoName, githubRepoId, defaultBranch, visibility, language, userId }
 * @returns {Promise<Object>} Connected repository MongoDB document
 */
export const connectRepository = async ({
  owner,
  repoName,
  githubRepoId,
  defaultBranch = 'main',
  visibility = 'public',
  language = 'JavaScript',
  userId,
}) => {
  if (!owner || !repoName || !githubRepoId || !userId) {
    throw new ApiError(400, 'Owner, repository name, GitHub repository ID, and user ID are required');
  }

  const existingRepo = await Repository.findOne({ githubRepoId: String(githubRepoId) });
  if (existingRepo) {
    throw new ApiError(409, 'Repository is already connected');
  }

  const newRepo = await Repository.create({
    owner,
    repoName,
    githubRepoId: String(githubRepoId),
    defaultBranch,
    visibility,
    language,
    connectedBy: userId,
    connectedAt: new Date(),
  });

  return newRepo;
};

/**
 * Disconnect a GitHub repository from the platform workspace database
 * @param {string} repositoryId - MongoDB ID or githubRepoId
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object>} Disconnection result payload
 */
export const disconnectRepository = async (repositoryId, userId) => {
  if (!repositoryId || !userId) {
    throw new ApiError(400, 'Repository ID and User ID are required');
  }

  const repo = await Repository.findOne({
    $or: [{ _id: repositoryId }, { githubRepoId: String(repositoryId) }],
    connectedBy: userId,
  });

  if (!repo) {
    throw new ApiError(404, 'Repository not found or not connected by this user');
  }

  await Repository.findByIdAndDelete(repo._id);

  return {
    success: true,
    message: 'Repository disconnected successfully',
    repositoryId: repo._id,
  };
};

export default {
  fetchGithubProfile,
  fetchRepositories,
  connectRepository,
  disconnectRepository,
};
