import { verifyGithubSignature } from '../utils/githubSignature.js';
import { savePullRequest, saveChangedFiles, fetchChangedFiles } from '../services/pullRequest.service.js';
import { Repository } from '../models/repository.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Handle incoming GitHub Webhook events
 * @route POST /api/v1/webhooks/github
 */
export const handleGithubWebhook = asyncHandler(async (req, res, next) => {
  // 1. Verify Webhook Signature if header or secret is present
  const signatureHeader =
    req.headers['x-hub-signature-256'] ||
    req.headers['x-hub-signature'] ||
    req.headers['X-Hub-Signature-256'] ||
    req.headers['X-Hub-Signature'];

  if (signatureHeader || process.env.GITHUB_WEBHOOK_SECRET) {
    const isValidSignature = verifyGithubSignature(req);
    if (!isValidSignature) {
      throw new ApiError(401, 'Invalid GitHub webhook signature');
    }
  }

  // 2. Read GitHub Event
  const event =
    req.headers['x-github-event'] ||
    req.headers['X-GitHub-Event'] ||
    req.body?.event ||
    'pull_request';

  // 3. Support only pull_request events - ignore all other events
  if (event !== 'pull_request') {
    return res.status(200).json(
      new ApiResponse(
        200,
        { ignored: true, event },
        `Event '${event}' received and ignored. Only 'pull_request' events are supported.`
      )
    );
  }

  const payload = req.body || {};
  const pr = payload.pull_request;

  if (!pr) {
    throw new ApiError(400, 'Invalid webhook payload: missing pull_request object');
  }

  const repoPayload = payload.repository || {};

  // Find or create connected repository record
  let repositoryDoc = null;
  if (repoPayload.id || repoPayload.name) {
    repositoryDoc = await Repository.findOne({
      $or: [
        { githubRepoId: String(repoPayload.id) },
        { owner: repoPayload.owner?.login, repoName: repoPayload.name },
      ],
    });

    if (!repositoryDoc && repoPayload.id) {
      repositoryDoc = await Repository.create({
        githubRepoId: String(repoPayload.id),
        owner: repoPayload.owner?.login || '',
        repoName: repoPayload.name || '',
        description: repoPayload.description || '',
        visibility: repoPayload.private ? 'private' : 'public',
        language: repoPayload.language || '',
        defaultBranch: repoPayload.default_branch || 'main',
        cloneUrl: repoPayload.clone_url || '',
        htmlUrl: repoPayload.html_url || '',
      });
    }
  }

  // 4. Store PR
  const prData = {
    githubPrId: String(pr.id),
    repository: repositoryDoc ? repositoryDoc._id : repoPayload.id || 'unknown',
    title: pr.title || '',
    number: Number(pr.number),
    author: pr.user ? pr.user.login : 'unknown',
    sourceBranch: pr.head ? pr.head.ref : '',
    targetBranch: pr.base ? pr.base.ref : '',
    state: pr.state || 'open',
    status: 'Pending AI Review',
  };

  const savedPullRequest = await savePullRequest(prData);

  // 5. Store Changed Files
  let changedFiles = [];
  try {
    if (Array.isArray(payload.files)) {
      changedFiles = payload.files;
    } else if (repoPayload.owner?.login && repoPayload.name) {
      const accessToken =
        req.headers['x-github-token'] ||
        process.env.GITHUB_TOKEN ||
        process.env.GITHUB_ACCESS_TOKEN;

      changedFiles = await fetchChangedFiles({
        owner: repoPayload.owner.login,
        repo: repoPayload.name,
        pullNumber: pr.number,
        accessToken,
      });
    }
  } catch (err) {
    changedFiles = Array.isArray(payload.changed_files) ? payload.changed_files : [];
  }

  const savedFiles = await saveChangedFiles(savedPullRequest._id, changedFiles);

  // 6. Return success JSON (Do not implement AI review)
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pullRequest: savedPullRequest,
        changedFiles: savedFiles,
      },
      'Webhook processed successfully. Pull request and changed files saved.'
    )
  );
});

export default {
  handleGithubWebhook,
};
