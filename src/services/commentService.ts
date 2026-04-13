import api from './api';
import type { Comment, CreateCommentPayload } from './types';

export const commentService = {
  create: (formData: FormData): Promise<Comment> =>
    api.post('/comments/add/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for files
      },
    }).then(r => r.data),
    
  getByTask: (taskId: number): Promise<Comment[]> =>
    api.get(`/comments/task/${taskId}/`).then(r => r.data),
};