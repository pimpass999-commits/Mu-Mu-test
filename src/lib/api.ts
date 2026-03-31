import { Comment, Project, Task, User } from '../types';

const API_BASE = '/api';
const ACCESS_TOKEN_KEY = 'taskflow.accessToken';
const CURRENT_USER_KEY = 'currentUser';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  retryOnAuthFailure?: boolean;
};

type BackendUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
};

type BackendProject = {
  id: string;
  name: string;
  description: string;
  color: string;
  dueDate: string;
  memberIds: string[];
  progress: number;
};

type BackendTask = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  tags: string[];
  position: number;
};

type BackendComment = {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

type DashboardSummary = {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  urgentTasks: number;
};

type TeamActivityItem = {
  user: BackendUser;
  lastTaskTitle: string | null;
  assignedTaskCount: number;
  completedTaskCount: number;
  progressPercent: number;
};

type AnalyticsOverview = {
  totals: {
    totalTasks: number;
    activeMembers: number;
    completionRate: number;
    averageCompletionDays: number;
  };
  taskCompletionSeries: Array<{
    name: string;
    created: number;
    completed: number;
  }>;
  projectDistribution: Array<{
    name: string;
    value: number;
  }>;
  topPerformers: Array<{
    user: BackendUser;
    assignedTaskCount: number;
    completedTaskCount: number;
    efficiency: number;
  }>;
  productivitySeries: Array<{
    time: string;
    score: number;
  }>;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

let refreshPromise: Promise<boolean> | null = null;

function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return `${url.pathname}${url.search}`;
}

function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setStoredAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getStoredCurrentUser() {
  const rawUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

function setStoredCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function hasStoredSession() {
  return Boolean(getStoredAccessToken());
}

function toUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatarUrl,
  };
}

function toProject(project: BackendProject): Project {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    color: project.color,
    dueDate: project.dueDate,
    memberIds: project.memberIds,
    progress: project.progress,
  };
}

function toTask(task: BackendTask): Task {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    commentCount: task.commentCount,
    tags: task.tags,
    position: task.position,
  };
}

function toComment(comment: BackendComment): Comment {
  return {
    id: comment.id,
    taskId: comment.taskId,
    authorId: comment.authorId,
    content: comment.content,
    createdAt: comment.createdAt,
  };
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        clearStoredSession();
        return false;
      }

      const data = await response.json() as { accessToken: string };
      setStoredAccessToken(data.accessToken);
      return true;
    } catch {
      clearStoredSession();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getStoredAccessToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path, query), {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  if (
    response.status === 401 &&
    options.retryOnAuthFailure !== false &&
    path !== '/auth/login' &&
    path !== '/auth/refresh'
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, { ...options, retryOnAuthFailure: false }, query);
    }
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : 'Request failed';

    throw new ApiError(response.status, message, payload);
  }

  return payload as T;
}

export async function login(email: string, password: string) {
  const data = await request<{ user: BackendUser; accessToken: string; expiresIn: number }>(
    '/auth/login',
    {
      method: 'POST',
      body: { email, password },
      retryOnAuthFailure: false,
    },
  );

  const user = toUser(data.user);
  setStoredAccessToken(data.accessToken);
  setStoredCurrentUser(user);

  return {
    user,
    accessToken: data.accessToken,
    expiresIn: data.expiresIn,
  };
}

export async function logout() {
  try {
    await request('/auth/logout', {
      method: 'POST',
      retryOnAuthFailure: false,
    });
  } finally {
    clearStoredSession();
  }
}

export async function getCurrentUser() {
  const data = await request<BackendUser>('/auth/me');
  const user = toUser(data);
  setStoredCurrentUser(user);
  return user;
}

export async function listUsers() {
  const data = await request<BackendUser[]>('/users');
  return data.map(toUser);
}

export async function updateMe(updates: Pick<User, 'name' | 'email' | 'role' | 'avatar'>) {
  const data = await request<BackendUser>('/users/me', {
    method: 'PATCH',
    body: {
      name: updates.name,
      email: updates.email,
      role: updates.role,
      avatarUrl: updates.avatar,
    },
  });

  const user = toUser(data);
  setStoredCurrentUser(user);
  return user;
}

export async function listProjects(query?: { q?: string; sort?: 'recent' | 'name' | 'dueDate'; limit?: number }) {
  const data = await request<BackendProject[]>('/projects', undefined, query);
  return data.map(toProject);
}

export async function createProject(input: Omit<Project, 'id' | 'progress'>) {
  const data = await request<BackendProject>('/projects', {
    method: 'POST',
    body: input,
  });
  return toProject(data);
}

export async function listTasks(query?: {
  projectId?: string;
  assigneeId?: string;
  q?: string;
  status?: Task['status'];
  due?: 'all' | 'today' | 'upcoming' | 'completed';
  sort?: 'updatedAt' | 'dueDate';
  limit?: number;
}) {
  const data = await request<BackendTask[]>('/tasks', undefined, query);
  return data.map(toTask);
}

export async function createTask(
  input: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentCount' | 'position'>,
) {
  const data = await request<BackendTask>('/tasks', {
    method: 'POST',
    body: input,
  });
  return toTask(data);
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const data = await request<BackendTask>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: {
      title: updates.title,
      description: updates.description,
      assigneeId: updates.assigneeId,
      priority: updates.priority,
      status: updates.status,
      dueDate: updates.dueDate,
      tags: updates.tags,
    },
  });
  return toTask(data);
}

export async function deleteTask(taskId: string) {
  await request(`/tasks/${taskId}`, { method: 'DELETE' });
}

export async function reorderProjectTasks(
  projectId: string,
  items: Array<{ taskId: string; status: Task['status']; position: number }>,
) {
  const data = await request<BackendTask[]>(`/projects/${projectId}/tasks/reorder`, {
    method: 'PATCH',
    body: { items },
  });
  return data.map(toTask);
}

export async function listComments(taskId: string) {
  const data = await request<BackendComment[]>(`/tasks/${taskId}/comments`);
  return data.map(toComment);
}

export async function createComment(taskId: string, content: string) {
  const data = await request<BackendComment>(`/tasks/${taskId}/comments`, {
    method: 'POST',
    body: { content },
  });
  return toComment(data);
}

export async function getDashboardSummary() {
  return request<DashboardSummary>('/dashboard/summary');
}

export async function getDashboardMyTasks(limit = 4) {
  const data = await request<BackendTask[]>('/dashboard/my-tasks', undefined, { limit });
  return data.map(toTask);
}

export async function getUpcomingDeadlines(limit = 4) {
  const data = await request<BackendTask[]>('/dashboard/upcoming-deadlines', undefined, { limit });
  return data.map(toTask);
}

export async function getTeamActivity(limitUsers = 3) {
  const data = await request<TeamActivityItem[]>('/dashboard/team-activity', undefined, { limitUsers });
  return data.map((item) => ({
    ...item,
    user: toUser(item.user),
  }));
}

export async function getAnalyticsOverview(range: '7d' | '30d' = '7d') {
  const data = await request<AnalyticsOverview>('/analytics/overview', undefined, { range });
  return {
    ...data,
    topPerformers: data.topPerformers.map((item) => ({
      ...item,
      user: toUser(item.user),
    })),
  };
}
