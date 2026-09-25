import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee';


@Component({
  selector: 'app-employee-details',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetails implements OnInit, OnDestroy {

  employee?: Employee;

  loading = true;

  saving = false;

  errorMessage = '';

  editMode = false;


  readonly form;


  /*
   * Used to clean up API subscriptions
   * when the component is destroyed.
   */
  private readonly destroy$ = new Subject<void>();


  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef
  ) {

    this.form = this.formBuilder.group({

      id: [
        '',
        Validators.required
      ],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      department: [
        '',
        Validators.required
      ],

      role: [
        '',
        Validators.required
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      status: [
        'Active',
        Validators.required
      ]

    });

  }


  ngOnInit(): void {

    /*
     * Check whether the current URL is:
     *
     * /employees/1
     *
     * or:
     *
     * /employees/1/edit
     */
    this.editMode =
      this.route.snapshot.url.some(
        segment => segment.path === 'edit'
      );


    const id =
      this.route.snapshot.paramMap.get('id');


    /*
     * No employee ID in the URL.
     */
    if (!id) {

      this.errorMessage =
        'Employee not found.';

      this.loading = false;

      this.changeDetector.markForCheck();

      return;
    }


    this.loadEmployee(id);

  }


  /**
   * Load employee details from JSON Server.
   */
  private loadEmployee(id: string): void {

    this.loading = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    this.service
      .getById(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (employee) => {

          console.log(
            'EMPLOYEE DETAILS:',
            employee
          );


          this.employee = employee;


          /*
           * Fill the reactive form with
           * employee information.
           */
          this.form.patchValue(employee);


          this.loading = false;


          /*
           * Important when using OnPush.
           *
           * API response changed the component
           * state, so tell Angular to check
           * this component.
           */
          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'EMPLOYEE DETAILS ERROR:',
            error
          );


          this.errorMessage =
            'Unable to load employee details.';

          this.loading = false;


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Save employee changes.
   */
  save(): void {

    /*
     * Do not save when employee is missing
     * or the form contains invalid data.
     */
    if (!this.employee || this.form.invalid) {

      this.form.markAllAsTouched();

      this.changeDetector.markForCheck();

      return;
    }


    this.saving = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    const updatedEmployee: Employee = {
      ...this.employee,
      ...this.form.getRawValue()
    } as Employee;


    this.service
      .update(
        this.employee.id,
        updatedEmployee
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (employee) => {

          console.log(
            'EMPLOYEE UPDATED:',
            employee
          );


          this.employee = employee;

          this.form.patchValue(employee);

          this.editMode = false;

          this.saving = false;


          /*
           * Refresh the view immediately.
           */
          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'EMPLOYEE UPDATE ERROR:',
            error
          );


          this.errorMessage =
            'Unable to update employee.';

          this.saving = false;


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