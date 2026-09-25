import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  readonly collapsed = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  toggleSidebar(): void {
    this.collapsed.update(value => !value);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
