import { PullRequest } from '../models/pullRequest.model.js';
import { Repository } from '../models/repository.model.js';

/**
 * Extract structured information from a GitHub pull_request webhook payload
 *
 * @param {Object} payload - GitHub pull_request payload
 * @returns {Object} Structured PR event information
 */
export const processPullRequest = async (payload) => {
  if (!payload || !payload.pull_request) {
    return {
      handled: false,
      ignored: true,
      event: 'pull_request',
      message: 'Invalid payload: missing pull_request object',
    };
  }

  const pr = payload.pull_request;
  const repo = payload.repository || {};
  const action = payload.action || 'opened';

  // Extract structured PR information
  const structuredData = {
    handled: true,
    event: 'pull_request',
    action,
    pullRequest: {
      githubPrId: String(pr.id),
      number: pr.number,
      title: pr.title || '',
      body: pr.body || '',
      state: pr.state || 'open',
      status: 'Pending AI Review',
      author: pr.user ? pr.user.login : 'unknown',
      sourceBranch: pr.head ? pr.head.ref : '',
      targetBranch: pr.base ? pr.base.ref : '',
      htmlUrl: pr.html_url || '',
      draft: Boolean(pr.draft),
      merged: Boolean(pr.merged),
    },
    repository: {
      githubRepoId: repo.id ? String(repo.id) : '',
      owner: repo.owner ? repo.owner.login : '',
      repoName: repo.name || '',
      fullName: repo.full_name || '',
      defaultBranch: repo.default_branch || 'main',
    },
    sender: payload.sender ? payload.sender.login : '',
  };

  // Optionally persist PR to DB if DB is active and Repository is connected
  try {
    if (repo.id) {
      const existingRepo = await Repository.findOne({ githubRepoId: String(repo.id) });
      if (existingRepo) {
        const dbPr = await PullRequest.findOneAndUpdate(
          { githubPrId: String(pr.id) },
          {
            githubPrId: String(pr.id),
            repository: existingRepo._id,
            title: pr.title || '',
            number: pr.number,
            author: pr.user ? pr.user.login : 'unknown',
            sourceBranch: pr.head ? pr.head.ref : '',
            targetBranch: pr.base ? pr.base.ref : '',
            state: pr.state || 'open',
            status: 'Pending AI Review',
          },
          { upsert: true, new: true }
        );
        structuredData.dbRecord = dbPr;
      }
    }
  } catch (err) {
    // Continue cleanly if database operations are not available in current execution context
  }

  return structuredData;
};

/**
 * Handle incoming GitHub webhook event
 *
 * @param {string|Object} event - Event type string (e.g. 'pull_request') or payload object
 * @param {Object} [payload] - GitHub webhook event payload body
 * @returns {Promise<Object>} Structured event information or ignored payload response
 */
export const processWebhookEvent = async (event, payload) => {
  let eventType = event;
  let eventPayload = payload;

  // Support single payload argument or (event, payload) positional arguments
  if (typeof event === 'object' && event !== null && !payload) {
    eventPayload = event;
    eventType = eventPayload.event || eventPayload['x-github-event'] || 'pull_request';
  }

  // Support ONLY 'pull_request' events - ignore all other events
  if (eventType !== 'pull_request') {
    return {
      handled: false,
      ignored: true,
      event: eventType,
      message: `Event '${eventType}' ignored. Only 'pull_request' events are supported.`,
    };
  }

  return await processPullRequest(eventPayload);
};

export const handleWebhookEvent = processWebhookEvent;

export default {
  processWebhookEvent,
  handleWebhookEvent,
  processPullRequest,
};
