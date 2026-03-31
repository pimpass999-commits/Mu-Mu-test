import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskFlow } from '../hooks/useTaskFlow';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Search, Plus, Filter, MoreVertical, Calendar, Users, FolderKanban } from 'lucide-react';
import { format } from 'date-fns';
import { CreateProjectModal } from '../components/modals/CreateProjectModal';

export const Projects: React.FC = () => {
  const { projects } = useTaskFlow();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage and track all your team's projects.</p>
            </div>
            <Button 
              variant="primary" 
              className="flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <select className="flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-300">
                <option>Sort by: Recent</option>
                <option>Sort by: Name</option>
                <option>Sort by: Due Date</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden"
              >
                <div className="h-2" style={{ backgroundColor: project.color }}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.name.charAt(0)}
                    </div>
                    <button className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 h-10">
                    {project.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-500 dark:text-slate-400">Progress</span>
                      <span className="text-slate-900 dark:text-slate-100">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5" />
                        {project.memberIds.length} members
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(project.dueDate), 'MMM d')}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No projects found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or create a new project.</p>
              <Button 
                variant="primary" 
                className="mt-6"
                onClick={() => setIsModalOpen(true)}
              >
                Create New Project
              </Button>
            </div>
          )}
        </main>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
