import type { Task } from "@/app/types/task";

export type Category = {
  id: string;
  name: string;
};

export type TaskFormValues = {
  title: string;
  description: string;
  category_id: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  start_date: string;
  due_date: string;
};

export type TaskFormProps = {
  mode: "create" | "edit";
  task?: Task | null;
  categories?: Category[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onDelete?: (task: Task) => void | Promise<void>;
  onCreateCategory?: () => void;
};

export const EMPTY_TASK_FORM: TaskFormValues = {
  title: "",
  description: "",
  category_id: "",
  status: "TODO",
  priority: "LOW",
  start_date: "",
  due_date: "",
};