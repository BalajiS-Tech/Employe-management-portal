import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  loginError = '';

  loginForm = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    rememberMe: [false]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;

    const success = this.authService.login(
      email ?? '',
      password ?? ''
    );

    if (!success) {
      this.loginError = 'Invalid email or password';
      return;
    }

    console.log('Login successful');
    this.router.navigate(['/dashboard']);
  }
}