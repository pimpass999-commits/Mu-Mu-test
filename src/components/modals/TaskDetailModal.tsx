import React, { useEffect, useState } from 'react';
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
  const { tasks, users, projects, comments, addComment, loadComments, updateTask, deleteTask, currentUser } = useTaskFlow();
  const [commentText, setCommentText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [commentError, setCommentError] = useState('');

  const liveTask = task ? tasks.find((item) => item.id === task.id) ?? task : null;

  useEffect(() => {
    if (isOpen && liveTask) {
      void loadComments(liveTask.id);
    }
  }, [isOpen, liveTask, loadComments]);

  if (!liveTask) return null;

  const assignee = users.find(u => u.id === liveTask.assigneeId);
  const project = projects.find(p => p.id === liveTask.projectId);
  const taskComments = comments
    .filter(c => c.taskId === liveTask.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = async (newStatus: Status) => {
    setIsSaving(true);
    try {
      await updateTask(liveTask.id, { status: newStatus });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePriorityChange = async (newPriority: Priority) => {
    setIsSaving(true);
    try {
      await updateTask(liveTask.id, { priority: newPriority });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsSaving(true);
      await deleteTask(liveTask.id);
      onClose();
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentError('');

    try {
      await addComment(liveTask.id, commentText);
      setCommentText('');
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Unable to add comment');
    }
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
              <Badge variant="default" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none">
                  {project.name}
                </Badge>
              )}
              <Badge variant={liveTask.status === 'Done' ? 'success' : 'default'}>
                {liveTask.status}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{liveTask.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">{liveTask.description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({taskComments.length})
            </h4>
            
            <form onSubmit={handleAddComment} className="flex gap-3">
              <img src={currentUser.avatar} alt="" className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
              <div className="flex-1 space-y-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none dark:text-slate-200 dark:placeholder-slate-500"
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

            {commentError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                {commentError}
              </div>
            )}

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {taskComments.length > 0 ? (
                taskComments.map(comment => {
                  const author = users.find(u => u.id === comment.authorId);
                  return (
                    <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <img src={author?.avatar} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{author?.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-400 dark:text-slate-500">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-64 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Assignee</label>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <img src={assignee?.avatar} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{assignee?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{assignee?.role}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Due Date</label>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="text-sm font-medium">{format(new Date(liveTask.dueDate), 'MMM d, yyyy')}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                      liveTask.status === s 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    )}
                    disabled={isSaving}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                {priorities.map(p => (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p)}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                      liveTask.priority === p 
                        ? p === 'Urgent' ? "bg-red-600 text-white border-red-600" :
                          p === 'High' ? "bg-orange-500 text-white border-orange-500" :
                          p === 'Medium' ? "bg-blue-500 text-white border-blue-500" :
                          "bg-slate-600 text-white border-slate-600"
                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    )}
                    disabled={isSaving}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button 
                variant="outline" 
                className="w-full text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/50 flex items-center justify-center gap-2"
                onClick={() => void handleDelete()}
                disabled={isSaving}
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
