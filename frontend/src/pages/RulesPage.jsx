import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  X,
  Code2,
  Check,
} from 'lucide-react';

const MOCK_RULES = [
  {
    id: 'rule-1',
    title: 'Mandatory RS256 Algorithm Verification for JWT Tokens',
    description: 'All JWT verification calls must explicitly pass algorithms: ["RS256", "HS256"] to prevent algorithm downgrade attacks.',
    category: 'Security',
    severity: 'high',
    enabled: true,
    exampleGood: `jwt.verify(token, JWT_SECRET, { algorithms: ['RS256'] });`,
    exampleBad: `jwt.verify(token, JWT_SECRET); // Missing algorithm enforcement!`,
  },
  {
    id: 'rule-2',
    title: 'Constant-Time Comparison for Cryptographic Hashes',
    description: 'Always check buffer byte lengths before invoking crypto.timingSafeEqual to prevent length-mismatch exceptions.',
    category: 'Security',
    severity: 'critical',
    enabled: true,
    exampleGood: `if (expected.length === actual.length && crypto.timingSafeEqual(expected, actual))`,
    exampleBad: `crypto.timingSafeEqual(expected, actual); // Crashes if lengths differ`,
  },
  {
    id: 'rule-3',
    title: 'Batch Bulk Write Database Operations in Loops',
    description: 'Avoid executing individual MongoDB delete or insert queries sequentially inside loops. Batch into a single bulkWrite.',
    category: 'Performance',
    severity: 'medium',
    enabled: true,
    exampleGood: `await Model.bulkWrite(operations);`,
    exampleBad: `for (const item of items) { await Model.create(item); }`,
  },
  {
    id: 'rule-4',
    title: 'Strict Parameter Schema Validation on Endpoint Inputs',
    description: 'Validate all request body fields using express-validator or Zod before invoking controller logic.',
    category: 'Readability',
    severity: 'low',
    enabled: false,
    exampleGood: `validate([body('email').isEmail()]);`,
    exampleBad: `const email = req.body.email; // Unchecked input`,
  },
  {
    id: 'rule-5',
    title: 'Sanitize and Escape User Input for Database Queries',
    description: 'Prevent NoSQL and SQL injection by sanitizing object query inputs.',
    category: 'Security',
    severity: 'critical',
    enabled: true,
    exampleGood: `User.findOne({ email: String(email) });`,
    exampleBad: `User.findOne({ email: req.body.email }); // Injection risk`,
  },
];

const getSeverityBadge = (severity = '') => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return {
        label: 'Critical',
        className: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10',
        icon: <ShieldAlert className="w-3.5 h-3.5" />,
      };
    case 'high':
      return {
        label: 'High',
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    case 'medium':
      return {
        label: 'Medium',
        className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-yellow-500/10',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
      };
    case 'low':
      return {
        label: 'Low',
        className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10',
        icon: <Info className="w-3.5 h-3.5" />,
      };
    default:
      return {
        label: 'Info',
        className: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        icon: <Info className="w-3.5 h-3.5" />,
      };
  }
};

export const RulesPage = () => {
  const [rules, setRules] = useState(MOCK_RULES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [deletingRuleId, setDeletingRuleId] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Security');
  const [formSeverity, setFormSeverity] = useState('medium');
  const [formExampleGood, setFormExampleGood] = useState('');
  const [formExampleBad, setFormExampleBad] = useState('');

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.title.toLowerCase().includes(q) ||
        rule.description.toLowerCase().includes(q) ||
        rule.category.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
      const matchesSeverity = severityFilter === 'all' || rule.severity === severityFilter;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [rules, searchQuery, categoryFilter, severityFilter]);

  // Toggle Rule Enable Status
  const handleToggleRule = (id) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Open Modal for Add or Edit
  const handleOpenAddModal = () => {
    setEditingRuleId(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Security');
    setFormSeverity('medium');
    setFormExampleGood('');
    setFormExampleBad('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule) => {
    setEditingRuleId(rule.id);
    setFormTitle(rule.title);
    setFormDescription(rule.description);
    setFormCategory(rule.category);
    setFormSeverity(rule.severity);
    setFormExampleGood(rule.exampleGood || '');
    setFormExampleBad(rule.exampleBad || '');
    setIsModalOpen(true);
  };

  // Save Rule (Add or Edit)
  const handleSaveRule = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    if (editingRuleId) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRuleId
            ? {
                ...r,
                title: formTitle,
                description: formDescription,
                category: formCategory,
                severity: formSeverity,
                exampleGood: formExampleGood,
                exampleBad: formExampleBad,
              }
            : r
        )
      );
    } else {
      const newRule = {
        id: `rule-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        severity: formSeverity,
        enabled: true,
        exampleGood: formExampleGood,
        exampleBad: formExampleBad,
      };
      setRules((prev) => [newRule, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Delete Rule
  const handleDeleteRule = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    setDeletingRuleId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-medium">Organization Coding Rules</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Custom AI Coding Rules
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {rules.filter((r) => r.enabled).length} Active Rules
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Define mandatory engineering standards and security guidelines enforced during automated AI pull request audits
            </p>
          </div>
        </div>

        {/* Add Rule Button */}
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Rule</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card rounded-2xl border border-white/10 p-4 bg-[#0a0f1d]/80 shadow-xl space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules by title, category, description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Category & Severity Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-gray-400 font-mono">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-[#0e1424]">All Categories</option>
              <option value="Security" className="bg-[#0e1424]">Security</option>
              <option value="Performance" className="bg-[#0e1424]">Performance</option>
              <option value="Readability" className="bg-[#0e1424]">Readability</option>
              <option value="Maintainability" className="bg-[#0e1424]">Maintainability</option>
              <option value="Style" className="bg-[#0e1424]">Style</option>
              <option value="Documentation" className="bg-[#0e1424]">Documentation</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-gray-400 font-mono">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-[#0e1424]">All Severities</option>
              <option value="critical" className="bg-[#0e1424] text-rose-400">Critical</option>
              <option value="high" className="bg-[#0e1424] text-amber-400">High</option>
              <option value="medium" className="bg-[#0e1424] text-yellow-400">Medium</option>
              <option value="low" className="bg-[#0e1424] text-cyan-400">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules Responsive Table Container */}
      <div className="glass-card rounded-2xl border border-white/10 bg-[#0a0f1d]/90 shadow-xl overflow-hidden">
        {filteredRules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px] bg-[#0e1424]/60">
                  <th className="py-3.5 px-4 font-semibold w-24">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Rule Title & Description</th>
                  <th className="py-3.5 px-4 font-semibold w-32">Category</th>
                  <th className="py-3.5 px-4 font-semibold w-28">Severity</th>
                  <th className="py-3.5 px-4 font-semibold w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRules.map((rule) => {
                  const badge = getSeverityBadge(rule.severity);

                  return (
                    <tr key={rule.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Status Toggle Switch */}
                      <td className="py-4 px-4 align-top">
                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          className="flex items-center gap-1.5 focus:outline-none"
                          title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                        >
                          {rule.enabled ? (
                            <ToggleRight className="w-7 h-7 text-emerald-400 transition-colors" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 text-gray-600 transition-colors" />
                          )}
                          <span className={`text-[10px] font-mono font-medium ${rule.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {rule.enabled ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td className="py-4 px-4 align-top space-y-1.5">
                        <h3 className="text-sm font-bold text-white leading-snug">
                          {rule.title}
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                          {rule.description}
                        </p>

                        {/* Optional Code Snippet Preview Badges */}
                        {(rule.exampleGood || rule.exampleBad) && (
                          <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                            {rule.exampleGood && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Compliant Pattern Set</span>
                              </span>
                            )}
                            {rule.exampleBad && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <XCircle className="w-3 h-3" />
                                <span>Non-Compliant Pattern Set</span>
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 align-top font-mono">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.05] text-gray-300 border border-white/10">
                          {rule.category}
                        </span>
                      </td>

                      {/* Severity Badge */}
                      <td className="py-4 px-4 align-top">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(rule)}
                            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 hover:text-white transition-all"
                            title="Edit Rule"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingRuleId(rule.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center text-gray-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto text-gray-400">
              <Sliders className="w-6 h-6" />
            </div>
            <p className="text-xs">No coding rules match your active filters or search query.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl border border-white/10 bg-[#0e1424] max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>{editingRuleId ? 'Edit AI Coding Rule' : 'Create Custom AI Coding Rule'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-mono text-gray-300 mb-1">Rule Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Enforce JWT Algorithm Specification"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Category & Severity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-gray-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/10 text-white focus:outline-none"
                  >
                    <option value="Security">Security</option>
                    <option value="Performance">Performance</option>
                    <option value="Readability">Readability</option>
                    <option value="Maintainability">Maintainability</option>
                    <option value="Style">Style</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-gray-300 mb-1">Severity Level</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/10 text-white focus:outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-gray-300 mb-1">Rule Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain why this rule is enforced and what developers should do..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Compliant Pattern Example */}
              <div>
                <label className="block font-mono text-emerald-400 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Compliant Pattern Example (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formExampleGood}
                  onChange={(e) => setFormExampleGood(e.target.value)}
                  placeholder="e.g. jwt.verify(token, secret, { algorithms: ['RS256'] })"
                  className="w-full px-3 py-2 rounded-xl bg-[#060913] border border-emerald-500/30 text-emerald-300 font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Non-Compliant Pattern Example */}
              <div>
                <label className="block font-mono text-rose-400 mb-1 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Non-Compliant Pattern Example (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formExampleBad}
                  onChange={(e) => setFormExampleBad(e.target.value)}
                  placeholder="e.g. jwt.verify(token, secret)"
                  className="w-full px-3 py-2 rounded-xl bg-[#060913] border border-rose-500/30 text-rose-300 font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  {editingRuleId ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRuleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl border border-rose-500/30 bg-[#0e1424] max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Delete Coding Rule?</h3>
              <p className="text-xs text-gray-400">
                Are you sure you want to delete this custom rule? AI will no longer enforce it during pull request reviews.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingRuleId(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRule(deletingRuleId)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/20"
              >
                Delete Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesPage;
