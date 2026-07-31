import React from 'react';

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 ${
        hover ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
