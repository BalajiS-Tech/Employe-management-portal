import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee';


@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee implements OnDestroy {

  readonly employeeForm;

  isSubmitting = false;

  successMessage = '';

  errorMessage = '';

  private readonly destroy$ = new Subject<void>();


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly router: Router
  ) {

    this.employeeForm = this.formBuilder.group({

      id: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$')
        ]
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

      status: [
        'Active',
        Validators.required
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ]

    });

  }


  /**
   * Add a new employee
   */
  addEmployee(): void {

    this.successMessage = '';
    this.errorMessage = '';


    // Stop if form is invalid
    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();

      return;
    }


    this.isSubmitting = true;


    const value = this.employeeForm.getRawValue();


    const employee: Employee = {

      id: String(value.id),

      name: value.name ?? '',

      email: value.email ?? '',

      department: value.department ?? '',

      role: value.role ?? '',

      status: (value.status ?? 'Active') as Employee['status'],

      phone: value.phone ?? ''

    };


    // Check whether the employee ID already exists
    this.employeeService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (employees) => {

          const alreadyExists = employees.some(
            item => String(item.id) === employee.id
          );


          if (alreadyExists) {

            this.errorMessage =
              `Employee ID ${employee.id} already exists.`;

            this.isSubmitting = false;

            return;
          }


          // Create employee
          this.createEmployee(employee);

        },


        error: () => {

          this.errorMessage =
            'Unable to connect to the employee API.';

          this.isSubmitting = false;

        }

      });

  }


  /**
   * Send employee data to JSON Server
   */
  private createEmployee(employee: Employee): void {

    this.employeeService
      .create(employee)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (response) => {

          console.log(
            'Employee created successfully:',
            response
          );


          this.successMessage =
            'Employee added successfully.';

          this.isSubmitting = false;


          // Return to employee list
          setTimeout(() => {

            this.router.navigate(['/employees']);

          }, 500);

        },


        error: (error) => {

          console.error(
            'Unable to create employee:',
            error
          );


          this.errorMessage =
            'Unable to save employee. Check JSON Server.';

          this.isSubmitting = false;

        }

      });

  }


  // Form controls for validation messages

  get id() {
    return this.employeeForm.controls.id;
  }

  get name() {
    return this.employeeForm.controls.name;
  }

  get email() {
    return this.employeeForm.controls.email;
  }

  get department() {
    return this.employeeForm.controls.department;
  }

  get role() {
    return this.employeeForm.controls.role;
    
  }

  get status() {
    return this.employeeForm.controls.status;
  }

  get phone() {
    return this.employeeForm.controls.phone;
  }


  /**
   * Clean up subscriptions
   */
  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}






