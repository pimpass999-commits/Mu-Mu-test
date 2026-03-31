import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LayoutGrid, List, Filter, Search, Plus, ArrowLeft, MoreHorizontal, Users, Calendar, FolderKanban } from 'lucide-react';
import { Task, Status, Priority } from '../types';
import { format } from 'date-fns';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';
import { TaskDetailModal } from '../components/modals/TaskDetailModal';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, tasks, users } = useTaskFlow();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<Status | undefined>(undefined);

  const handleAddTask = (status?: Status) => {
    setInitialStatus(status);
    setIsTaskModalOpen(true);
  };

  const project = projects.find(p => p.id === projectId);
  if (!project) return <div>Project not found</div>;

  const projectTasks = tasks.filter(t => t.projectId === projectId && 
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const projectMembers = users.filter(u => project.memberIds.includes(u.id));

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/projects')} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                  <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                </div>
                <p className="text-slate-500 text-sm mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 mr-4">
                {projectMembers.map(member => (
                  <img
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    className="h-8 w-8 rounded-full border-2 border-white"
                    title={member.name}
                    referrerPolicy="no-referrer"
                  />
                ))}
                <button className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <Users className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
              <button
                onClick={() => setView('kanban')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-lg">
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => handleAddTask()}
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>

          {view === 'kanban' ? (
            <KanbanBoard 
              tasks={projectTasks} 
              onTaskClick={setSelectedTask} 
              onAddTask={handleAddTask}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-bottom border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectTasks.map((task) => {
                    const assignee = users.find(u => u.id === task.assigneeId);
                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={task.status === 'Done' ? 'success' : 'default'}>{task.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={task.priority === 'Urgent' ? 'error' : task.priority === 'High' ? 'warning' : 'default'}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {assignee && (
                              <>
                                <img src={assignee.avatar} alt="" className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                                <span className="text-sm text-slate-600">{assignee.name}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {projectTasks.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-slate-500">No tasks found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />

      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        initialProjectId={projectId}
        initialStatus={initialStatus}
      />
    </div>
  );
};
