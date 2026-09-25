import { Injectable, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenKey = 'auth_token';

  login(email: string, password: string): boolean {
    if (email === 'admin@example.com' && password === 'admin123') {
      this.setToken('demo-auth-token');
      return true;
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) &&
      !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.tokenKey)
      : null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }
}
