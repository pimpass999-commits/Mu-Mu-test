import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskFlowProvider } from './hooks/useTaskFlow';
import { ThemeProvider } from './hooks/useTheme';
import {
  clearStoredSession,
  getCurrentUser,
  getStoredCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  restoreSession,
} from './lib/api';
import { User } from './types';

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Projects = lazy(() => import('./pages/Projects').then((module) => ({ default: module.Projects })));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then((module) => ({ default: module.ProjectDetail })));
const MyTasks = lazy(() => import('./pages/MyTasks').then((module) => ({ default: module.MyTasks })));
const Settings = lazy(() => import('./pages/Settings').then((module) => ({ default: module.Settings })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Landing = lazy(() => import('./pages/Landing').then((module) => ({ default: module.Landing })));
const Analytics = lazy(() => import('./pages/Analytics').then((module) => ({ default: module.Analytics })));
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })));

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredCurrentUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const bootstrapAuth = async () => {
      const restored = await restoreSession();
      if (!restored) {
        if (!ignore) {
          clearStoredSession();
          setCurrentUser(null);
          setIsAuthLoading(false);
        }
        return;
      }

      try {
        const user = await getCurrentUser();
        if (!ignore) {
          setCurrentUser(user);
        }
      } catch {
        clearStoredSession();
        if (!ignore) {
          setCurrentUser(null);
        }
      } finally {
        if (!ignore) {
          setIsAuthLoading(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    setCurrentUser(result.user);
  };

  const logout = async () => {
    await logoutRequest();
    setCurrentUser(null);
  };

  return (
    <ThemeProvider>
      <TaskFlowProvider currentUser={currentUser} isAuthenticated={!!currentUser}>
        <Router>
          {isAuthLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
              Loading TaskFlow...
            </div>
          ) : (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
              Loading page...
            </div>
          }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />}
            />
            
            <Route
              path="/dashboard"
              element={currentUser ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/projects"
              element={currentUser ? <Projects /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/projects/:projectId"
              element={currentUser ? <ProjectDetail /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/my-tasks"
              element={currentUser ? <MyTasks /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/settings"
              element={currentUser ? <Settings onLogout={logout} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/analytics"
              element={currentUser ? <Analytics /> : <Navigate to="/login" replace />}
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          )}
        </Router>
      </TaskFlowProvider>
    </ThemeProvider>
  );
}
