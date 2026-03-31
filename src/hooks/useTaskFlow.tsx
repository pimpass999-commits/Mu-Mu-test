import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Comment, Project, Task, User } from '../types';
import {
  createComment as createCommentRequest,
  createProject as createProjectRequest,
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  listComments,
  listProjects,
  listTasks,
  listUsers,
  reorderProjectTasks,
  updateMe,
  updateTask as updateTaskRequest,
} from '../lib/api';

const EMPTY_USER: User = {
  id: '',
  name: '',
  email: '',
  role: '',
  avatar: '',
};

interface TaskFlowContextType {
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  currentUser: User;
  isLoading: boolean;
  addProject: (project: Omit<Project, 'id' | 'progress'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentCount' | 'position'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  loadComments: (taskId: string) => Promise<void>;
  reorderTasks: (
    projectId: string,
    items: Array<{ taskId: string; status: Task['status']; position: number }>,
  ) => Promise<void>;
  updateCurrentUser: (updates: Partial<User>) => Promise<void>;
}

const TaskFlowContext = createContext<TaskFlowContextType | undefined>(undefined);

interface TaskFlowProviderProps {
  children: React.ReactNode;
  currentUser: User | null;
  isAuthenticated: boolean;
}

export const TaskFlowProvider: React.FC<TaskFlowProviderProps> = ({
  children,
  currentUser: authUser,
  isAuthenticated,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(authUser ?? EMPTY_USER);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentUser(authUser ?? EMPTY_USER);
  }, [authUser]);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      if (!isAuthenticated) {
        if (!ignore) {
          setUsers([]);
          setProjects([]);
          setTasks([]);
          setComments([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      try {
        const [nextUsers, nextProjects, nextTasks] = await Promise.all([
          listUsers(),
          listProjects(),
          listTasks(),
        ]);

        if (!ignore) {
          setUsers(nextUsers);
          setProjects(nextProjects);
          setTasks(nextTasks);
          setComments([]);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load TaskFlow data', error);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, authUser?.id]);

  const loadComments = useCallback(async (taskId: string) => {
    const nextComments = await listComments(taskId);
    setComments((prev) => [
      ...prev.filter((comment) => comment.taskId !== taskId),
      ...nextComments,
    ]);
  }, []);

  const addProject = async (projectData: Omit<Project, 'id' | 'progress'>) => {
    const newProject = await createProjectRequest(projectData);
    setProjects((prev) => [...prev, newProject]);
  };

  const addTask = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentCount' | 'position'>,
  ) => {
    const newTask = await createTaskRequest(taskData);
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTask = await updateTaskRequest(taskId, updates);
    setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
  };

  const deleteTask = async (taskId: string) => {
    await deleteTaskRequest(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setComments((prev) => prev.filter((comment) => comment.taskId !== taskId));
  };

  const addComment = async (taskId: string, content: string) => {
    const newComment = await createCommentRequest(taskId, content);

    setComments((prev) => {
      const nextComments = prev.filter((comment) => comment.id !== newComment.id);
      return [newComment, ...nextComments];
    });

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, commentCount: task.commentCount + 1 }
          : task,
      ),
    );
  };

  const reorderTasks = async (
    projectId: string,
    items: Array<{ taskId: string; status: Task['status']; position: number }>,
  ) => {
    const reorderedTasks = await reorderProjectTasks(projectId, items);
    setTasks((prev) => [
      ...prev.filter((task) => task.projectId !== projectId),
      ...reorderedTasks,
    ]);
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    const mergedUser = {
      ...currentUser,
      ...updates,
    };

    const updatedUser = await updateMe({
      name: mergedUser.name,
      email: mergedUser.email,
      role: mergedUser.role,
      avatar: mergedUser.avatar,
    });

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  };

  return (
    <TaskFlowContext.Provider
      value={{
        users,
        projects,
        tasks,
        comments,
        currentUser,
        isLoading,
        addProject,
        addTask,
        updateTask,
        deleteTask,
        addComment,
        loadComments,
        reorderTasks,
        updateCurrentUser,
      }}
    >
      {children}
    </TaskFlowContext.Provider>
  );
};

export const useTaskFlow = () => {
  const context = useContext(TaskFlowContext);
  if (context === undefined) {
    throw new Error('useTaskFlow must be used within a TaskFlowProvider');
  }
  return context;
};
