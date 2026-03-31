import React from 'react';
import { Calendar, MessageSquare, Tag } from 'lucide-react';
import { Task, Priority, Status } from '../../types';
import { useTaskFlow } from '../../hooks/useTaskFlow';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { users } = useTaskFlow();
  const assignee = users.find(u => u.id === task.assigneeId);

  const priorityColors: Record<Priority, string> = {
    Low: 'bg-slate-100 text-slate-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-orange-100 text-orange-700',
    Urgent: 'bg-red-100 text-red-700',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge className={cn('font-semibold', priorityColors[task.priority])}>
          {task.priority}
        </Badge>
        <div className="flex -space-x-2">
          {assignee && (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="h-6 w-6 rounded-full border-2 border-white"
              title={assignee.name}
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>

      <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {task.title}
      </h4>
      
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {task.tags.map(tag => (
          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-100">
            <Tag className="h-2.5 w-2.5 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-top border-slate-100">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(task.dueDate), 'MMM d')}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3.5 w-3.5" />
            {task.commentCount}
          </div>
        </div>
      </div>
    </div>
  );
};
