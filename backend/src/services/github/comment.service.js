import { Octokit } from '@octokit/rest';
import { GithubComment } from '../../models/githubComment.model.js';
import { ApiError } from '../../utils/ApiError.js';

const BOT_SIGNATURE = 'Code Guardian AI';

/**
 * Initialize Octokit client
 */
const getOctokit = (accessToken) => {
  const token = accessToken || process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  if (!token) {
    throw new ApiError(400, 'GitHub access token is required for comment operations');
  }
  return new Octokit({ auth: token });
};

/**
 * Find existing bot review comment on a pull request / issue.
 *
 * @param {Object} options - { owner, repo, pullNumber, issue_number, accessToken }
 * @returns {Promise<Object|null>} GitHub comment object or null
 */
export const findExistingComment = async ({ owner, repo, pullNumber, issue_number, accessToken }) => {
  try {
    const prNumber = pullNumber || issue_number;
    if (!owner || !repo || !prNumber) {
      throw new ApiError(400, 'Owner, repository name, and PR number are required');
    }

    const octokit = getOctokit(accessToken);
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: Number(prNumber),
      per_page: 100,
    });

    const botComments = comments.filter(
      (c) => c.body && c.body.includes(BOT_SIGNATURE)
    );

    return botComments.length > 0 ? botComments[0] : null;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.status || 500, `Failed to search GitHub comments: ${error.message}`);
  }
};

/**
 * Update an existing GitHub review comment.
 *
 * @param {Object} options - { owner, repo, comment_id, body, accessToken }
 * @returns {Promise<Object>} Updated GitHub comment response
 */
export const updateComment = async ({ owner, repo, comment_id, body, accessToken }) => {
  try {
    if (!owner || !repo || !comment_id || !body) {
      throw new ApiError(400, 'Owner, repository name, comment_id, and body are required');
    }

    const octokit = getOctokit(accessToken);
    const { data: updatedComment } = await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: Number(comment_id),
      body,
    });

    // Update MongoDB comment record if present
    try {
      await GithubComment.findOneAndUpdate(
        { githubCommentId: String(updatedComment.id) },
        {
          commentUrl: updatedComment.html_url,
          lastUpdated: new Date(),
          status: 'updated',
        }
      );
    } catch (dbErr) {
      // Continue if DB is offline or record missing
    }

    return updatedComment;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.status || 500, `Failed to update GitHub comment: ${error.message}`);
  }
};

/**
 * Post a new review comment or update existing comment & delete duplicates.
 *
 * @param {Object} options - { owner, repo, pullNumber, issue_number, body, accessToken, pullRequestId, repositoryId }
 * @returns {Promise<Object>} GitHub comment result
 */
export const postComment = async ({
  owner,
  repo,
  pullNumber,
  issue_number,
  body,
  accessToken,
  pullRequestId,
  repositoryId,
}) => {
  try {
    const prNumber = pullNumber || issue_number;
    if (!owner || !repo || !prNumber || !body) {
      throw new ApiError(400, 'Owner, repository, pullNumber, and body are required to post comment');
    }

    const octokit = getOctokit(accessToken);

    // List all existing comments on PR
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: Number(prNumber),
      per_page: 100,
    });

    const matchingComments = comments.filter(
      (c) => c.body && c.body.includes(BOT_SIGNATURE)
    );

    let primaryComment = null;

    if (matchingComments.length > 0) {
      // Update first matching comment
      primaryComment = matchingComments[0];
      const { data: updated } = await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: primaryComment.id,
        body,
      });
      primaryComment = updated;

      // Delete any duplicate bot comments if more than 1 exist
      if (matchingComments.length > 1) {
        const duplicates = matchingComments.slice(1);
        for (const dup of duplicates) {
          try {
            await octokit.rest.issues.deleteComment({
              owner,
              repo,
              comment_id: dup.id,
            });
          } catch (delErr) {
            // Ignore error if comment was already deleted
          }
        }
      }
    } else {
      // Create new comment
      const { data: created } = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: Number(prNumber),
        body,
      });
      primaryComment = created;
    }

    // Save/Upsert GitHub comment ID and details in MongoDB
    if (pullRequestId && repositoryId) {
      try {
        await GithubComment.findOneAndUpdate(
          { githubCommentId: String(primaryComment.id) },
          {
            pullRequest: pullRequestId,
            githubCommentId: String(primaryComment.id),
            repository: repositoryId,
            commentUrl: primaryComment.html_url,
            lastUpdated: new Date(),
            status: 'posted',
          },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        // Safe continuation if DB is disconnected in unit tests
      }
    }

    return primaryComment;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.status || 500, `Failed to post GitHub review comment: ${error.message}`);
  }
};

export default {
  findExistingComment,
  updateComment,
  postComment,
};
