import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Users, Plus } from 'lucide-react';
import { useTaskFlow } from '../../hooks/useTaskFlow';
import { CreateProjectModal } from '../modals/CreateProjectModal';

export const RecentProjects: React.FC = () => {
  const { projects } = useTaskFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-bottom border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Recent Projects</h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
          <Link to="/projects" className="text-sm font-medium text-slate-500 hover:text-slate-700">View All</Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {projects.slice(0, 3).map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="flex items-center p-6 hover:bg-slate-50 transition-colors"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
              style={{ backgroundColor: project.color }}
            >
              {project.name.charAt(0)}
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-semibold text-slate-900">{project.name}</h4>
              <p className="text-sm text-slate-500 truncate max-w-xs">{project.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-1">
                  <Users className="h-3 w-3" />
                  {project.memberIds.length} members
                </div>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </Link>
        ))}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
