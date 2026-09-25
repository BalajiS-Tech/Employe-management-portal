import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { forkJoin } from 'rxjs';

import { EmployeeService } from '../../core/services/employee';
import { ProjectService } from '../../core/services/project';
import { TaskService } from '../../core/services/task';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {

  readonly employees = signal(0);
  readonly projects = signal(0);
  readonly pending = signal(0);
  readonly completed = signal(0);
  readonly inProgress = signal(0);


  readonly totalTasks = computed(() => {
    return (
      this.pending() +
      this.inProgress() +
      this.completed()
    );
  });


  readonly errorMessage = signal('');


  constructor(
    private readonly employeeService: EmployeeService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}


  ngOnInit(): void {
    this.loadDashboard();
  }



  loadDashboard(): void {

    this.errorMessage.set('');


    forkJoin({

      employees: this.employeeService.getAll(),

      projects: this.projectService.getAll(),

      tasks: this.taskService.getAll()

    }).subscribe({

      next: (data) => {

       
        this.employees.set(
          data.employees.length
        );


       
        this.projects.set(
          data.projects.length
        );


        
        this.pending.set(
          data.tasks.filter(
            task => task.status === 'Pending'
          ).length
        );


       
        this.inProgress.set(
          data.tasks.filter(
            task => task.status === 'In Progress'
          ).length
        );


       
        this.completed.set(
          data.tasks.filter(
            task => task.status === 'Completed'
          ).length
        );

      },


      error: (error) => {

        console.error(
          'Dashboard API error:',
          error
        );

        this.errorMessage.set(
          'Dashboard data could not be loaded. Check JSON Server.'
        );

      }

    });

  }

}