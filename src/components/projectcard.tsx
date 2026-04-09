import React from 'react';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// 1. Define what a Project looks like
interface Project {
  id: number | string;
  name: string;
  description: string;
  timeline: string;
}

// 2. Define the Props (Notice: NO "key" here!)
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="p-8 transition-all bg-white border shadow-sm cursor-pointer rounded-3xl border-black/5 hover:shadow-xl group"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-6 transition-colors rounded-2xl bg-gray-100 group-hover:bg-black group-hover:text-white">
        <Briefcase className="w-6 h-6" />
      </div>
      
      <h3 className="mb-3 text-xl font-bold">{project.name}</h3>
      <p className="mb-6 text-sm text-gray-500 line-clamp-2">{project.description}</p>
      
      <div className="flex items-center justify-between pt-6 border-t border-black/5">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          {/* We add a check to make sure timeline exists before formatting */}
          {project.timeline ? format(new Date(project.timeline), 'MMM d, yyyy') : 'No date'}
        </div>
        <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default ProjectCard;