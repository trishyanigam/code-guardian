import { CodingRule } from '../../models/codingRule.model.js';

/**
 * Build a detailed system & user prompt for AI code review analysis.
 * Fetches enabled custom organization coding rules if an organization ID is provided.
 *
 * @param {Object|string} pullRequestOrOptions - Pull Request metadata object or options object
 * @param {Array<Object>} [changedFilesParam] - Array of changed file objects
 * @param {Array<Object|string>|string} [rulesParam] - Custom repository rules or guidelines
 * @returns {Promise<string>} Detailed prompt string instructing the AI to return ONLY valid JSON
 */
export const buildReviewPrompt = async (pullRequestOrOptions, changedFilesParam, rulesParam) => {
  let pullRequest = pullRequestOrOptions;
  let changedFiles = changedFilesParam;
  let rules = rulesParam;
  let organizationId = null;

  if (typeof pullRequestOrOptions === 'object' && pullRequestOrOptions !== null && !changedFilesParam) {
    if (pullRequestOrOptions.pullRequest || pullRequestOrOptions.changedFiles) {
      pullRequest = pullRequestOrOptions.pullRequest || {};
      changedFiles = pullRequestOrOptions.changedFiles || [];
      rules = pullRequestOrOptions.rules || pullRequestOrOptions.repositoryRules || [];
      organizationId =
        pullRequestOrOptions.organizationId ||
        pullRequestOrOptions.organization ||
        pullRequest?.repository?.organization ||
        null;
    }
  }

  pullRequest = pullRequest || {};
  changedFiles = Array.isArray(changedFiles) ? changedFiles : [];

  // Fetch enabled coding rules from MongoDB if organizationId is available
  let dbRules = [];
  if (organizationId) {
    try {
      dbRules = await CodingRule.find({ organization: organizationId, enabled: true }).lean();
    } catch (err) {
      // Safe fallback if DB is disconnected in isolated tests
    }
  }

  // Combine passed rules and DB rules
  let combinedRules = [];
  if (Array.isArray(rules) && rules.length > 0) {
    combinedRules = [...rules];
  }
  if (dbRules.length > 0) {
    combinedRules = [...combinedRules, ...dbRules];
  }

  // Format custom organization rules
  let formattedRules = '';
  if (combinedRules.length > 0) {
    formattedRules = combinedRules
      .map((r, i) => {
        if (typeof r === 'object' && r !== null) {
          const ruleTitle = r.title || `Rule #${i + 1}`;
          const ruleDesc = r.description || '';
          const ruleCat = r.category || 'General';
          const ruleSev = r.severity || 'medium';
          const good = r.exampleGood ? `\n   Compliant Pattern: ${r.exampleGood}` : '';
          const bad = r.exampleBad ? `\n   Non-Compliant Pattern: ${r.exampleBad}` : '';
          return `${i + 1}. [${ruleCat.toUpperCase()} / ${ruleSev.toUpperCase()}] ${ruleTitle}: ${ruleDesc}${good}${bad}`;
        }
        return `${i + 1}. ${r}`;
      })
      .join('\n\n');
  } else if (typeof rules === 'string') {
    formattedRules = rules;
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

### MANDATORY ORGANIZATION CODING RULES & SECURITY GUIDELINES
${formattedRules ? formattedRules : 'Standard OWASP security best practices, clean code principles, and performance guidelines apply.'}

### CHANGED FILES & CODE DIFFS
${filesDiffText || 'No code changes provided.'}

### INSTRUCTIONS FOR REVIEW
1. Evaluate every changed file against OWASP security guidelines and the MANDATORY Organization Coding Rules listed above.
2. For EVERY issue or rule violation detected, explicitly classify the violation (include the specific Rule Title, Category, and Severity in the issue title/description).
3. Identify Security Vulnerabilities (SQL injection, XSS, insecure auth, secret exposure).
4. Detect Bugs, Logic Errors, and Performance Bottlenecks.
5. Provide actionable code fix recommendations.

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
      "category": "Security / Organization Rule",
      "title": "[Rule Violation / Issue Title]",
      "description": "Clear explanation of the problem and rule violation.",
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
