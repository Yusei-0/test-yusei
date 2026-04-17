import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-login">
      <h1>Login Administrador</h1>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="email">Email:</label>
          <input id="email" type="email" formControlName="email">
        </div>

        <div>
          <label for="password">Contraseña:</label>
          <input id="password" type="password" formControlName="password">
        </div>

        <button type="submit" [disabled]="!loginForm.valid">Iniciar Sesión</button>
      </form>
    </div>
  `,
  styles: [`
    .admin-login { padding: 20px; max-width: 400px; margin: 0 auto; }
    form div { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; }
    button { padding: 10px 20px; }
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
