import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-page animate-fade-in">
      <div class="login-container">
        <div class="login-card card">
          <div class="card-body">
            <div class="login-header text-center mb-6">
              <div class="login-icon mb-4">🛡️</div>
              <h1 class="login-title">Administración</h1>
              <p class="login-subtitle">Ingresa tus credenciales para acceder</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <div class="form-group mb-4">
                <label for="email" class="input-label">Email *</label>
                <input 
                  id="email" 
                  type="email" 
                  formControlName="email" 
                  class="input"
                  placeholder="admin@ejemplo.com"
                >
                <small *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-text">
                  Ingresa un email válido
                </small>
              </div>

              <div class="form-group mb-6">
                <label for="password" class="input-label">Contraseña *</label>
                <input 
                  id="password" 
                  type="password" 
                  formControlName="password" 
                  class="input"
                  placeholder="••••••••"
                >
                <small *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-text">
                  La contraseña es requerida
                </small>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary btn-lg w-100" 
                [disabled]="!loginForm.valid"
              >
                🔐 Iniciar Sesión
              </button>
            </form>

            <div class="login-footer mt-6 text-center">
              <a href="/" class="text-sm text-gray">← Volver al inicio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, $color-gray-100 0%, $color-gray-200 100%);
      padding: $spacing-4;
    }

    .login-container {
      width: 100%;
      max-width: 440px;
    }

    .login-card {
      animation: scaleIn 0.4s ease-out;
    }

    .login-header {
      padding: $spacing-4 0;
    }

    .login-icon {
      font-size: 4rem;
      animation: slideUp 0.6s ease-out;
    }

    .login-title {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $color-gray-800;
      margin-bottom: $spacing-2;
      animation: slideUp 0.6s ease-out 0.1s backwards;
    }

    .login-subtitle {
      color: $color-gray-500;
      font-size: $font-size-base;
      animation: slideUp 0.6s ease-out 0.2s backwards;
    }

    .login-form {
      animation: slideUp 0.6s ease-out 0.3s backwards;
    }

    .error-text {
      color: $color-danger;
      font-size: $font-size-sm;
      margin-top: $spacing-1;
      display: block;
    }

    .login-footer {
      border-top: 1px solid $color-gray-100;
      padding-top: $spacing-4;
    }

    .w-100 {
      width: 100%;
    }
  `]
})
export class AdminLoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = await this.authService.login(email, password);
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }
}
