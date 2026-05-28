import type { User, DayConfig, TaskDefinition } from "@/types";

export const USERS: Record<string, User> = {
  "2661": {
    code: "2661",
    name: "ניבו",
    color: "#3B82F6",
    bgClass: "bg-blue-500",
    lightBgClass: "bg-blue-100",
    darkBgClass: "dark:bg-blue-900/40",
  },
  "2666": {
    code: "2666",
    name: "רונוס",
    color: "#8B5CF6",
    bgClass: "bg-purple-500",
    lightBgClass: "bg-purple-100",
    darkBgClass: "dark:bg-purple-900/40",
  },
  "8333": {
    code: "8333",
    name: "אבא אילן",
    color: "#10B981",
    bgClass: "bg-emerald-500",
    lightBgClass: "bg-emerald-100",
    darkBgClass: "dark:bg-emerald-900/40",
  },
  "9090": {
    code: "9090",
    name: "דדי",
    color: "#F59E0B",
    bgClass: "bg-amber-500",
    lightBgClass: "bg-amber-100",
    darkBgClass: "dark:bg-amber-900/40",
  },
  "5252": {
    code: "5252",
    name: "שלוי",
    color: "#EC4899",
    bgClass: "bg-pink-500",
    lightBgClass: "bg-pink-100",
    darkBgClass: "dark:bg-pink-900/40",
  },
  "7017": {
    code: "7017",
    name: "מוגי",
    color: "#EF4444",
    bgClass: "bg-red-500",
    lightBgClass: "bg-red-100",
    darkBgClass: "dark:bg-red-900/40",
  },
};

export const TASKS: TaskDefinition[] = [
  { id: "0", title: "לטאטא בית + דריימי", emoji: "🧹" },
  {
    id: "1",
    title: "סידור כלים מהמייבש לארון ומגרות + ניקיון אבק וסידור שולחן",
    emoji: "🍽️",
  },
  { id: "2", title: "ניקיון מטבח, כיור, שיש ופינת אוכל", emoji: "🫧" },
];

export const DAYS: DayConfig[] = [
  {
    key: "tuesday",
    label: "מטלות שלישי",
    emoji: "📅",
    gradient: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-400/30",
    accentColor: "#3B82F6",
  },
  {
    key: "friday",
    label: "מטלות שישי",
    emoji: "✨",
    gradient: "from-violet-500 to-purple-600",
    borderColor: "border-violet-400/30",
    accentColor: "#8B5CF6",
  },
  {
    key: "saturday",
    label: 'מטלות מוצ"ש',
    emoji: "🌙",
    gradient: "from-rose-500 to-pink-600",
    borderColor: "border-rose-400/30",
    accentColor: "#EC4899",
  },
];

export function getISOWeekId(date: Date = new Date()): string {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
