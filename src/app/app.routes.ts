import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/employee-list/employee-list').then(m => m.EmployeeList)
      },
      {
        path: 'employees/add',
        loadComponent: () =>
          import('./features/employees/add-employee/add-employee').then(m => m.AddEmployee)
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () =>
          import('./features/employees/employee-details/employee-details').then(m => m.EmployeeDetails)
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('./features/employees/employee-details/employee-details').then(m => m.EmployeeDetails)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/project-list/project-list').then(m => m.ProjectList)
      },
      {
        path: 'projects/add',
        loadComponent: () =>
          import('./features/projects/add-project/add-project').then(m => m.AddProject)
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./features/projects/project-details/project-details').then(m => m.ProjectDetails)
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/projects/project-details/project-details').then(m => m.ProjectDetails)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list').then(m => m.TaskList)
      },
      {
        path: 'tasks/add',
        loadComponent: () =>
          import('./features/tasks/add-task/add-task').then(m => m.AddTask)
      },
      {
        path: 'tasks/:id',
        loadComponent: () =>
          import('./features/tasks/task-details/task-details').then(m => m.TaskDetails)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
