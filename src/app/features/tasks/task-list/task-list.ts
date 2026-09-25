import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  Subject,
  forkJoin,
  takeUntil
} from 'rxjs';

import { Employee } from '../../../core/models/employee.model';
import { Project } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';

import { EmployeeService } from '../../../core/services/employee';
import { ProjectService } from '../../../core/services/project';
import { TaskService } from '../../../core/services/task';


@Component({
  selector: 'app-task-list',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskList implements OnInit, OnDestroy {

  /*
   * All tasks received from JSON Server.
   */
  tasks: Task[] = [];


  /*
   * Employees are loaded because the task table
   * needs to display employee names.
   */
  employees: Employee[] = [];


  /*
   * Projects are loaded because the task table
   * needs to display project names.
   */
  projects: Project[] = [];


  /*
   * Tasks after applying filters.
   *
   * The HTML table should use this array.
   */
  filtered: Task[] = [];


  /*
   * Loading state.
   */
  loading = true;


  /*
   * Error message displayed in the UI.
   */
  errorMessage = '';


  /*
   * Filter values.
   */
  status = 'All Status';

  employeeId = 'All Employees';

  projectId = 'All Projects';

  priority = 'All Priority';


  /*
   * Used to stop RxJS subscriptions when
   * the component is destroyed.
   */
  private readonly destroy$ = new Subject<void>();


  constructor(
    private readonly taskService: TaskService,
    private readonly employeeService: EmployeeService,
    private readonly projectService: ProjectService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    /*
     * Load tasks, employees and projects
     * when the page opens.
     */
    this.load();

  }


  /**
   * Load all data required by the task list.
   *
   * forkJoin runs the three API requests together
   * and gives us the result after all requests finish.
   */
  load(): void {

    this.loading = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    forkJoin({

      tasks: this.taskService.getAll(),

      employees: this.employeeService.getAll(),

      projects: this.projectService.getAll()

    })
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data) => {

          console.log(
            'TASKS FROM API:',
            data.tasks
          );

          console.log(
            'EMPLOYEES FROM API:',
            data.employees
          );

          console.log(
            'PROJECTS FROM API:',
            data.projects
          );


          /*
           * Store API data.
           */
          this.tasks = data.tasks;

          this.employees = data.employees;

          this.projects = data.projects;


          /*
           * Apply currently selected filters.
           */
          this.applyFilters();


          /*
           * API requests completed.
           */
          this.loading = false;


          /*
           * Important because this component
           * uses OnPush change detection.
           */
          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'TASK LIST ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to load tasks. Make sure JSON Server is running.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Apply all task filters.
   */
  applyFilters(): void {

    this.filtered = this.tasks.filter(task => {

      /*
       * Status filter.
       */
      const matchesStatus =
        this.status === 'All Status' ||
        task.status === this.status;


      /*
       * Employee filter.
       */
      const matchesEmployee =
        this.employeeId === 'All Employees' ||
        String(task.employeeId) === String(this.employeeId);


      /*
       * Project filter.
       */
      const matchesProject =
        this.projectId === 'All Projects' ||
        String(task.projectId) === String(this.projectId);


      /*
       * Priority filter.
       */
      const matchesPriority =
        this.priority === 'All Priority' ||
        task.priority === this.priority;


      /*
       * Task must satisfy all selected filters.
       */
      return (
        matchesStatus &&
        matchesEmployee &&
        matchesProject &&
        matchesPriority
      );

    });


    /*
     * Refresh OnPush component.
     */
    this.changeDetector.markForCheck();

  }


  /**
   * Called when any filter changes.
   */
  onFilterChange(): void {

    this.applyFilters();

  }


  /**
   * Clear all task filters.
   */
  clearFilters(): void {

    this.status = 'All Status';

    this.employeeId = 'All Employees';

    this.projectId = 'All Projects';

    this.priority = 'All Priority';


    this.applyFilters();


    this.changeDetector.markForCheck();

  }


  /**
   * Get employee name using employee ID.
   */
  employeeName(id: string): string {

    return this.employees.find(
      employee =>
        String(employee.id) === String(id)
    )?.name ?? 'Unassigned';

  }


  /**
   * Get project name using project ID.
   */
  projectName(id: string): string {

    return this.projects.find(
      project =>
        String(project.id) === String(id)
    )?.name ?? 'No project';

  }


  /**
   * Update task status.
   *
   * Example:
   *
   * Pending
   *    ↓
   * In Progress
   *
   * or
   *
   * In Progress
   *    ↓
   * Completed
   */
  updateStatus(
    task: Task,
    status: Task['status']
  ): void {

    /*
     * Don't make an unnecessary API request
     * if the status hasn't changed.
     */
    if (task.status === status) {
      return;
    }


    this.errorMessage = '';

    this.changeDetector.markForCheck();


    /*
     * Send updated task to JSON Server.
     */
    this.taskService
      .update(
        task.id,
        {
          ...task,
          status
        }
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (updatedTask) => {

          console.log(
            'TASK STATUS UPDATED:',
            updatedTask
          );


          /*
           * Update the task inside the local array.
           */
          const index =
            this.tasks.findIndex(
              item =>
                String(item.id) ===
                String(task.id)
            );


          if (index !== -1) {

            this.tasks[index] =
              updatedTask;

          }


          /*
           * Re-apply filters because changing
           * the status can make the task disappear
           * from the current filtered result.
           */
          this.applyFilters();


          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'TASK STATUS UPDATE ERROR:',
            error
          );


          this.errorMessage =
            'Unable to update task status.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Delete a task.
   */
  deleteTask(id: string): void {

    const confirmed =
      confirm('Delete this task?');


    /*
     * Stop if the user cancels.
     */
    if (!confirmed) {
      return;
    }


    this.loading = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    this.taskService
      .delete(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: () => {

          console.log(
            'TASK DELETED:',
            id
          );


          /*
           * Remove the deleted task locally.
           */
          this.tasks =
            this.tasks.filter(
              task =>
                String(task.id) !==
                String(id)
            );


          /*
           * Re-apply filters.
           */
          this.applyFilters();


          this.loading = false;


          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'TASK DELETE ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to delete task.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Clean up all subscriptions when
   * the component is destroyed.
   */
  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}