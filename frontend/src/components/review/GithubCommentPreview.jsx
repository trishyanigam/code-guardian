import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Bot,
  MessageSquare,
} from 'lucide-react';

const DEFAULT_MARKDOWN_SAMPLE = `# 🛡️ Code Guardian AI - Security & Code Quality Audit

### 📊 Audit Scores
| Metric | Score | Status |
| :--- | :--- | :--- |
| 🛡️ **Overall Score** | **88 / 100** | 🟢 Good |
| 🔒 **Security** | **92 / 100** | 🟢 Excellent |
| ⚡ **Performance** | **85 / 100** | 🟢 Good |
| 📖 **Readability** | **88 / 100** | 🟢 Good |
| 🔧 **Maintainability** | **84 / 100** | 🟡 Acceptable |

---

### 📝 Executive Summary
The pull request successfully updates JWT signature verification to enforce RS256 algorithm validation and fixes potential algorithm downgrade vulnerabilities.

---

### ⚠️ Detected Issues & Vulnerabilities
#### 1. 🔴 **[HIGH]** JWT Secret Fallback Hardcoded String in Non-Production Mode
- **File:** \`backend/src/middleware/auth.middleware.js\` (Line 30)
- **Details:** A default fallback secret string is used when process.env.JWT_SECRET is undefined.
> **Recommendation:** Enforce mandatory process.env.JWT_SECRET validation on server bootstrap.

---

### 💡 Refactoring & Code Suggestions
#### 1. \`backend/src/middleware/auth.middleware.js\`
**Explicitly specify algorithms array in jwt.verify call**
Pass algorithms: ["RS256", "HS256"] explicitly to prevent algorithm confusion attacks.

\`\`\`javascript
// Recommended Fix:
const decoded = jwt.verify(token, JWT_SECRET, {
  algorithms: ['HS256', 'RS256'],
  issuer: 'code-guardian-auth'
});
\`\`\`

---

> 🛡️ *Audited automatically by **[Code Guardian AI](https://github.com/trishyanigam/code-guardian)** — Real-time AI Code Security & PR Review Engine.*`;

/**
 * Simple parser to render basic markdown elements (Headers, Tables, Codeblocks, Quotes, Lists, Badges)
 */
const renderSimpleMarkdown = (markdownText) => {
  if (!markdownText) return null;

  const lines = markdownText.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let inTable = false;
  let tableRows = [];

  const flushCodeBlock = (key) => {
    if (codeBuffer.length > 0) {
      elements.push(
        <div key={key} className="my-3 rounded-lg bg-[#161b22] border border-[#30363d] p-3.5 overflow-x-auto font-mono text-xs text-[#e6edf3]">
          <pre>{codeBuffer.join('\n')}</pre>
        </div>
      );
      codeBuffer = [];
    }
  };

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const bodyRows = tableRows.slice(2); // Skip separator row

      elements.push(
        <div key={key} className="my-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse border border-[#30363d]">
            <thead>
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                {headers.map((h, i) => (
                  <th key={i} className="p-2.5 font-semibold text-[#c9d1d9] border-r border-[#30363d]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-[#30363d] hover:bg-[#161b22]/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 text-[#8b949e] border-r border-[#30363d]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  lines.forEach((line, idx) => {
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCodeBlock(`code-${idx}`);
      } else {
        if (inTable) {
          inTable = false;
          flushTable(`table-${idx}`);
        }
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Table rows
    if (line.trim().startsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      tableRows.push(cells);
      return;
    } else if (inTable) {
      inTable = false;
      flushTable(`table-${idx}`);
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={idx} className="text-lg font-bold text-[#c9d1d9] mt-4 mb-2 pb-1 border-b border-[#30363d]">{line.replace('# ', '')}</h1>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={idx} className="text-sm font-bold text-[#c9d1d9] mt-4 mb-2">{line.replace('### ', '')}</h3>);
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={idx} className="text-xs font-semibold text-[#c9d1d9] mt-3 mb-1">{line.replace('#### ', '')}</h4>);
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={idx} className="my-2 border-l-4 border-[#30363d] pl-3 py-1 text-xs text-[#8b949e] bg-[#161b22]/30 rounded-r">
          {line.replace('> ', '')}
        </blockquote>
      );
    } else if (line.trim() === '---') {
      elements.push(<hr key={idx} className="my-4 border-[#30363d]" />);
    } else if (line.trim().length > 0) {
      elements.push(
        <p key={idx} className="my-1.5 text-xs text-[#c9d1d9] leading-relaxed">
          {line}
        </p>
      );
    }
  });

  if (inTable) flushTable('table-end');
  if (inCodeBlock) flushCodeBlock('code-end');

  return elements;
};

/**
 * GithubCommentPreview Component
 * Renders GitHub comment UI container showing exact markdown preview as it appears on GitHub.
 *
 * @param {Object} props
 * @param {string} [props.markdown] - Markdown text string
 * @param {Object} [props.commentData] - Comment metadata (author, commentUrl, timestamp)
 * @param {string} [props.className]
 */
export const GithubCommentPreview = ({
  markdown = DEFAULT_MARKDOWN_SAMPLE,
  commentData = {},
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const authorName = commentData.author || 'code-guardian[bot]';
  const timestamp = commentData.timestamp || 'commented just now';
  const commentUrl = commentData.commentUrl || 'https://github.com';

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label & Actions Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5 font-semibold text-gray-200">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>GitHub Comment Preview</span>
        </span>

        <button
          onClick={handleCopyMarkdown}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 text-xs font-mono transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied Markdown</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Copy Raw Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* GitHub Dark Theme Comment Box Container */}
      <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-2xl font-sans">
        {/* GitHub Comment Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs">
          <div className="flex items-center gap-2">
            {/* Bot Avatar */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white p-1 shadow">
              <Bot className="w-3.5 h-3.5" />
            </div>

            {/* Username & Bot Badge */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#c9d1d9]">{authorName}</span>
              <span className="px-1.5 py-0.2 rounded border border-[#30363d] text-[10px] font-mono text-[#8b949e] font-medium bg-[#21262d]">
                bot
              </span>
            </div>

            <span className="text-[#8b949e]">{timestamp}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] font-mono text-[#8b949e] bg-[#21262d]">
              Owner
            </span>
            {commentUrl && (
              <a
                href={commentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                title="View on GitHub"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* GitHub Comment Body (Read-only Markdown Content) */}
        <div className="p-5 select-text text-[#c9d1d9]">
          {renderSimpleMarkdown(markdown)}
        </div>
      </div>
    </div>
  );
};

export default GithubCommentPreview;
