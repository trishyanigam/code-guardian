import * as pullRequestService from '../services/pullRequest.service.js';
import { PullRequest } from '../models/pullRequest.model.js';
import { ChangedFile } from '../models/changedFile.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Fetch all pull requests with optional filtering and pagination
 * @route GET /api/v1/pull-requests
 */
export const getAllPullRequests = asyncHandler(async (req, res, next) => {
  const { repository, status, state, author, search, page, limit } = req.query;

  const filter = {};
  if (repository) filter.repository = repository;
  if (status) filter.status = status;
  if (state) filter.state = state;
  if (author) filter.author = author;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
  }

  const queryLimit = parseInt(limit, 10) || 20;
  const queryPage = parseInt(page, 10) || 1;
  const skip = (queryPage - 1) * queryLimit;

  const pullRequests = await PullRequest.find(filter)
    .populate('repository', 'repoName owner defaultBranch')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(queryLimit);

  const total = await PullRequest.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pullRequests,
        pagination: {
          total,
          page: queryPage,
          limit: queryLimit,
          pages: Math.ceil(total / queryLimit),
        },
      },
      'Pull requests retrieved successfully'
    )
  );
});

/**
 * Fetch single pull request details by ID or githubPrId
 * @route GET /api/v1/pull-requests/:id
 */
export const getPullRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let pullRequest = null;
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    pullRequest = await PullRequest.findById(id).populate('repository');
  }

  if (!pullRequest) {
    pullRequest = await PullRequest.findOne({
      $or: [{ githubPrId: String(id) }, { number: Number(id) }],
    }).populate('repository');
  }

  if (!pullRequest) {
    throw new ApiError(404, 'Pull request not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, pullRequest, 'Pull request details retrieved successfully'));
});

/**
 * Fetch changed files for a specific pull request
 * @route GET /api/v1/pull-requests/:id/files
 */
export const getChangedFiles = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let pullRequest = null;
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    pullRequest = await PullRequest.findById(id).populate('repository');
  }

  if (!pullRequest) {
    pullRequest = await PullRequest.findOne({
      $or: [{ githubPrId: String(id) }, { number: Number(id) }],
    }).populate('repository');
  }

  if (!pullRequest) {
    throw new ApiError(404, 'Pull request not found');
  }

  let files = await ChangedFile.find({ pullRequest: pullRequest._id });

  // If no files stored in DB yet, attempt to fetch using pullRequestService
  if ((!files || files.length === 0) && pullRequest.repository) {
    try {
      const accessToken =
        req.headers['x-github-token'] ||
        req.query.accessToken ||
        process.env.GITHUB_TOKEN;

      if (accessToken) {
        const repo = pullRequest.repository;
        const fetchedFiles = await pullRequestService.fetchChangedFiles({
          owner: repo.owner,
          repo: repo.repoName,
          pullNumber: pullRequest.number,
          accessToken,
        });

        if (fetchedFiles && fetchedFiles.length > 0) {
          files = await pullRequestService.saveChangedFiles(pullRequest._id, fetchedFiles);
        }
      }
    } catch (fetchErr) {
      // Continue and return existing array if GitHub API fails
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, files || [], 'Changed files retrieved successfully'));
});

export default {
  getAllPullRequests,
  getPullRequest,
  getChangedFiles,
};
