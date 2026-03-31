import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LayoutGrid, List, Filter, Search, Plus, ArrowLeft, MoreHorizontal, Users, Calendar, FolderKanban, Workflow as WorkflowIcon } from 'lucide-react';
import { Task, Status, Priority, User } from '../types';
import { format } from 'date-fns';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';
import { TaskDetailModal } from '../components/modals/TaskDetailModal';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, tasks, users } = useTaskFlow();
  const [view, setView] = useState<'kanban' | 'list' | 'workflow'>('kanban');
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/projects')} className="rounded-full dark:hover:bg-slate-800 dark:text-slate-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 mr-4">
                {projectMembers.map(member => (
                  <img
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900"
                    title={member.name}
                    referrerPolicy="no-referrer"
                  />
                ))}
                <button className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
                <Users className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
              <button
                onClick={() => setView('kanban')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === 'kanban' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                <List className="h-4 w-4" />
                List
              </button>
              <button
                onClick={() => setView('workflow')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === 'workflow' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                <WorkflowIcon className="h-4 w-4" />
                Workflow
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-slate-200 dark:placeholder-slate-500"
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-lg dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
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
          ) : view === 'list' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Task Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assignee</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {projectTasks.map((task) => {
                    const assignee = users.find(u => u.id === task.assigneeId);
                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</span>
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
                                <span className="text-sm text-slate-600 dark:text-slate-400">{assignee.name}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {projectTasks.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400">No tasks found matching your search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 py-4">
              {(['To Do', 'In Progress', 'Review', 'Done'] as Status[]).map((status, index, array) => {
                const statusTasks = projectTasks.filter(t => t.status === status);
                return (
                  <div key={status} className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg z-10">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{status}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{statusTasks.length} tasks in this stage</p>
                      </div>
                    </div>
                    
                    {index < array.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-[-32px] w-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
                    )}
                    
                    <div className="ml-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {statusTasks.map(task => {
                        const assignee = users.find(u => u.id === task.assigneeId);
                        return (
                          <div 
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{task.title}</h4>
                              <Badge variant={task.priority === 'Urgent' ? 'error' : task.priority === 'High' ? 'warning' : 'default'} className="shrink-0">
                                {task.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                {assignee && (
                                  <img src={assignee.avatar} alt={assignee.name} className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                                )}
                                <span className="text-xs text-slate-500 dark:text-slate-400">{assignee?.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                <Calendar className="h-3 w-3" />
                                <span className="text-[10px]">{format(new Date(task.dueDate), 'MMM d')}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {statusTasks.length === 0 && (
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700 p-6 rounded-2xl flex items-center justify-center">
                          <p className="text-sm text-slate-400 dark:text-slate-500 italic">No tasks in this stage</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
