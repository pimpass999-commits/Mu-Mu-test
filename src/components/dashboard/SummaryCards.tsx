import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { useTaskFlow } from '../../hooks/useTaskFlow';
import { cn } from '../../utils/cn';

export const SummaryCards: React.FC = () => {
  const { tasks } = useTaskFlow();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'Urgent').length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'In Progress', value: inProgressTasks, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Urgent', value: urgentTasks, icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className={cn('p-2.5 rounded-xl', stat.bg)}>
              <stat.icon className={cn('h-6 w-6', stat.color)} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
