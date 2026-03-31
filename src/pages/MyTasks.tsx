import React, { useState } from 'react';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { TaskCard } from '../components/tasks/TaskCard';
import { Search, Filter, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { Task } from '../types';
import { TaskDetailModal } from '../components/modals/TaskDetailModal';

export const MyTasks: React.FC = () => {
  const { tasks, currentUser, users } = useTaskFlow();
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  
  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const today = new Date().toISOString().split('T')[0];
    if (activeTab === 'today') return matchesSearch && task.dueDate === today && task.status !== 'Done';
    if (activeTab === 'upcoming') return matchesSearch && task.dueDate > today && task.status !== 'Done';
    if (activeTab === 'completed') return matchesSearch && task.status === 'Done';
    return matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'All Tasks', icon: Clock },
    { id: 'today', label: 'Due Today', icon: AlertCircle },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Tasks</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your personal work and deadlines.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  )}>
                    {myTasks.filter(t => {
                      const today = new Date().toISOString().split('T')[0];
                      if (tab.id === 'today') return t.dueDate === today && t.status !== 'Done';
                      if (tab.id === 'upcoming') return t.dueDate > today && t.status !== 'Done';
                      if (tab.id === 'completed') return t.status === 'Done';
                      return true;
                    }).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search your tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>
                <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map(task => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No tasks found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">You're all caught up! Enjoy your day.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
};
