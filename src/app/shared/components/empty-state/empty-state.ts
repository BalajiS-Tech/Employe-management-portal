import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <section class="empty-state">
      <div class="empty-icon">⌁</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      @if (action) {
        <ng-container [ngTemplateOutlet]="action"></ng-container>
      }
    </section>
  `,
  styles: [`
    .empty-state{text-align:center;padding:55px 20px;color:#667085}
    .empty-icon{font-size:32px;margin-bottom:8px}
    h3{margin:0 0 6px;color:#1f2937;font-size:16px}
    p{margin:0 0 15px;font-size:13px}
  `]
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = 'There are no records to display.';
  @ContentChild('action') action?: TemplateRef<unknown>;
}
