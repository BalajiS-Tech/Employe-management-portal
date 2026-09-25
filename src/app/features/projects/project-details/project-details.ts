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

import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project';


@Component({
  selector: 'app-project-details',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetails implements OnInit, OnDestroy {

  /*
   * Project received from JSON Server.
   */
  project?: Project;


  /*
   * Determines whether the page is in
   * view mode or edit mode.
   */
  editMode = false;


  /*
   * Page state.
   */
  loading = true;

  saving = false;

  errorMessage = '';


  /*
   * Reactive form used for editing
   * project information.
   */
  readonly form;


  /*
   * Used to clean up subscriptions
   * when the component is destroyed.
   */
  private readonly destroy$ = new Subject<void>();


  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: ProjectService,
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
        Validators.required
      ],

      description: [
        '',
        Validators.required
      ],

      manager: [
        '',
        Validators.required
      ],

      startDate: [
        '',
        Validators.required
      ],

      endDate: [
        '',
        Validators.required
      ],

      status: [
        'Planning',
        Validators.required
      ],

      progress: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ]

    });

  }


  ngOnInit(): void {

    /*
     * Check whether the current URL is:
     *
     * /projects/1
     *
     * or:
     *
     * /projects/1/edit
     */
    this.editMode =
      this.route.snapshot.url.some(
        segment => segment.path === 'edit'
      );


    /*
     * Get project ID from the URL.
     */
    const id =
      this.route.snapshot.paramMap.get('id');


    /*
     * Stop if there is no project ID.
     */
    if (!id) {

      this.errorMessage =
        'Project not found.';

      this.loading = false;

      this.changeDetector.markForCheck();

      return;
    }


    this.loadProject(id);

  }


  /**
   * Load project details from JSON Server.
   */
  private loadProject(id: string): void {

    this.loading = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    this.service
      .getById(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (project) => {

          console.log(
            'PROJECT DETAILS:',
            project
          );


          /*
           * Store the project.
           */
          this.project = project;


          /*
           * Put project data into
           * the reactive form.
           */
          this.form.patchValue(project);


          /*
           * API request completed.
           */
          this.loading = false;


          /*
           * Important for OnPush.
           *
           * Tell Angular that the API response
           * changed the component state.
           */
          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'PROJECT DETAILS ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to load project.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Save project changes.
   */
  save(): void {

    /*
     * Don't save when the project doesn't exist
     * or the form is invalid.
     */
    if (!this.project || this.form.invalid) {

      this.form.markAllAsTouched();

      this.changeDetector.markForCheck();

      return;
    }


    this.saving = true;

    this.errorMessage = '';

    this.changeDetector.markForCheck();


    /*
     * Create the updated project object.
     *
     * Keeping the existing project first means
     * any fields not present in the form are preserved.
     */
    const updatedProject: Project = {
      ...this.project,
      ...this.form.getRawValue()
    } as Project;


    this.service
      .update(
        this.project.id,
        updatedProject
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (project) => {

          console.log(
            'PROJECT UPDATED:',
            project
          );


          /*
           * Store updated project.
           */
          this.project = project;


          /*
           * Update the form with the
           * latest server response.
           */
          this.form.patchValue(project);


          /*
           * Return to view mode.
           */
          this.editMode = false;

          this.saving = false;


          /*
           * Refresh OnPush view.
           */
          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'PROJECT UPDATE ERROR:',
            error
          );


          this.errorMessage =
            'Unable to update project.';

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