// ─── Auth ─────────────────────────────────────────────────────────────────────
export type UserRole = 'manager' | 'employee';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  id: number;
  name: string;
  description: string;
  timeline: string; // ISO date string
  created_by?: number;
  created_at?: string;
}

export interface ProjectMember {
  id: number;
  user: number;
  name: string;
  email: string;
  is_team_lead: boolean;
}

export interface AddMembersPayload {
  project: number;
  users: number[];
  team_lead: number;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  timeline: string;
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  name: string;
  description: string;
  project: number;
  assigned_to: number;
  assigned_to_name: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO date string
  created_by?: number;
  created_at?: string;
}

export interface CreateTaskPayload {
  name: string;
  description: string;
  project: number;
  assigned_to: number;
  deadline: string;
  priority: TaskPriority;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}

// ─── Comments ─────────────────────────────────────────────────────────────────
export interface Comment {
  id: number;
  task: number;
  user: number;
  user_name?: string;
  text: string;
  created_at: string;
}

export interface CreateCommentPayload {
  task: number;
  text: string;
}