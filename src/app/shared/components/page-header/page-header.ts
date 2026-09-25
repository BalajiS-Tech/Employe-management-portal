import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,

  template: `
    <header class="page-header">

      <div>

        <h1>
          {{ title }}
        </h1>

        <p>
          {{ subtitle }}
        </p>

      </div>

      @if (buttonLabel) {

        <button
          type="button"
          (click)="action.emit()"
        >
          {{ buttonLabel }}
        </button>

      }

    </header>
  `,

  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 22px;
    }

    h1 {
      margin: 0;
      font-size: 27px;
    }

    p {
      margin: 6px 0 0;
      color: #7c8794;
      font-size: 13px;
    }

    button {
      background: #2563eb;
      border: 0;
      color: #fff;
      padding: 11px 17px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    button:hover {
      background: #1d4ed8;
    }

    @media (max-width: 600px) {

      .page-header {
        align-items: flex-start;
        gap: 12px;
      }

    }
  `]
})
export class PageHeaderComponent {

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  buttonLabel = '';

  @Output()
  readonly action = new EventEmitter<void>();

}