"use client";

import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import { USERS, TASKS, DAYS } from "@/lib/constants";

interface Props {
  stats: Record<string, number>;
}

const MAX_POSSIBLE = TASKS.length * DAYS.length;

export default function StatsPanel({ stats }: Props) {
  const entries = Object.entries(USERS)
    .map(([code, user]) => ({ user, count: stats[code] || 0 }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);

  const topCount = entries[0]?.count || 1;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-amber-500" />
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
          סטטיסטיקה שבועית
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500 mr-auto">
          השבוע
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2 opacity-40">📊</div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            עדיין אין נתונים השבוע
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(({ user, count }, i) => (
            <div key={user.code} className="flex items-center gap-2.5">
              {/* Rank badge */}
              <div className="flex-shrink-0 w-5 text-center">
                {i === 0 && <span className="text-sm">🥇</span>}
                {i === 1 && <span className="text-sm">🥈</span>}
                {i === 2 && <span className="text-sm">🥉</span>}
                {i > 2 && (
                  <span className="text-xs text-gray-400 font-medium">
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: user.color }}
              >
                {user.name.charAt(0)}
              </div>

              {/* Name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {user.name}
                  </span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2">
                    {count}/{MAX_POSSIBLE}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: user.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / MAX_POSSIBLE) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
