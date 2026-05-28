"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { Activity as ActivityIcon } from "lucide-react";
import type { Activity } from "@/types";

interface Props {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: Props) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon className="w-4 h-4 text-violet-500" />
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
          פעילות אחרונה
        </h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2 opacity-40">📋</div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            עדיין אין פעילות השבוע
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto">
          <AnimatePresence initial={false}>
            {activities.map((act) => (
              <ActivityRow key={act.id} activity={act} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  const isCompleted = activity.action === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-2.5"
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
        style={{ backgroundColor: activity.userColor }}
      >
        {activity.userName.charAt(0)}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
          <span className="font-bold" style={{ color: activity.userColor }}>
            {activity.userName}
          </span>{" "}
          {isCompleted ? (
            <>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                סיים ✓
              </span>{" "}
              את{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {activity.taskTitle}
              </span>
            </>
          ) : (
            <>
              <span className="text-rose-500 dark:text-rose-400 font-medium">
                ביטל
              </span>{" "}
              את{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {activity.taskTitle}
              </span>
            </>
          )}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {activity.dayLabel}
          </span>
          <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatDistanceToNow(new Date(activity.timestamp), {
              addSuffix: true,
              locale: he,
            })}
          </span>
        </div>
      </div>

      {/* Action icon */}
      <span className="flex-shrink-0 text-base">
        {isCompleted ? "✅" : "↩️"}
      </span>
    </motion.div>
  );
}
