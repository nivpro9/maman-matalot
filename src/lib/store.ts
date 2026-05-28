"use client";

import {
  ref,
  set,
  onValue,
  push,
  query,
  limitToLast,
  off,
} from "firebase/database";
import { database, isFirebaseConfigured } from "./firebase";
import { getISOWeekId } from "./constants";
import type { TaskState, Activity } from "@/types";

// ─── Local Storage helpers (demo/offline mode) ─────────────────────────────

function localKey(suffix: string) {
  return `maman_${getISOWeekId()}_${suffix}`;
}

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Cross-tab sync via storage events
const localListeners = new Map<string, Set<() => void>>();

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    const listeners = localListeners.get(e.key);
    listeners?.forEach((cb) => cb());
  });
}

function watchLocal(key: string, callback: () => void): () => void {
  if (!localListeners.has(key)) localListeners.set(key, new Set());
  localListeners.get(key)!.add(callback);
  return () => localListeners.get(key)?.delete(callback);
}

// ─── Task subscriptions ─────────────────────────────────────────────────────

export function subscribeToTasks(
  callback: (tasks: Record<string, TaskState>) => void
): () => void {
  if (isFirebaseConfigured && database) {
    const weekId = getISOWeekId();
    const tasksRef = ref(database, `weeklyTasks/${weekId}`);
    onValue(tasksRef, (snap) => callback((snap.val() as Record<string, TaskState>) || {}));
    return () => off(tasksRef);
  }

  const key = localKey("tasks");
  const notify = () => callback(loadLocal<Record<string, TaskState>>(key, {}));
  notify();
  const unsub = watchLocal(key, notify);
  const timer = setInterval(notify, 2000);
  return () => {
    unsub();
    clearInterval(timer);
  };
}

// ─── Toggle a task ──────────────────────────────────────────────────────────

export async function toggleTask(
  dayKey: string,
  taskId: string,
  completed: boolean,
  userId: string,
  userName: string,
  taskTitle: string,
  dayLabel: string,
  userColor: string
): Promise<void> {
  const taskKey = `${dayKey}_${taskId}`;
  const weekId = getISOWeekId();
  const taskState: TaskState = completed
    ? { completed: true, completedBy: userId, completedAt: Date.now() }
    : { completed: false };

  const activityPayload = {
    userId,
    userName,
    userColor,
    taskTitle,
    dayLabel,
    action: completed ? ("completed" as const) : ("uncompleted" as const),
    timestamp: Date.now(),
  };

  if (isFirebaseConfigured && database) {
    await set(ref(database, `weeklyTasks/${weekId}/${taskKey}`), taskState);
    await push(ref(database, "activity"), activityPayload);
  } else {
    const tasksKey = localKey("tasks");
    const tasks = loadLocal<Record<string, TaskState>>(tasksKey, {});
    tasks[taskKey] = taskState;
    saveLocal(tasksKey, tasks);
    // Trigger cross-tab sync
    if (typeof window !== "undefined") {
      window.dispatchEvent(new StorageEvent("storage", { key: tasksKey }));
    }

    const actKey = "maman_activity";
    const acts = loadLocal<Activity[]>(actKey, []);
    acts.unshift({ id: Date.now().toString(), ...activityPayload });
    saveLocal(actKey, acts.slice(0, 50));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new StorageEvent("storage", { key: actKey }));
    }
  }
}

// ─── Activity feed ──────────────────────────────────────────────────────────

export function subscribeToActivity(
  callback: (activities: Activity[]) => void
): () => void {
  if (isFirebaseConfigured && database) {
    const actRef = query(ref(database, "activity"), limitToLast(20));
    onValue(actRef, (snap) => {
      const data = snap.val() as Record<string, Omit<Activity, "id">> | null;
      if (!data) { callback([]); return; }
      const list = Object.entries(data)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => b.timestamp - a.timestamp);
      callback(list);
    });
    return () => off(actRef);
  }

  const key = "maman_activity";
  const notify = () => callback(loadLocal<Activity[]>(key, []));
  notify();
  const unsub = watchLocal(key, notify);
  const timer = setInterval(notify, 2000);
  return () => {
    unsub();
    clearInterval(timer);
  };
}

// ─── Weekly stats (count completed tasks per user) ──────────────────────────

export function subscribeToStats(
  callback: (stats: Record<string, number>) => void
): () => void {
  const computeFromTasks = (tasks: Record<string, TaskState>) => {
    const stats: Record<string, number> = {};
    Object.values(tasks).forEach((t) => {
      if (t.completed && t.completedBy) {
        stats[t.completedBy] = (stats[t.completedBy] || 0) + 1;
      }
    });
    callback(stats);
  };

  return subscribeToTasks(computeFromTasks);
}
