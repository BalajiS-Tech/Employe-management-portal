import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project';

@Component({
  selector: 'app-add-project',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-project.html',
  styleUrl: './add-project.css'
})
export class AddProject {
  readonly form;
  saving = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: ProjectService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      manager: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Planning', Validators.required],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.service.create(this.form.getRawValue() as any).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: () => { this.errorMessage = 'Unable to create project.'; this.saving = false; }
    });
  }
}
