import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/projectcard';
import CreateProjectModal from '../components/CreateProjectModal';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

 
  const filteredProjects = projects
    .filter((project: any) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (filter === 'recent') {
        return new Date(b.timeline).getTime() - new Date(a.timeline).getTime();
      }
      if (filter === 'oldest') {
        return new Date(a.timeline).getTime() - new Date(b.timeline).getTime();
      }
      return 0;
    });

  return (
    <div>
  
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Projects</h2>
          <p className="text-gray-500">Manage your active projects and teams</p>
        </div>

        {user?.role === 'manager' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 font-bold text-white bg-black rounded-xl hover:bg-gray-800"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search projects..."
          className="flex-1 p-3 rounded-xl border border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-3 rounded-xl border border-gray-200"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="recent">Recent</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      
      {loading ? (
        <div className="text-center py-20 font-medium">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={fetchProjects}
      />
    </div>
  );
};

export default Dashboard;