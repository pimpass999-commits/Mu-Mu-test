import { TaskPriority, TaskStatus } from "@prisma/client";

export const STATUS_TO_DB: Record<string, TaskStatus> = {
  "To Do": TaskStatus.TO_DO,
  "In Progress": TaskStatus.IN_PROGRESS,
  Review: TaskStatus.REVIEW,
  Done: TaskStatus.DONE,
};

export const STATUS_FROM_DB: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.REVIEW]: "Review",
  [TaskStatus.DONE]: "Done",
};

export const PRIORITY_TO_DB: Record<string, TaskPriority> = {
  Low: TaskPriority.LOW,
  Medium: TaskPriority.MEDIUM,
  High: TaskPriority.HIGH,
  Urgent: TaskPriority.URGENT,
};

export const PRIORITY_FROM_DB: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "Low",
  [TaskPriority.MEDIUM]: "Medium",
  [TaskPriority.HIGH]: "High",
  [TaskPriority.URGENT]: "Urgent",
};
