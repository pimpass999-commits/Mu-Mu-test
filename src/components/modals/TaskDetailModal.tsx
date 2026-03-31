import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTaskFlow } from '../../hooks/useTaskFlow';
import { Task, Status, Priority } from '../../types';
import { format } from 'date-fns';
import { Calendar, User, Tag, Clock, Trash2, Send, MessageSquare, CheckCircle2, AlertCircle, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { users, projects, comments, addComment, updateTask, deleteTask, currentUser } = useTaskFlow();
  const [commentText, setCommentText] = useState('');

  if (!task) return null;

  const assignee = users.find(u => u.id === task.assigneeId);
  const project = projects.find(p => p.id === task.projectId);
  const taskComments = comments
    .filter(c => c.taskId === task.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (newStatus: Status) => {
    updateTask(task.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    updateTask(task.id, { priority: newPriority });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText);
    setCommentText('');
  };

  const statuses: Status[] = ['To Do', 'In Progress', 'Review', 'Done'];
  const priorities: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="2xl"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {project && (
                <Badge variant="default" className="bg-slate-100 text-slate-600 border-none">
                  {project.name}
                </Badge>
              )}
              <Badge variant={task.status === 'Done' ? 'success' : 'default'}>
                {task.status}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">{task.description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({taskComments.length})
            </h4>
            
            <form onSubmit={handleAddComment} className="flex gap-3">
              <img src={currentUser.avatar} alt="" className="h-8 w-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
              <div className="flex-1 space-y-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  rows={2}
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={!commentText.trim()} className="flex items-center gap-2">
                    <Send className="h-3 w-3" />
                    Post
                  </Button>
                </div>
              </div>
            </form>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {taskComments.length > 0 ? (
                taskComments.map(comment => {
                  const author = users.find(u => u.id === comment.authorId);
                  return (
                    <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <img src={author?.avatar} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900">{author?.name}</span>
                          <span className="text-[10px] text-slate-400">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-64 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Assignee</label>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <img src={assignee?.avatar} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{assignee?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{assignee?.role}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Due Date</label>
              <div className="flex items-center gap-2 text-slate-700 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                      task.status === s 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                {priorities.map(p => (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p)}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                      task.priority === p 
                        ? p === 'Urgent' ? "bg-red-600 text-white border-red-600" :
                          p === 'High' ? "bg-orange-500 text-white border-orange-500" :
                          p === 'Medium' ? "bg-blue-500 text-white border-blue-500" :
                          "bg-slate-600 text-white border-slate-600"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 flex items-center justify-center gap-2"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
