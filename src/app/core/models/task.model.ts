export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  employeeId: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}
