import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskFlowProvider } from './hooks/useTaskFlow';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { MyTasks } from './pages/MyTasks';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

export default function App() {
  // Simple auth simulation - always logged in for demo
  const isAuthenticated = true;

  return (
    <TaskFlowProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
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
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TaskFlowProvider>
  );
}
