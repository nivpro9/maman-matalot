export interface User {
  code: string;
  name: string;
  color: string;
  bgClass: string;
  lightBgClass: string;
  darkBgClass: string;
}

export interface TaskState {
  completed: boolean;
  completedBy?: string;
  completedAt?: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  taskTitle: string;
  dayLabel: string;
  action: "completed" | "uncompleted";
  timestamp: number;
}

export interface DayConfig {
  key: string;
  label: string;
  emoji: string;
  gradient: string;
  borderColor: string;
  accentColor: string;
}

export interface TaskDefinition {
  id: string;
  title: string;
  emoji: string;
}
