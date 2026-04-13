import api from './api';
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskStatusPayload,
} from './types';

export const taskService = {
  getByProject: (projectId: number | string): Promise<Task[]> =>
    api.get(`/tasks/?project=${projectId}`).then(r => {
      // Check if data is paginated (DRF style) or a plain array
      if (r.data && Array.isArray(r.data)) return r.data;
      if (r.data && r.data.results && Array.isArray(r.data.results)) return r.data.results;
      return [];
    }),

  create: (payload: CreateTaskPayload): Promise<Task> =>
    api.post('/tasks/create/', payload).then(r => r.data),

  update: (taskId: string | number, payload: any): Promise<void> =>
    api.patch(`/tasks/${taskId}`, payload).then(r => r.data),
    
  updateStatus: (taskId: string | number, payload: { status: string }): Promise<void> =>
    api.patch(`/tasks/update-status/${taskId}/`, payload).then(r => r.data),
};