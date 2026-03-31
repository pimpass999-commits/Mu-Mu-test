import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { CreateProjectModal } from '../modals/CreateProjectModal';

export const Sidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-right border-slate-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">TaskFlow</span>
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
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
          className="w-full flex items-center justify-center gap-2 py-2.5 shadow-sm shadow-blue-100"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="mt-auto p-6 border-top border-slate-100">
        <div className="bg-blue-600 rounded-xl p-4 text-white mb-6">
          <h4 className="text-sm font-semibold mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-blue-100 mb-3">Get unlimited projects and advanced analytics.</p>
          <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-none">
            Learn More
          </Button>
        </div>

        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
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
