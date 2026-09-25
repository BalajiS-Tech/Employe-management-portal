import { NgModule } from '@angular/core';
import { EmptyStateComponent } from './components/empty-state/empty-state';
import { StatusBadgeDirective } from './directives/status-badge';
import { StatusLabelPipe } from './pipes/status-label';

/**
 * Kept as a small NgModule example for the assessment's
 * Modules topic. The application itself uses standalone components.
 */
@NgModule({
  imports: [EmptyStateComponent, StatusBadgeDirective, StatusLabelPipe],
  exports: [EmptyStateComponent, StatusBadgeDirective, StatusLabelPipe]
})
export class SharedModule {}
