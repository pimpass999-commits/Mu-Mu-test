import type {
  Comment,
  Project,
  ProjectMember,
  Task,
  TaskTag,
  User,
  TaskStatus,
} from "@prisma/client";
import { PRIORITY_FROM_DB, STATUS_FROM_DB } from "../lib/constants.js";

type TaskWithRelations = Task & {
  tags: TaskTag[];
  _count: { comments: number };
};

type ProjectSummaryInput = Project & {
  members: Pick<ProjectMember, "userId">[];
  tasks: Pick<Task, "status">[];
};

type ProjectDetailInput = Project & {
  members: (ProjectMember & { user: User })[];
  tasks: Pick<Task, "status">[];
};

type CommentWithAuthor = Comment & {
  author: User;
};

export function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };
}

export function calculateProgress(tasks: Pick<Task, "status">[]) {
  if (tasks.length === 0) {
    return 0;
  }

  const doneCount = tasks.filter((task) => task.status === "DONE").length;
  return Math.round((doneCount / tasks.length) * 100);
}

export function countTasksByStatus(tasks: Pick<Task, "status">[]) {
  return {
    "To Do": tasks.filter((task) => task.status === "TO_DO").length,
    "In Progress": tasks.filter((task) => task.status === "IN_PROGRESS").length,
    Review: tasks.filter((task) => task.status === "REVIEW").length,
    Done: tasks.filter((task) => task.status === "DONE").length,
  };
}

export function toTask(task: TaskWithRelations) {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description ?? "",
    status: STATUS_FROM_DB[task.status],
    priority: PRIORITY_FROM_DB[task.priority],
    assigneeId: task.assigneeId,
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    commentCount: task._count.comments,
    tags: task.tags.map((tag) => tag.value),
    position: task.position,
  };
}

export function toProjectSummary(project: ProjectSummaryInput) {
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? "",
    color: project.color,
    dueDate: project.dueDate.toISOString(),
    memberIds: project.members.map((member) => member.userId),
    memberCount: project.members.length,
    progress: calculateProgress(project.tasks),
    taskCount: project.tasks.length,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function toProjectDetail(project: ProjectDetailInput) {
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? "",
    color: project.color,
    dueDate: project.dueDate.toISOString(),
    memberIds: project.members.map((member) => member.userId),
    progress: calculateProgress(project.tasks),
    members: project.members.map((member) => ({
      ...toPublicUser(member.user),
      membershipRole: member.membershipRole,
      joinedAt: member.joinedAt.toISOString(),
    })),
    taskCountsByStatus: countTasksByStatus(project.tasks),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function toComment(comment: CommentWithAuthor) {
  return {
    id: comment.id,
    taskId: comment.taskId,
    authorId: comment.authorId,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    author: toPublicUser(comment.author),
  };
}

export function getStatusLabel(status: TaskStatus) {
  return STATUS_FROM_DB[status];
}
