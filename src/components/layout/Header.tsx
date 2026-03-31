import React, { useState } from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { useTaskFlow } from '../../hooks/useTaskFlow';
import { Button } from '../ui/Button';
import { CreateTaskModal } from '../modals/CreateTaskModal';

export const Header: React.FC = () => {
  const { currentUser } = useTaskFlow();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, projects..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="primary" 
          size="sm" 
          className="hidden sm:flex items-center gap-2"
          onClick={() => setIsTaskModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.role}</p>
          </div>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-9 w-9 rounded-full border border-slate-200"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
    </header>
  );
};
