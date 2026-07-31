export const APP_NAME = 'CodeGuardian AI';
export const APP_TAGLINE = 'AI-Powered Code Security & Automated Code Review Guard';

export const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'AI PR Review', href: '#ai-review' },
  { name: 'Analytics', href: '#analytics' },
  { name: 'Workflow', href: '#workflow' },
];

export const PR_DIFF_MOCK = {
  prNumber: 402,
  prTitle: 'feat: add user authentication and database profile lookup',
  author: 'dev-engineer',
  branch: 'feature/auth-lookup',
  targetBranch: 'main',
  files: [
    {
      id: 'db-query',
      filename: 'src/db/query.ts',
      status: 'modified',
      changes: '+12 -4',
      diffLines: [
        { type: 'normal', oldLine: 14, newLine: 14, content: 'export async function getUserRecord(userId: string) {' },
        { type: 'normal', oldLine: 15, newLine: 15, content: '  const db = await getDatabaseConnection();' },
        { type: 'remove', oldLine: 16, newLine: null, content: '  // Unsanitized concatenation' },
        { type: 'remove', oldLine: 17, newLine: null, content: '  const query = "SELECT * FROM users WHERE id = \'" + userId + "\'";' },
        { type: 'remove', oldLine: 18, newLine: null, content: '  return await db.query(query);' },
        { type: 'add', oldLine: null, newLine: 16, content: '  // Parameterized database execution' },
        { type: 'add', oldLine: null, newLine: 17, content: '  const query = "SELECT * FROM users WHERE id = $1";' },
        { type: 'add', oldLine: null, newLine: 18, content: '  return await db.query(query, [userId]);' },
        { type: 'normal', oldLine: 19, newLine: 19, content: '}' },
      ],
      comment: {
        line: 17,
        severity: 'CRITICAL',
        cwe: 'CWE-89 (SQL Injection)',
        title: 'SQL Injection Vulnerability Detected',
        author: 'CodeGuardian AI Guard Bot',
        timestamp: 'Just now',
        description: 'Direct string concatenation allows unauthenticated SQL injection. User input `userId` can alter query execution control flow.',
        fixSnippet: `const query = "SELECT * FROM users WHERE id = $1";\nreturn await db.query(query, [userId]);`,
        automatedPatchAvailable: true,
      },
    },
    {
      id: 'auth-jwt',
      filename: 'src/auth/jwt.ts',
      status: 'modified',
      changes: '+8 -2',
      diffLines: [
        { type: 'normal', oldLine: 5, newLine: 5, content: 'import jwt from "jsonwebtoken";' },
        { type: 'remove', oldLine: 6, newLine: null, content: 'const JWT_SECRET = "super_secret_hardcoded_key_123";' },
        { type: 'add', oldLine: null, newLine: 6, content: 'const JWT_SECRET = process.env.JWT_SECRET_KEY!;' },
        { type: 'normal', oldLine: 7, newLine: 7, content: 'export function verifySession(token: string) {' },
        { type: 'normal', oldLine: 8, newLine: 8, content: '  return jwt.verify(token, JWT_SECRET);' },
        { type: 'normal', oldLine: 9, newLine: 9, content: '}' },
      ],
      comment: {
        line: 6,
        severity: 'HIGH',
        cwe: 'CWE-798 (Hardcoded Secret)',
        title: 'Hardcoded Cryptographic Key Detected',
        author: 'CodeGuardian AI Guard Bot',
        timestamp: '2 mins ago',
        description: 'Secrets in source code can leak in version control history. Move to environment variables.',
        fixSnippet: `const JWT_SECRET = process.env.JWT_SECRET_KEY!;`,
        automatedPatchAvailable: true,
      },
    },
  ],
};

export const BENTO_FEATURES = [
  {
    id: 'ast-llm-scanner',
    size: 'lg', // Spans 2 cols on desktop
    title: 'Deterministic AST + LLM Hybrid Analysis',
    subtitle: 'Zero false-positives static analysis',
    description: 'Combines abstract syntax tree parsing with context-aware security LLMs to detect complex OWASP vulnerabilities without noisy alerts.',
    badge: 'Core Engine',
    metric: '99.9% Accuracy',
  },
  {
    id: 'pr-guard-bot',
    size: 'md',
    title: 'Automated GitHub PR Guard Bot',
    subtitle: 'Line-by-line security review',
    description: 'Posts actionable security reviews and click-to-apply fix pull requests directly inside GitHub Actions & GitLab CI.',
    badge: 'DevSecOps',
    metric: '10x Faster Reviews',
  },
  {
    id: 'dependency-shield',
    size: 'md',
    title: 'Supply Chain Package Guard',
    subtitle: 'Real-time CVE & Typosquatting',
    description: 'Inspects npm, PyPI, Maven, and Cargo dependency manifests for zero-day vulnerabilities and malicious packages.',
    badge: 'Supply Chain',
    metric: '1.4M Packages Monitored',
  },
  {
    id: 'compliance-engine',
    size: 'lg', // Spans 2 cols on desktop
    title: 'Instant SOC2 & ISO 27001 Audit Reports',
    subtitle: 'Automated compliance verification',
    description: 'Generates real-time compliance audit logs and executive summaries to satisfy security compliance auditors instantly.',
    badge: 'Enterprise Trust',
    metric: '100% Audit Ready',
  },
  {
    id: 'zero-knowledge',
    size: 'md',
    title: 'Zero Code Retention Guarantee',
    subtitle: 'Strict enterprise privacy',
    description: 'Your code is analyzed in-memory and immediately discarded. Never trained on public or private models.',
    badge: 'Privacy First',
    metric: 'SOC2 Type II Certified',
  },
  {
    id: 'custom-rules',
    size: 'md',
    title: 'Custom Security Rules Engine',
    subtitle: 'Semgrep & Regex support',
    description: 'Define organization-wide security policies using declarative YAML or Semgrep rules with custom severity levels.',
    badge: 'Customizable',
    metric: 'Custom Rulesets',
  },
];

export const ANALYTICS_DATA = {
  metrics: [
    { label: 'Mean Time to Remediate (MTTR)', value: '14 Mins', change: '-85% reduction', positive: true },
    { label: 'PR Security Review Time', value: '45 Secs', change: '10x faster', positive: true },
    { label: 'Vulnerabilities Blocked in CI/CD', value: '42,890+', change: 'This Month', positive: true },
    { label: 'Zero-Day Vulnerability Alerts', value: '< 1 Min', change: 'Instant Alerting', positive: true },
  ],
  severityDistribution: [
    { type: 'Critical (SQLi / RCE)', percentage: 12, count: 142, color: '#f43f5e' },
    { type: 'High (Auth / Secrets)', percentage: 28, count: 320, color: '#fb923c' },
    { type: 'Medium (XSS / CORS)', percentage: 42, count: 490, color: '#eab308' },
    { type: 'Low (Code Smells)', percentage: 18, count: 210, color: '#3b82f6' },
  ],
  monthlyTrend: [
    { month: 'Jan', traditionalMTTR: 72, codeGuardianMTTR: 18 },
    { month: 'Feb', traditionalMTTR: 68, codeGuardianMTTR: 16 },
    { month: 'Mar', traditionalMTTR: 64, codeGuardianMTTR: 15 },
    { month: 'Apr', traditionalMTTR: 58, codeGuardianMTTR: 14 },
    { month: 'May', traditionalMTTR: 55, codeGuardianMTTR: 14 },
    { month: 'Jun', traditionalMTTR: 50, codeGuardianMTTR: 12 },
  ],
};
