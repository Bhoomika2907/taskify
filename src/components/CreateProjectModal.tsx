import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }: any) => {
  const [formData, setFormData] = useState({ name: '', description: '', timeline: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects/create/', formData);
      toast.success('Project created successfully!');
      onProjectCreated(); // Refresh the list
      onClose(); // Close modal
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg p-10 bg-white rounded-3xl">
        <h3 className="mb-6 text-2xl font-bold">Create New Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="Project Name" 
            className="w-full p-3 bg-gray-100 rounded-xl"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <textarea 
            placeholder="Description" 
            className="w-full p-3 bg-gray-100 rounded-xl h-32"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
          <input 
            type="date" 
            className="w-full p-3 bg-gray-100 rounded-xl"
            onChange={(e) => setFormData({...formData, timeline: e.target.value})}
            required
          />
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-bold bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 py-4 font-bold text-white bg-black rounded-xl">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
