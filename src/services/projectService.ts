import api from './api';
import type {
  Project,
  ProjectMember,
  AddMembersPayload,
  CreateProjectPayload,
} from './types';

export const projectService = {
  getAll: (): Promise<Project[]> =>
    api.get('/projects/').then(r => r.data),

  getById: (id: number | string): Promise<Project> =>
    api.get(`/projects/${id}/`).then(r => r.data),

  create: (payload: CreateProjectPayload): Promise<Project> =>
    api.post('/projects/create/', payload).then(r => r.data),

  getMembers: (projectId: number | string): Promise<ProjectMember[]> =>
    api.get(`/projects/${projectId}/members/`).then(r => r.data),

  addMembers: (payload: AddMembersPayload): Promise<void> =>
    api.post('/projects/add-members/', payload).then(r => r.data),
};