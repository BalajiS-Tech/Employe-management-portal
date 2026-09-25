export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progress: number;
}
