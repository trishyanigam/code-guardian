/**
 * Build a detailed system & user prompt for AI code review analysis.
 *
 * @param {Object|string} pullRequestOrOptions - Pull Request metadata object or options object
 * @param {Array<Object>} [changedFilesParam] - Array of changed file objects
 * @param {Array<string>|string|Object} [rulesParam] - Custom repository rules or guidelines
 * @returns {string} Detailed prompt string instructing the AI to return ONLY valid JSON
 */
export const buildReviewPrompt = (pullRequestOrOptions, changedFilesParam, rulesParam) => {
  let pullRequest = pullRequestOrOptions;
  let changedFiles = changedFilesParam;
  let rules = rulesParam;

  if (typeof pullRequestOrOptions === 'object' && pullRequestOrOptions !== null && !changedFilesParam) {
    if (pullRequestOrOptions.pullRequest || pullRequestOrOptions.changedFiles) {
      pullRequest = pullRequestOrOptions.pullRequest || {};
      changedFiles = pullRequestOrOptions.changedFiles || [];
      rules = pullRequestOrOptions.rules || pullRequestOrOptions.repositoryRules || [];
    }
  }

  pullRequest = pullRequest || {};
  changedFiles = Array.isArray(changedFiles) ? changedFiles : [];

  let formattedRules = '';
  if (Array.isArray(rules)) {
    formattedRules = rules.map((r, i) => `${i + 1}. ${r}`).join('\n');
  } else if (typeof rules === 'string') {
    formattedRules = rules;
  } else if (rules && typeof rules === 'object') {
    formattedRules = JSON.stringify(rules, null, 2);
  }

  // Format changed files diffs
  const filesDiffText = changedFiles
    .map((file, index) => {
      const filename = file.filename || file.path || `file_${index + 1}`;
      const status = file.status || 'modified';
      const additions = file.additions !== undefined ? file.additions : 0;
      const deletions = file.deletions !== undefined ? file.deletions : 0;
      const patch = file.patch || file.content || 'No patch available';

      return `=== FILE ${index + 1}: ${filename} (${status}, +${additions} -${deletions}) ===\n${patch}\n`;
    })
    .join('\n');

  const prTitle = pullRequest.title || 'Untitled Pull Request';
  const prNumber = pullRequest.number ? `#${pullRequest.number}` : '';
  const prAuthor = pullRequest.author || 'Unknown';
  const prBranch = `${pullRequest.sourceBranch || 'head'} -> ${pullRequest.targetBranch || 'main'}`;

  const prompt = `You are Code Guardian, an expert senior AI Code Reviewer & Application Security Engineer.
Your job is to perform a comprehensive code review and security audit on the following Pull Request code changes.

### PULL REQUEST METADATA
- Title: ${prTitle} ${prNumber}
- Author: ${prAuthor}
- Branch: ${prBranch}

### REPOSITORY RULES & SECURITY GUIDELINES
${formattedRules ? formattedRules : 'Standard OWASP security best practices, clean code principles, and performance guidelines apply.'}

### CHANGED FILES & CODE DIFFS
${filesDiffText || 'No code changes provided.'}

### INSTRUCTIONS FOR REVIEW
Analyze the code diffs for:
1. Security Vulnerabilities (SQL injection, XSS, insecure auth, secret exposure, OWASP Top 10)
2. Bugs & Logic Errors (null pointer exceptions, race conditions, edge case failures)
3. Performance Bottlenecks & Optimization Opportunities
4. Code Quality, Maintainability, and Readability

### REQUIRED OUTPUT FORMAT
CRITICAL REQUIREMENT: You MUST respond ONLY with valid JSON. Do not include markdown codeblocks (do NOT use \`\`\`json or \`\`\`), do not include conversational text before or after the JSON.

Your response must strictly match this exact JSON schema structure:
{
  "overallScore": 85,
  "securityScore": 90,
  "performanceScore": 80,
  "readabilityScore": 85,
  "maintainabilityScore": 85,
  "summary": "Detailed executive summary of the code review findings.",
  "issues": [
    {
      "filename": "path/to/file.ext",
      "line": 15,
      "severity": "critical",
      "title": "Short issue title",
      "description": "Clear explanation of the problem.",
      "suggestion": "Specific code or architectural recommendation."
    }
  ],
  "suggestions": [
    {
      "filename": "path/to/file.ext",
      "suggestion": "General improvement recommendation",
      "patch": "Suggested code snippet"
    }
  ]
}`;

  return prompt;
};

export default {
  buildReviewPrompt,
};
