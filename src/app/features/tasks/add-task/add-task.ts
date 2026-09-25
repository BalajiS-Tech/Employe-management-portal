import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { Employee } from '../../../core/models/employee.model';
import { Project } from '../../../core/models/project.model';

import { EmployeeService } from '../../../core/services/employee';
import { ProjectService } from '../../../core/services/project';
import { TaskService } from '../../../core/services/task';

@Component({
  selector: 'app-add-task',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})
export class AddTask implements OnInit {

  readonly form;

  employees: Employee[] = [];
  projects: Project[] = [];

  saving = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      id: ['', Validators.required],

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      description: [
        '',
        Validators.required
      ],

      employeeId: [
        '',
        Validators.required
      ],

      projectId: [
        '',
        Validators.required
      ],

      status: [
        'Pending',
        Validators.required
      ],

      priority: [
        'Medium',
        Validators.required
      ],

      dueDate: [
        '',
        Validators.required
      ]
    });
  }

  ngOnInit(): void {
    this.employeeService.getAll().subscribe(data => {
      this.employees = data;
    });

    this.projectService.getAll().subscribe(data => {
      this.projects = data;
    });
  }

  save(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const task = this.form.getRawValue();

    this.taskService.create(task as any).subscribe({

      next: () => {
        this.router.navigate(['/tasks']);
      },

      error: () => {
        this.errorMessage = 'Unable to create task.';
        this.saving = false;
      }

    });
  }
}