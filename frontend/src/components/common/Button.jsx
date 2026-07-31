import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  href,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none cursor-pointer';

  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5',
    secondary: 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 border border-gray-700/70 hover:border-gray-600 hover:-translate-y-0.5',
    outline: 'bg-transparent text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/10 hover:border-emerald-500',
    ghost: 'bg-transparent text-gray-400 hover:text-gray-100 hover:bg-gray-800/50',
    gradient: 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-gray-950 font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs space-x-1.5',
    md: 'px-4 py-2 text-sm space-x-2',
    lg: 'px-6 py-3 text-base space-x-2.5',
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {Icon && <Icon className="w-4 h-4" />}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
};
