import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

/**
 * RuleForm Component
 * Reusable form component for creating and editing AI coding rules.
 *
 * @param {Object} props
 * @param {Object} [props.initialValues] - Initial rule values for editing
 * @param {Function} props.onSubmit - Submit handler function (formData) => {}
 * @param {Function} [props.onCancel] - Cancel handler function
 * @param {string} [props.submitLabel] - Submit button label text
 * @param {boolean} [props.loading] - Loading state flag
 * @param {string} [props.className] - Wrapper CSS classes
 */
export const RuleForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save Rule',
  loading = false,
  className = '',
}) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [category, setCategory] = useState(initialValues.category || 'Security');
  const [severity, setSeverity] = useState(initialValues.severity || 'medium');
  const [exampleGood, setExampleGood] = useState(initialValues.exampleGood || '');
  const [exampleBad, setExampleBad] = useState(initialValues.exampleBad || '');
  const [enabled, setEnabled] = useState(initialValues.enabled !== undefined ? initialValues.enabled : true);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setCategory(initialValues.category || 'Security');
      setSeverity(initialValues.severity || 'medium');
      setExampleGood(initialValues.exampleGood || '');
      setExampleBad(initialValues.exampleBad || '');
      setEnabled(initialValues.enabled !== undefined ? initialValues.enabled : true);
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (onSubmit) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        exampleGood: exampleGood.trim(),
        exampleBad: exampleBad.trim(),
        enabled,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-xs ${className}`}>
      {/* Title */}
      <div>
        <label className="block font-mono text-gray-300 mb-1">
          Rule Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Enforce Explicit JWT Verification Algorithm"
          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
        />
      </div>

      {/* Category & Severity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block font-mono text-gray-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="Security" className="bg-[#0e1424]">Security</option>
            <option value="Performance" className="bg-[#0e1424]">Performance</option>
            <option value="Readability" className="bg-[#0e1424]">Readability</option>
            <option value="Maintainability" className="bg-[#0e1424]">Maintainability</option>
            <option value="Style" className="bg-[#0e1424]">Style</option>
            <option value="Documentation" className="bg-[#0e1424]">Documentation</option>
            <option value="General" className="bg-[#0e1424]">General</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block font-mono text-gray-300 mb-1">Severity Level</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="critical" className="bg-[#0e1424] text-rose-400">Critical</option>
            <option value="high" className="bg-[#0e1424] text-amber-400">High</option>
            <option value="medium" className="bg-[#0e1424] text-yellow-400">Medium</option>
            <option value="low" className="bg-[#0e1424] text-cyan-400">Low</option>
            <option value="info" className="bg-[#0e1424] text-gray-400">Info</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-mono text-gray-300 mb-1">
          Rule Description <span className="text-rose-400">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the purpose of this rule and instructions for developers..."
          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans leading-relaxed"
        />
      </div>

      {/* Compliant (Good) Example */}
      <div>
        <label className="block font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Good Pattern Example (Compliant)</span>
        </label>
        <textarea
          rows={2}
          value={exampleGood}
          onChange={(e) => setExampleGood(e.target.value)}
          placeholder="e.g. jwt.verify(token, JWT_SECRET, { algorithms: ['RS256'] });"
          className="w-full px-3.5 py-2 rounded-xl bg-[#060913] border border-emerald-500/30 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500/60 transition-all"
        />
      </div>

      {/* Non-Compliant (Bad) Example */}
      <div>
        <label className="block font-mono text-rose-400 mb-1 flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5" />
          <span>Bad Pattern Example (Non-Compliant)</span>
        </label>
        <textarea
          rows={2}
          value={exampleBad}
          onChange={(e) => setExampleBad(e.target.value)}
          placeholder="e.g. jwt.verify(token, JWT_SECRET); // Missing algorithm parameter"
          className="w-full px-3.5 py-2 rounded-xl bg-[#060913] border border-rose-500/30 text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500/60 transition-all"
        />
      </div>

      {/* Active Enabled Toggle */}
      <div className="flex items-center justify-between pt-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <div>
          <span className="font-bold text-white block">Rule Active Status</span>
          <span className="text-[11px] text-gray-400">When active, AI will enforce this rule on PR reviews</span>
        </div>

        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className="flex items-center gap-2 focus:outline-none"
        >
          {enabled ? (
            <ToggleRight className="w-8 h-8 text-emerald-400 transition-colors" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-gray-600 transition-colors" />
          )}
          <span className={`text-xs font-mono font-bold ${enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
            {enabled ? 'ENABLED' : 'DISABLED'}
          </span>
        </button>
      </div>

      {/* Buttons Bar */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white font-medium transition-all"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !title.trim() || !description.trim()}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default RuleForm;
