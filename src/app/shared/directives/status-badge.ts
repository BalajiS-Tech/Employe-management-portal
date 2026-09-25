import { Directive, ElementRef, Renderer2, inject, OnChanges, Input } from '@angular/core';

@Directive({
  selector: '[appStatusBadge]',
  standalone: true
})
export class StatusBadgeDirective implements OnChanges {
  @Input() appStatusBadge = '';

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(): void {
    const status = this.appStatusBadge.toLowerCase().replaceAll(' ', '-');
    this.renderer.addClass(this.element.nativeElement, `status-${status}`);
  }
}
