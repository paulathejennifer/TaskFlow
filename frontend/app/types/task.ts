export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  category_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_date?: string | null;
  due_date?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  category_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_date?: string | null;
  due_date?: string | null;
}