"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, LogOut, Wifi, WifiOff, RefreshCw } from "lucide-react";
import DaySection from "./DaySection";
import ActivityFeed from "./ActivityFeed";
import StatsPanel from "./StatsPanel";
import { DAYS } from "@/lib/constants";
import {
  subscribeToTasks,
  subscribeToActivity,
  subscribeToStats,
  toggleTask,
} from "@/lib/store";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { User, TaskState, Activity } from "@/types";

interface Props {
  user: User;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
}

function getTodayKey(): string | null {
  const day = new Date().getDay();
  if (day === 2) return "tuesday";
  if (day === 5) return "friday";
  if (day === 6) return "saturday";
  return null;
}

export default function Dashboard({
  user,
  darkMode,
  onToggleDark,
  onLogout,
}: Props) {
  const [tasks, setTasks] = useState<Record<string, TaskState>>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [toggling, setToggling] = useState<Set<string>>(new Set());
  const todayKey = getTodayKey();

  useEffect(() => {
    const unsubTasks = subscribeToTasks(setTasks);
    const unsubActivity = subscribeToActivity(setActivities);
    const unsubStats = subscribeToStats(setStats);
    return () => {
      unsubTasks();
      unsubActivity();
      unsubStats();
    };
  }, []);

  const handleToggle = useCallback(
    async (dayKey: string, taskId: string, completed: boolean) => {
      const key = `${dayKey}_${taskId}`;
      if (toggling.has(key)) return;
      setToggling((prev) => new Set(prev).add(key));

      const day = DAYS.find((d) => d.key === dayKey)!;
      const TASKS_DEF = (await import("@/lib/constants")).TASKS;
      const task = TASKS_DEF.find((t) => t.id === taskId)!;

      try {
        await toggleTask(
          dayKey,
          taskId,
          completed,
          user.code,
          user.name,
          task.title,
          day.label,
          user.color
        );
      } finally {
        setToggling((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [user, toggling]
  );

  const completedThisWeek = Object.values(tasks).filter(
    (t) => t.completed && t.completedBy === user.code
  ).length;

  return (
    <div
      className={`
        min-h-screen transition-colors duration-300
        bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20
        dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/20
      `}
    >
      {/* Firebase demo mode banner */}
      {!isFirebaseConfigured && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-700/30 px-4 py-2 text-center">
          <p className="text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            מצב הדגמה — הנתונים נשמרים מקומית בלבד. להגדרת Firebase ראה README.
          </p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* User avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0"
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0)}
          </div>

          {/* Greeting */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mb-0.5">
              שלום,
            </p>
            <h1
              className="font-extrabold text-base leading-none truncate"
              style={{ color: user.color }}
            >
              {user.name}
            </h1>
          </div>

          {/* Week badge */}
          {completedThisWeek > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-full"
            >
              {completedThisWeek} השבוע ✓
            </motion.div>
          )}

          {/* Sync indicator */}
          {isFirebaseConfigured && (
            <Wifi className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          )}

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="החלף מצב תצוגה"
          >
            <AnimatePresence mode="wait" initial={false}>
              {darkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4.5 h-4.5 text-amber-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4.5 h-4.5 text-indigo-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="התנתק"
          >
            <LogOut className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-10">
        {/* App title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-1"
        >
          <span className="text-2xl">🏠</span>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            ממן מטלות
          </h2>
        </motion.div>

        {/* Day sections */}
        {DAYS.map((day, i) => (
          <DaySection
            key={day.key}
            day={day}
            tasks={tasks}
            currentUserId={user.code}
            onToggle={handleToggle}
            isToday={day.key === todayKey}
            index={i}
          />
        ))}

        {/* Activity + Stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ActivityFeed activities={activities} />
          <StatsPanel stats={stats} />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 dark:text-gray-600 pt-2">
          ממן מטלות · מתאפס בתחילת כל שבוע
        </p>
      </main>
    </div>
  );
}
