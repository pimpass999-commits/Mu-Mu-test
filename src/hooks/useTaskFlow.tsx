import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Project, Task, Comment, Status, Priority } from '../types';
import { mockUsers, mockProjects, mockTasks, mockComments } from '../data/mockData';

interface TaskFlowContextType {
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  currentUser: User;
  addProject: (project: Omit<Project, 'id' | 'progress'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentCount'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addComment: (taskId: string, content: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const TaskFlowContext = createContext<TaskFlowContextType | undefined>(undefined);

export const TaskFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : mockUsers[0];
  });

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  const addProject = (projectData: Omit<Project, 'id' | 'progress'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p${projects.length + 1}`,
      progress: 0,
    };
    setProjects([...projects, newProject]);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentCount'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${tasks.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      commentCount: 0,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const addComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: `c${comments.length + 1}`,
      taskId,
      authorId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    updateTask(taskId, { commentCount: tasks.find(t => t.id === taskId)!.commentCount + 1 });
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  return (
    <TaskFlowContext.Provider value={{
      users,
      projects,
      tasks,
      comments,
      currentUser,
      addProject,
      addTask,
      updateTask,
      deleteTask,
      addComment,
      reorderTasks,
      updateCurrentUser
    }}>
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
