import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

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
  selector: 'app-task-details',
  imports: [
    RouterLink
  ],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetails implements OnInit, OnDestroy {

  /*
   * Task loaded from JSON Server.
   */
  task?: Task;


  /*
   * Employee assigned to this task.
   */
  employee?: Employee;


  /*
   * Project associated with this task.
   */
  project?: Project;


  /*
   * Page loading state.
   */
  loading = true;


  /*
   * Error message displayed in the UI.
   */
  errorMessage = '';


  /*
   * Used to clean up subscriptions
   * when the component is destroyed.
   */
  private readonly destroy$ =
    new Subject<void>();


  constructor(
    private readonly route: ActivatedRoute,
    private readonly taskService: TaskService,
    private readonly employeeService: EmployeeService,
    private readonly projectService: ProjectService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    /*
     * Get task ID from URL.
     *
     * Example:
     * /tasks/1
     *
     * id = "1"
     */
    const id =
      this.route.snapshot.paramMap.get('id');


    /*
     * Stop if the URL doesn't contain
     * a task ID.
     */
    if (!id) {

      this.errorMessage =
        'Task not found.';

      this.loading = false;

      this.changeDetector.markForCheck();

      return;
    }


    this.loadTask(id);

  }


  /**
   * Load task first and then load
   * its employee and project.
   */
  private loadTask(id: string): void {

    this.loading = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    this.taskService
      .getById(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (task) => {

          console.log(
            'TASK DETAILS:',
            task
          );


          /*
           * Store the task.
           */
          this.task = task;


          /*
           * Once we have the task,
           * we know the employee ID and
           * project ID.
           *
           * forkJoin loads both together.
           */
          forkJoin({

            employee:
              this.employeeService
                .getById(task.employeeId),

            project:
              this.projectService
                .getById(task.projectId)

          })
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe({

              next: (data) => {

                console.log(
                  'TASK EMPLOYEE:',
                  data.employee
                );

                console.log(
                  'TASK PROJECT:',
                  data.project
                );


                /*
                 * Store related data.
                 */
                this.employee =
                  data.employee;

                this.project =
                  data.project;


                /*
                 * All required data has loaded.
                 */
                this.loading = false;


                /*
                 * Important because this component
                 * uses OnPush change detection.
                 */
                this.changeDetector
                  .markForCheck();

              },


              error: (error) => {

                console.error(
                  'TASK RELATED DATA ERROR:',
                  error
                );


                /*
                 * Task loaded, but employee/project
                 * information could not be loaded.
                 */
                this.loading = false;

                this.errorMessage =
                  'Unable to load employee or project details.';


                this.changeDetector
                  .markForCheck();

              }

            });

        },


        error: (error) => {

          console.error(
            'TASK DETAILS ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to load task details.';


          this.changeDetector
            .markForCheck();

        }

      });

  }


  /**
   * Clean up subscriptions when
   * the component is destroyed.
   */
  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}