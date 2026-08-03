import React from 'react';
import { Award, ShieldCheck, FolderGit2, GitPullRequest } from 'lucide-react';

const DEFAULT_DEVELOPERS = [
  {
    rank: 1,
    name: 'Sarah Chen',
    username: 'sarahchen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    repositoriesCount: 4,
    reviewsCount: 28,
    avgScore: 98,
  },
  {
    rank: 2,
    name: 'Trishy Nigam',
    username: 'trishyanigam',
    avatar: 'https://github.com/github.png',
    repositoriesCount: 6,
    reviewsCount: 34,
    avgScore: 94,
  },
  {
    rank: 3,
    name: 'Elena Rostova',
    username: 'elena-r',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    repositoriesCount: 3,
    reviewsCount: 19,
    avgScore: 92,
  },
  {
    rank: 4,
    name: 'Alex Rivera',
    username: 'arivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    repositoriesCount: 5,
    reviewsCount: 22,
    avgScore: 86,
  },
  {
    rank: 5,
    name: 'Marcus Vance',
    username: 'marcusv',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    repositoriesCount: 2,
    reviewsCount: 14,
    avgScore: 82,
  },
];

/**
 * DeveloperLeaderboard Component
 * Reusable responsive dark SaaS developer leaderboard table.
 *
 * @param {Object} props
 * @param {Array} [props.developers] - Array of developer object items
 * @param {string} [props.title] - Optional header title
 * @param {string} [props.className] - Additional wrapper CSS classes
 */
export const DeveloperLeaderboard = ({
  developers = DEFAULT_DEVELOPERS,
  title = 'Developer Security Leaderboard',
  className = '',
}) => {
  return (
    <div className={`glass-card rounded-2xl border border-white/10 p-6 bg-[#0a0f1d]/90 shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Top performing engineers ranked by AI audit pass rates and security scores
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px]">
              <th className="pb-3 font-semibold">Rank</th>
              <th className="pb-3 font-semibold">Developer</th>
              <th className="pb-3 font-semibold">Repositories</th>
              <th className="pb-3 font-semibold">Reviews</th>
              <th className="pb-3 font-semibold">Average Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {developers.map((dev) => (
              <tr key={dev.rank || dev.name} className="hover:bg-white/[0.02] transition-colors">
                {/* Rank */}
                <td className="py-3.5 font-mono text-gray-400">
                  <span
                    className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                      dev.rank === 1
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : dev.rank === 2
                        ? 'bg-gray-300/20 text-gray-200 border border-gray-300/30'
                        : dev.rank === 3
                        ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30'
                        : 'bg-white/[0.05] text-gray-400 border border-white/10'
                    }`}
                  >
                    #{dev.rank}
                  </span>
                </td>

                {/* Developer Avatar & Name */}
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-7 h-7 rounded-full border border-white/20 object-cover"
                    />
                    <div>
                      <span className="font-bold text-white block">{dev.name}</span>
                      {dev.username && (
                        <span className="text-[10px] font-mono text-gray-400">@{dev.username}</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Repositories */}
                <td className="py-3.5 font-mono text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>{dev.repositoriesCount || dev.repositories || 1} Repos</span>
                  </span>
                </td>

                {/* Reviews */}
                <td className="py-3.5 font-mono text-gray-200 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{dev.reviewsCount || dev.reviews || 0} Reviews</span>
                  </span>
                </td>

                {/* Average Score */}
                <td className="py-3.5 font-mono">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{dev.avgScore || dev.averageScore || 0} / 100</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeveloperLeaderboard;
