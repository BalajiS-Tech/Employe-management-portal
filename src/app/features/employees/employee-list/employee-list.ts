import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs';

import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee';

import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { StatusBadgeDirective } from '../../../shared/directives/status-badge';
import { StatusLabelPipe } from '../../../shared/pipes/status-label';


@Component({
  selector: 'app-employee-list',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    EmptyStateComponent,
    PageHeaderComponent,
    StatusBadgeDirective,
    StatusLabelPipe
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',

  // Keep OnPush for the assessment.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeList implements OnInit, OnDestroy {

  @ViewChild('searchInput')
  searchInput?: ElementRef<HTMLInputElement>;


  employees: Employee[] = [];

  filteredEmployees: Employee[] = [];

  loading = false;

  errorMessage = '';


  readonly searchControl = new FormControl('');


  department = 'All Departments';

  status = 'All Status';

  showFilters = false;


  private readonly destroy$ = new Subject<void>();


  constructor(
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadEmployees();


    /*
     * Search:
     *
     * debounceTime()
     * waits for the user to stop typing.
     *
     * distinctUntilChanged()
     * avoids processing the same value again.
     */
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {

        this.applyEmployeeFilters();

        this.changeDetector.markForCheck();

      });

  }


  /**
   * Load employees from JSON Server.
   */
  loadEmployees(): void {

    this.loading = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    this.employeeService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (data) => {

          console.log(
            'EMPLOYEES FROM API:',
            data
          );


          this.employees = data;

          this.applyEmployeeFilters();

          this.loading = false;


          /*
           * Important for OnPush.
           *
           * The API response changed component
           * properties, so tell Angular to check
           * this component.
           */
          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'EMPLOYEE GET ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to load employees. Make sure JSON Server is running.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Apply search, department and status filters.
   */
  applyEmployeeFilters(): void {

    const searchTerm =
      (this.searchControl.value ?? '')
        .trim()
        .toLowerCase();


    this.filteredEmployees =
      this.employees.filter(employee => {

        const matchesSearch =
          !searchTerm ||
          employee.name
            .toLowerCase()
            .includes(searchTerm) ||
          employee.email
            .toLowerCase()
            .includes(searchTerm) ||
          employee.department
            .toLowerCase()
            .includes(searchTerm);


        const matchesDepartment =
          this.department === 'All Departments' ||
          employee.department === this.department;


        const matchesStatus =
          this.status === 'All Status' ||
          employee.status === this.status;


        return (
          matchesSearch &&
          matchesDepartment &&
          matchesStatus
        );

      });

  }


  /**
   * Show / hide filters.
   */
  toggleFilters(): void {

    this.showFilters = !this.showFilters;

    this.changeDetector.markForCheck();

  }


  /**
   * Apply selected department and status.
   */
  applyFilters(): void {

    this.applyEmployeeFilters();

    this.changeDetector.markForCheck();

  }


  /**
   * Clear search and filters.
   */
  clearFilters(): void {

    this.searchControl.setValue(
      '',
      {
        emitEvent: false
      }
    );

    this.department = 'All Departments';

    this.status = 'All Status';


    this.applyEmployeeFilters();

    this.changeDetector.markForCheck();

  }


  /**
   * Open Add Employee page.
   */
  openAddEmployee(): void {

    this.router.navigate([
      '/employees/add'
    ]);

  }


  /**
   * Focus search input.
   */
  focusSearch(): void {

    this.searchInput?.nativeElement.focus();

  }


  /**
   * Delete employee.
   */
  deleteEmployee(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this employee?'
    );


    if (!confirmed) {
      return;
    }


    this.loading = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    this.employeeService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: () => {

          console.log(
            'Employee deleted:',
            id
          );


          /*
           * Remove employee from the local array.
           * No additional GET request is necessary.
           */
          this.employees =
            this.employees.filter(
              employee =>
                String(employee.id) !== String(id)
            );


          this.applyEmployeeFilters();

          this.loading = false;


          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'DELETE ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to delete employee.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Clean up subscriptions.
   */
  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}