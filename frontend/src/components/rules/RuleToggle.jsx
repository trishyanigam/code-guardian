import React from 'react';

/**
 * RuleToggle Component
 * Reusable animated switch toggle using Tailwind CSS transitions.
 *
 * @param {Object} props
 * @param {boolean} [props.enabled] - Toggle status (true for ON, false for OFF)
 * @param {Function} [props.onChange] - Change handler callback (enabledState) => {}
 * @param {string} [props.label] - Optional text label beside switch
 * @param {string} [props.size] - 'sm' | 'md' | 'lg'
 * @param {boolean} [props.disabled] - Disabled state flag
 * @param {string} [props.className] - Additional wrapper CSS classes
 */
export const RuleToggle = ({
  enabled = false,
  onChange,
  label,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!enabled);
    }
  };

  // Dimensions configuration by size
  const sizeConfig = {
    sm: {
      track: 'w-8 h-4.5 p-0.5',
      thumb: 'w-3.5 h-3.5',
      translate: 'translate-x-3.5',
      textSize: 'text-[10px]',
    },
    md: {
      track: 'w-11 h-6 p-0.5',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      textSize: 'text-xs',
    },
    lg: {
      track: 'w-14 h-7.5 p-1',
      thumb: 'w-5.5 h-5.5',
      translate: 'translate-x-6.5',
      textSize: 'text-sm',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {/* Animated Switch Track */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={handleClick}
        className={`relative inline-flex items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
          currentSize.track
        } ${
          enabled
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20'
            : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        {/* Sliding Thumb Circle */}
        <span
          className={`transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
            currentSize.thumb
          } ${enabled ? currentSize.translate : 'translate-x-0'}`}
        />
      </button>

      {/* Optional Label */}
      {label && (
        <span className={`font-mono font-medium ${currentSize.textSize} ${enabled ? 'text-emerald-400' : 'text-gray-400'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default RuleToggle;
