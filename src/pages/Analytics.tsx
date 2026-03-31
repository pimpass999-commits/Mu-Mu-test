import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, Users, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, Filter, Download,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getAnalyticsOverview } from '../lib/api';

const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b'];

export const Analytics: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const [analytics, setAnalytics] = useState<Awaited<ReturnType<typeof getAnalyticsOverview>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadAnalytics = async () => {
      setIsLoading(true);

      try {
        const data = await getAnalyticsOverview(range);
        if (!ignore) {
          setAnalytics(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load analytics', error);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadAnalytics();

    return () => {
      ignore = true;
    };
  }, [range]);

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
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as '7d' | '30d')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Tasks', value: analytics?.totals.totalTasks ?? 0, trend: range === '30d' ? '30d' : '7d', isUp: true, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Avg. Completion Time', value: `${analytics?.totals.averageCompletionDays ?? 0} days`, trend: 'Average', isUp: false, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Active Members', value: analytics?.totals.activeMembers ?? 0, trend: 'Team', isUp: true, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
              { label: 'Completion Rate', value: `${analytics?.totals.completionRate ?? 0}%`, trend: 'Done', isUp: true, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{isLoading ? '...' : metric.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900 dark:text-white">Task Completion Rate</h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{range === '30d' ? '30 day window' : '7 day window'}</span>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.taskCompletionSeries ?? []}>
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
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar dataKey="completed" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="created" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} className="dark:fill-slate-800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-8">Project Distribution</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.projectDistribution ?? []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(analytics?.projectDistribution ?? []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {(analytics?.projectDistribution ?? []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value} tasks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-8">Daily Productivity Trend</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.productivitySeries ?? []}>
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

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Top Performers</h3>
              <div className="space-y-6">
                {(analytics?.topPerformers ?? []).map((member, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={member.user.avatar} alt={member.user.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{member.user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{member.assignedTaskCount} tasks assigned</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{member.efficiency}%</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Efficiency</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-6 text-blue-600 dark:text-blue-400">View Full Report</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
