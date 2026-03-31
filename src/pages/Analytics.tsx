import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, CheckCircle2, Clock, 
  Calendar, ArrowUpRight, ArrowDownRight, Filter, Download 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b'];

export const Analytics: React.FC = () => {
  const { tasks, users, projects } = useTaskFlow();

  // Task Completion Data for last 7 days
  const taskCompletionData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayTasks = tasks.filter(t => isSameDay(new Date(t.createdAt), date));
    const completed = tasks.filter(t => t.status === 'Done' && isSameDay(new Date(t.updatedAt), date)).length;
    return {
      name: format(date, 'EEE'),
      completed,
      total: dayTasks.length || Math.floor(Math.random() * 10) + 5 // Fallback for demo
    };
  });

  // Project Distribution
  const projectDistributionData = projects.map(p => {
    const projectTasks = tasks.filter(t => t.projectId === p.id);
    return {
      name: p.name,
      value: projectTasks.length
    };
  });

  // Productivity Trend (Demo data based on task updates)
  const productivityData = [
    { time: '9 AM', score: 45 },
    { time: '11 AM', score: 78 },
    { time: '1 PM', score: 52 },
    { time: '3 PM', score: 85 },
    { time: '5 PM', score: 65 },
    { time: '7 PM', score: 30 },
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Track your team's performance and productivity metrics.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Tasks', value: totalTasks, trend: '+12.5%', isUp: true, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Avg. Completion Time', value: '4.2 days', trend: '-8.2%', isUp: false, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Active Members', value: users.length, trend: '+4', isUp: true, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
              { label: 'Completion Rate', value: `${completionRate}%`, trend: '+5.4%', isUp: true, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            ].map((metric, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 ${metric.bg} rounded-xl`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                    metric.isUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'
                  }`}>
                    {metric.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {metric.trend}
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metric.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Completion Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900 dark:text-white">Task Completion Rate</h3>
                <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-semibold px-3 py-1.5 focus:ring-2 focus:ring-blue-500 dark:text-slate-300">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                      }}
                    />
                    <Bar dataKey="completed" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} className="dark:fill-slate-800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Distribution */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-8">Project Distribution</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {projectDistributionData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value} tasks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Productivity Trend */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-8">Daily Productivity Trend</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productivityData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Performance Table */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Top Performers</h3>
              <div className="space-y-6">
                {users.slice(0, 4).map((member, i) => {
                  const memberTasks = tasks.filter(t => t.assigneeId === member.id);
                  const completed = memberTasks.filter(t => t.status === 'Done').length;
                  const efficiency = memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0;
                  
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{memberTasks.length} tasks assigned</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{efficiency}%</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Efficiency</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-6 text-blue-600 dark:text-blue-400">View Full Report</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
