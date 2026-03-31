import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskFlowProvider } from './hooks/useTaskFlow';
import { ThemeProvider } from './hooks/useTheme';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { MyTasks } from './pages/MyTasks';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Analytics } from './pages/Analytics';
import { NotFound } from './pages/NotFound';

export default function App() {
  // Simple auth simulation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <ThemeProvider>
      <TaskFlowProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/projects"
              element={isAuthenticated ? <Projects /> : <Navigate to="/login" />}
            />
            <Route
              path="/projects/:projectId"
              element={isAuthenticated ? <ProjectDetail /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-tasks"
              element={isAuthenticated ? <MyTasks /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <Settings onLogout={logout} /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />}
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TaskFlowProvider>
    </ThemeProvider>
  );
}
