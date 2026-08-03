import { Octokit } from '@octokit/rest';
import { PullRequest } from '../models/pullRequest.model.js';
import { ChangedFile } from '../models/changedFile.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Fetch changed files for a pull request from GitHub API using Octokit.
 *
 * @param {string|Object} ownerOrOptions - Repo owner string or options object
 * @param {string} [repo] - Repository name
 * @param {number|string} [pullNumber] - Pull request number
 * @param {string} [accessToken] - GitHub personal access token / OAuth token
 * @returns {Promise<Array<Object>>} Array of changed file details
 */
export const fetchChangedFiles = async (ownerOrOptions, repo, pullNumber, accessToken) => {
  try {
    let ownerStr = ownerOrOptions;
    let repoStr = repo;
    let prNum = pullNumber;
    let token = accessToken;

    if (typeof ownerOrOptions === 'object' && ownerOrOptions !== null) {
      ownerStr = ownerOrOptions.owner;
      repoStr = ownerOrOptions.repo || ownerOrOptions.repoName;
      prNum = ownerOrOptions.pullNumber || ownerOrOptions.number || ownerOrOptions.pull_number;
      token = ownerOrOptions.accessToken || ownerOrOptions.token;
    }

    if (!ownerStr || !repoStr || !prNum) {
      throw new ApiError(400, 'Owner, repository name, and pull request number are required to fetch changed files');
    }

    const octokit = new Octokit(token ? { auth: token } : {});

    const { data } = await octokit.rest.pulls.listFiles({
      owner: ownerStr,
      repo: repoStr,
      pull_number: Number(prNum),
      per_page: 100,
    });

    return data.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch || '',
      rawUrl: file.raw_url || file.blob_url || '',
    }));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.status || 500, `Failed to fetch changed files from GitHub: ${error.message}`);
  }
};

/**
 * Save or update a pull request in MongoDB.
 *
 * @param {Object} prData - Pull request properties
 * @returns {Promise<Object>} Saved PullRequest document
 */
export const savePullRequest = async (prData) => {
  if (!prData) {
    throw new ApiError(400, 'Pull request data is required');
  }

  const {
    githubPrId,
    repository,
    title,
    number,
    author,
    sourceBranch,
    targetBranch,
    state = 'open',
    status = 'Pending AI Review',
  } = prData;

  if (!githubPrId || !repository || !number) {
    throw new ApiError(400, 'githubPrId, repository ID, and PR number are required to save pull request');
  }

  const filter = { githubPrId: String(githubPrId) };
  const updateData = {
    githubPrId: String(githubPrId),
    repository,
    title,
    number: Number(number),
    author,
    sourceBranch,
    targetBranch,
    state,
    status,
  };

  const pullRequest = await PullRequest.findOneAndUpdate(filter, updateData, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  return pullRequest;
};

/**
 * Save changed files associated with a pull request into MongoDB.
 *
 * @param {string|Object} pullRequestIdOrOptions - PullRequest ObjectId or options object
 * @param {Array<Object>} [filesData] - Array of changed file objects
 * @returns {Promise<Array<Object>>} Saved ChangedFile documents
 */
export const saveChangedFiles = async (pullRequestIdOrOptions, filesData) => {
  let pullRequestId = pullRequestIdOrOptions;
  let files = filesData;

  if (typeof pullRequestIdOrOptions === 'object' && pullRequestIdOrOptions !== null && !Array.isArray(pullRequestIdOrOptions)) {
    pullRequestId = pullRequestIdOrOptions.pullRequestId || pullRequestIdOrOptions.pullRequest;
    files = pullRequestIdOrOptions.files || pullRequestIdOrOptions.changedFiles;
  }

  if (!pullRequestId || !Array.isArray(files)) {
    throw new ApiError(400, 'Pull Request ID and files array are required to save changed files');
  }

  // Remove existing changed files for this PR to ensure clean updates
  await ChangedFile.deleteMany({ pullRequest: pullRequestId });

  if (files.length === 0) {
    return [];
  }

  const docsToInsert = files.map((file) => ({
    pullRequest: pullRequestId,
    filename: file.filename,
    status: file.status || 'modified',
    additions: file.additions || 0,
    deletions: file.deletions || 0,
    changes: file.changes || (file.additions || 0) + (file.deletions || 0),
    patch: file.patch || '',
    rawUrl: file.rawUrl || file.raw_url || '',
  }));

  const savedFiles = await ChangedFile.insertMany(docsToInsert);
  return savedFiles;
};

export default {
  savePullRequest,
  saveChangedFiles,
  fetchChangedFiles,
};
