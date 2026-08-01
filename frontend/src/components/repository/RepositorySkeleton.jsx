import React from 'react';

/**
 * Skeleton Loader Component for Repository Cards
 */
export const RepositorySkeleton = () => {
  return (
    <div className="glass-card-linear rounded-2xl border border-white/10 p-5 bg-[#0a0f1d]/70 animate-pulse flex flex-col justify-between h-48">
      <div>
        {/* Header Skeleton */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 bg-white/10 rounded"></div>
            <div className="h-5 w-40 bg-white/15 rounded"></div>
          </div>
          <div className="h-6 w-16 bg-white/10 rounded-full"></div>
        </div>

        {/* Description / Meta Skeleton */}
        <div className="h-3.5 w-full bg-white/5 rounded mb-4"></div>

        {/* Tags Skeleton */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-5 w-20 bg-white/10 rounded-md"></div>
          <div className="h-5 w-20 bg-white/10 rounded-md"></div>
        </div>
      </div>

      {/* Footer Button Skeleton */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="h-4 w-16 bg-white/10 rounded"></div>
        <div className="h-9 w-28 bg-white/15 rounded-xl"></div>
      </div>
    </div>
  );
};

export default RepositorySkeleton;
