import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs';

import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project';


@Component({
  selector: 'app-project-list',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectList implements OnInit, OnDestroy {

  /*
   * Complete project list received from JSON Server.
   */
  projects: Project[] = [];


  /*
   * Projects displayed after search/filter.
   */
  filtered: Project[] = [];


  /*
   * Page state.
   */
  loading = true;

  errorMessage = '';


  /*
   * Search input.
   */
  readonly search = new FormControl('');


  /*
   * Selected project status.
   */
  status = 'All Status';


  /*
   * Used to unsubscribe when the component
   * is destroyed.
   */
  private readonly destroy$ = new Subject<void>();


  constructor(
    private readonly service: ProjectService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    /*
     * Load projects when the page opens.
     */
    this.load();


    /*
     * Search handling.
     *
     * debounceTime()
     * waits until the user stops typing.
     *
     * distinctUntilChanged()
     * prevents duplicate searches.
     */
    this.search.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {

        this.applyFilters();

        /*
         * Important because this component
         * uses OnPush change detection.
         */
        this.changeDetector.markForCheck();

      });

  }


  /**
   * Load projects from JSON Server.
   */
  load(): void {

    this.loading = true;

    this.errorMessage = '';


    /*
     * Tell Angular that loading state changed.
     */
    this.changeDetector.markForCheck();


    this.service
      .getAll()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data) => {

          console.log(
            'PROJECTS FROM API:',
            data
          );


          /*
           * Store API data.
           */
          this.projects = data;


          /*
           * Apply current search/filter.
           */
          this.applyFilters();


          /*
           * API request finished.
           */
          this.loading = false;


          /*
           * Very important for OnPush.
           *
           * Without this, the page can remain
           * showing "Loading projects..."
           * until another UI event happens.
           */
          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'PROJECT GET ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to load projects. Make sure JSON Server is running.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Apply search and status filters.
   */
  applyFilters(): void {

    const term =
      (this.search.value ?? '')
        .toLowerCase()
        .trim();


    this.filtered =
      this.projects.filter(project => {

        const projectName =
          project.name?.toLowerCase() ?? '';


        const projectManager =
          project.manager?.toLowerCase() ?? '';


        /*
         * Search by project name or manager.
         */
        const matchesSearch =
          !term ||
          projectName.includes(term) ||
          projectManager.includes(term);


        /*
         * Filter by status.
         */
        const matchesStatus =
          this.status === 'All Status' ||
          project.status === this.status;


        return (
          matchesSearch &&
          matchesStatus
        );

      });


    /*
     * Make the updated filtered list visible
     * immediately with OnPush.
     */
    this.changeDetector.markForCheck();

  }


  /**
   * Called when the status dropdown changes.
   */
  onStatusChange(): void {

    this.applyFilters();

  }


  /**
   * Clear search and status filter.
   */
  clearFilters(): void {

    /*
     * Do not trigger valueChanges here.
     * We will apply the filter once manually.
     */
    this.search.setValue('', {
      emitEvent: false
    });


    this.status = 'All Status';


    this.applyFilters();


    this.changeDetector.markForCheck();

  }


  /**
   * Delete a project.
   */
  deleteProject(id: string): void {

    const confirmed =
      confirm('Delete this project?');


    if (!confirmed) {
      return;
    }


    this.loading = true;

    this.errorMessage = '';


    this.changeDetector.markForCheck();


    this.service
      .delete(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: () => {

          console.log(
            'PROJECT DELETED:',
            id
          );


          /*
           * Remove the deleted project
           * from the local array.
           *
           * There is no need to make
           * another GET request.
           */
          this.projects =
            this.projects.filter(
              project =>
                String(project.id) !== String(id)
            );


          /*
           * Recalculate the displayed list.
           */
          this.applyFilters();


          this.loading = false;


          this.changeDetector.markForCheck();

        },


        error: (error) => {

          console.error(
            'PROJECT DELETE ERROR:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Unable to delete project.';


          this.changeDetector.markForCheck();

        }

      });

  }


  /**
   * Clean up all subscriptions.
   */
  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}