"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { USERS } from "@/lib/constants";
import type { TaskDefinition, TaskState } from "@/types";

interface Props {
  task: TaskDefinition;
  state?: TaskState;
  currentUserId: string;
  onToggle: (completed: boolean) => void;
  index: number;
}

export default function TaskItem({ task, state, currentUserId, onToggle, index }: Props) {
  const completed = state?.completed ?? false;
  const completedBy = state?.completedBy ? USERS[state.completedBy] : null;
  const completedAt = state?.completedAt;
  const isOwnTask = state?.completedBy === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: "easeOut" }}
      className={`
        relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-300
        ${completed
          ? "bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-700/40"
          : "bg-white/60 dark:bg-gray-800/60 border-gray-100/80 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90"
        }
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(!completed)}
        className="flex-shrink-0 relative focus:outline-none"
        aria-label={completed ? "בטל סימון" : "סמן כבוצע"}
      >
        <motion.div
          animate={{
            backgroundColor: completed ? "#10B981" : "transparent",
            borderColor: completed ? "#10B981" : "#D1D5DB",
            scale: 1,
          }}
          whileTap={{ scale: 0.85 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
          className="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-sm"
          style={completed ? { boxShadow: "0 0 0 3px rgba(16,185,129,0.15)" } : {}}
        >
          <AnimatePresence>
            {completed && (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg select-none">{task.emoji}</span>
          <p
            className={`text-sm font-medium leading-snug transition-all duration-300 ${
              completed
                ? "line-through text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {task.title}
          </p>
        </div>

        {/* Completion badge */}
        <AnimatePresence>
          {completed && completedBy && (
            <motion.div
              key="meta"
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5 mt-1.5 overflow-hidden"
            >
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: completedBy.color }}
              >
                {completedBy.name.charAt(0)}
              </span>
              <span className="text-xs font-semibold" style={{ color: completedBy.color }}>
                {completedBy.name}
              </span>
              {completedAt && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ·{" "}
                  {format(new Date(completedAt), "HH:mm, d בMMMM", { locale: he })}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* "My task" indicator */}
      {completed && isOwnTask && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex-shrink-0 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full"
        >
          ✓ אתה
        </motion.div>
      )}
    </motion.div>
  );
}
