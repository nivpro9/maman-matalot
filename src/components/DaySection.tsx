"use client";

import { motion } from "framer-motion";
import TaskItem from "./TaskItem";
import { TASKS } from "@/lib/constants";
import type { DayConfig, TaskState } from "@/types";

interface Props {
  day: DayConfig;
  tasks: Record<string, TaskState>;
  currentUserId: string;
  onToggle: (dayKey: string, taskId: string, completed: boolean) => void;
  isToday?: boolean;
  index: number;
}

export default function DaySection({
  day,
  tasks,
  currentUserId,
  onToggle,
  isToday,
  index,
}: Props) {
  const completedCount = TASKS.filter(
    (t) => tasks[`${day.key}_${t.id}`]?.completed
  ).length;
  const totalCount = TASKS.length;
  const allDone = completedCount === totalCount;
  const progress = (completedCount / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: "easeOut" }}
      className={`
        rounded-2xl overflow-hidden shadow-md border transition-all duration-300
        ${isToday
          ? "ring-2 shadow-lg"
          : "border-gray-100/80 dark:border-gray-700/50"
        }
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
      `}
      style={isToday ? { ringColor: day.accentColor, borderColor: `${day.accentColor}40` } : {}}
    >
      {/* Section header */}
      <div className={`bg-gradient-to-l ${day.gradient} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{day.emoji}</span>
            <div>
              <h2 className="text-white font-bold text-base tracking-tight">
                {day.label}
              </h2>
              {isToday && (
                <span className="text-white/80 text-xs font-medium">
                  ← היום
                </span>
              )}
            </div>
          </div>

          <div className="text-left">
            <div className="text-white font-bold text-lg leading-none">
              {completedCount}/{totalCount}
            </div>
            <div className="text-white/70 text-xs">הושלמו</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/25 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 text-white/90 text-xs font-semibold text-center"
          >
            🎉 כל המטלות הושלמו!
          </motion.div>
        )}
      </div>

      {/* Task list */}
      <div className="p-3 flex flex-col gap-2.5">
        {TASKS.map((task, i) => (
          <TaskItem
            key={task.id}
            task={task}
            state={tasks[`${day.key}_${task.id}`]}
            currentUserId={currentUserId}
            onToggle={(completed) => onToggle(day.key, task.id, completed)}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  );
}
