import React, { useState } from 'react';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { RecentProjects } from '../components/dashboard/RecentProjects';
import { TaskCard } from '../components/tasks/TaskCard';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '../types';
import { TaskDetailModal } from '../components/modals/TaskDetailModal';

export const Dashboard: React.FC = () => {
  const { tasks, currentUser } = useTaskFlow();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id).slice(0, 4);
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'Done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <section>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
              <p className="text-slate-500">Here's what's happening with your projects today.</p>
            </div>
            <SummaryCards />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <RecentProjects />
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-bottom border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">My Tasks</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-bottom border-slate-100">
                  <h3 className="font-semibold text-slate-900">Upcoming Deadlines</h3>
                </div>
                <div className="p-4 space-y-4">
                  {upcomingDeadlines.map(task => (
                    <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex flex-col items-center justify-center text-red-600 font-bold">
                        <span className="text-[10px] uppercase leading-none">{format(new Date(task.dueDate), 'MMM')}</span>
                        <span className="text-lg leading-none">{format(new Date(task.dueDate), 'd')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">{task.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          Due in {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                <h3 className="font-bold text-lg mb-2">Team Activity</h3>
                <p className="text-blue-100 text-sm mb-4">See what your teammates are working on in real-time.</p>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30"></div>
                      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/60 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
