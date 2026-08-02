import { Octokit } from '@octokit/rest';
import mongoose from 'mongoose';
import { Repository } from '../models/repository.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Helper to initialize Octokit REST client instance using GitHub access token
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
 * Fetch repositories from GitHub using Octokit and sync/save them in MongoDB.
 * Uses upsert based on githubRepoId to avoid duplicate repositories.
 * @param {string} accessToken - GitHub access token
 * @param {string} [userId] - Optional user ID initiating the sync
 * @returns {Promise<Array<Object>>} Array of synced repository MongoDB documents
 */
export const syncRepositories = async (accessToken, userId = null) => {
  try {
    const octokit = getOctokitInstance(accessToken);
    const { data: reposData } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
      visibility: 'all',
    });

    const syncedRepos = await Promise.all(
      reposData.map(async (repo) => {
        const updateData = {
          githubRepoId: String(repo.id),
          owner: repo.owner ? repo.owner.login : '',
          repoName: repo.name,
          description: repo.description || '',
          visibility: repo.private ? 'private' : 'public',
          language: repo.language || 'Unknown',
          defaultBranch: repo.default_branch || 'main',
          cloneUrl: repo.clone_url || '',
          htmlUrl: repo.html_url || '',
        };

        return await Repository.findOneAndUpdate(
          { githubRepoId: String(repo.id) },
          {
            $set: updateData,
            $setOnInsert: {
              connected: false,
              connectedBy: null,
              connectedAt: null,
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      })
    );

    return syncedRepos;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.status || 500, `Failed to sync repositories from GitHub: ${error.message}`);
  }
};

/**
 * Retrieve repositories from MongoDB based on filter and query options.
 * @param {Object} [filter={}] - MongoDB query filter
 * @param {Object} [options={}] - Query options like sort, limit, skip, populate
 * @returns {Promise<Array<Object>>} Array of repository documents
 */
export const getRepositories = async (filter = {}, options = {}) => {
  try {
    const query = Repository.find(filter);

    if (options.sort) query.sort(options.sort);
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    if (options.populate) query.populate(options.populate);

    return await query.exec();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to retrieve repositories: ${error.message}`);
  }
};

/**
 * Connect a repository in MongoDB.
 * @param {string} repositoryId - MongoDB ObjectId or githubRepoId
 * @param {string} [userId] - ID of the user connecting the repository
 * @returns {Promise<Object>} Updated repository document
 */
export const connectRepository = async (repositoryId, userId = null) => {
  try {
    if (!repositoryId) {
      throw new ApiError(400, 'Repository ID is required');
    }

    const query = mongoose.Types.ObjectId.isValid(repositoryId)
      ? { $or: [{ _id: repositoryId }, { githubRepoId: String(repositoryId) }] }
      : { githubRepoId: String(repositoryId) };

    const repository = await Repository.findOne(query);

    if (!repository) {
      throw new ApiError(404, 'Repository not found');
    }

    repository.connected = true;
    if (userId) {
      repository.connectedBy = userId;
    }
    repository.connectedAt = new Date();

    await repository.save();
    return repository;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to connect repository: ${error.message}`);
  }
};

/**
 * Disconnect a repository in MongoDB.
 * @param {string} repositoryId - MongoDB ObjectId or githubRepoId
 * @param {string} [userId] - ID of the user requesting disconnection
 * @returns {Promise<Object>} Updated repository document
 */
export const disconnectRepository = async (repositoryId, userId = null) => {
  try {
    if (!repositoryId) {
      throw new ApiError(400, 'Repository ID is required');
    }

    const query = mongoose.Types.ObjectId.isValid(repositoryId)
      ? { $or: [{ _id: repositoryId }, { githubRepoId: String(repositoryId) }] }
      : { githubRepoId: String(repositoryId) };

    const repository = await Repository.findOne(query);

    if (!repository) {
      throw new ApiError(404, 'Repository not found');
    }

    repository.connected = false;
    repository.connectedBy = null;
    repository.connectedAt = null;

    await repository.save();
    return repository;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to disconnect repository: ${error.message}`);
  }
};

/**
 * Retrieve all connected repositories from MongoDB.
 * @param {string} [userId=null] - Optional user ID to filter connected repositories
 * @returns {Promise<Array<Object>>} List of connected repository documents
 */
export const getConnectedRepositories = async (userId = null) => {
  try {
    const filter = { connected: true };
    if (userId) {
      filter.connectedBy = userId;
    }

    return await Repository.find(filter).populate('connectedBy', 'name email avatar');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to retrieve connected repositories: ${error.message}`);
  }
};

export default {
  syncRepositories,
  getRepositories,
  connectRepository,
  disconnectRepository,
  getConnectedRepositories,
};
