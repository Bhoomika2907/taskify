import api from './api';
import type { LoginResponse, UserProfile, CreateProjectPayload } from './types';

export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    api.post('/auth/login/', { email, password }).then(r => r.data),

  signup: (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<void> =>
    api.post('/auth/signup/', payload).then(r => r.data),

  getUsers: (): Promise<UserProfile[]> =>
    api.get('/auth/users/').then(r => r.data),

  forgotPassword: (email: string): Promise<void> =>
    api.post('/auth/forgot-password/', { email }).then(r => r.data),

  resetPassword: (payload: {
    email: string;
    otp: string;
    new_password: string;
  }): Promise<void> =>
    api.post('/auth/reset-password/', payload).then(r => r.data),
};