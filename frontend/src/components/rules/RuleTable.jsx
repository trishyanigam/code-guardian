import React from 'react';
import {
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Sliders,
} from 'lucide-react';

/**
 * Helper to resolve severity badge styling and icon
 */
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

/**
 * RuleTable Component
 * Reusable dark SaaS responsive table displaying organization AI coding rules.
 *
 * @param {Object} props
 * @param {Array} [props.rules] - Array of coding rule objects
 * @param {Function} [props.onToggle] - Callback (ruleId) when toggle is clicked
 * @param {Function} [props.onEdit] - Callback (rule) when edit button is clicked
 * @param {Function} [props.onDelete] - Callback (ruleId) when delete button is clicked
 * @param {string} [props.className] - Additional wrapper CSS classes
 */
export const RuleTable = ({
  rules = [],
  onToggle,
  onEdit,
  onDelete,
  className = '',
}) => {
  return (
    <div className={`glass-card rounded-2xl border border-white/10 bg-[#0a0f1d]/90 shadow-xl overflow-hidden ${className}`}>
      {rules.length > 0 ? (
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
              {rules.map((rule) => {
                const badge = getSeverityBadge(rule.severity);
                const isEnabled = rule.enabled !== undefined ? rule.enabled : true;

                return (
                  <tr key={rule.id || rule._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Status Toggle Switch */}
                    <td className="py-4 px-4 align-top">
                      <button
                        onClick={() => onToggle && onToggle(rule.id || rule._id)}
                        className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
                        title={isEnabled ? 'Disable rule' : 'Enable rule'}
                      >
                        {isEnabled ? (
                          <ToggleRight className="w-7 h-7 text-emerald-400 transition-colors" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-gray-600 transition-colors" />
                        )}
                        <span className={`text-[10px] font-mono font-medium ${isEnabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {isEnabled ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </td>

                    {/* Rule Title & Description */}
                    <td className="py-4 px-4 align-top space-y-1.5">
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {rule.title}
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                        {rule.description}
                      </p>

                      {/* Code Examples Indicators */}
                      {(rule.exampleGood || rule.exampleBad) && (
                        <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                          {rule.exampleGood && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Compliant Code</span>
                            </span>
                          )}
                          {rule.exampleBad && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <XCircle className="w-3 h-3" />
                              <span>Non-Compliant Code</span>
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 align-top font-mono">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.05] text-gray-300 border border-white/10">
                        {rule.category || 'General'}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="py-4 px-4 align-top">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit && onEdit(rule)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                          title="Edit Rule"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(rule.id || rule._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all cursor-pointer"
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
          <p className="text-xs">No custom coding rules available.</p>
        </div>
      )}
    </div>
  );
};

export default RuleTable;
