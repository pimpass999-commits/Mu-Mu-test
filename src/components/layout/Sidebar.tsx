import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut, Plus, BarChart3 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { CreateProjectModal } from '../modals/CreateProjectModal';

export const Sidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">TaskFlow</span>
        </div>

        <nav className="space-y-1 mb-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button 
          variant="primary" 
          className="w-full flex items-center justify-center gap-2 py-2.5 shadow-sm shadow-blue-100 dark:shadow-none"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-blue-600 rounded-xl p-4 text-white mb-6">
          <h4 className="text-sm font-semibold mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-blue-100 mb-3">Get unlimited projects and advanced analytics.</p>
          <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-none">
            Learn More
          </Button>
        </div>

        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
};
