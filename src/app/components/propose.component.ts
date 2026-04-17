import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from '../services/candidate.service';

@Component({
  selector: 'app-propose',
  imports: [ReactiveFormsModule],
  template: `
    <div class="propose-page animate-fade-in">
      <header class="page-header">
        <div class="container">
          <h1 class="page-title">✨ Proponer un Candidato</h1>
          <p class="page-subtitle">Ayuda a construir el futuro de tu comunidad</p>
        </div>
      </header>

      <main class="container">
        <div class="propose-form-card card mt-6">
          <div class="card-body">
            <form [formGroup]="proposeForm" (ngSubmit)="onSubmit()" class="propose-form">
              <div class="form-section">
                <h3 class="section-title mb-4">📋 Información del Candidato</h3>
                
                <div class="form-group">
                  <label for="name" class="input-label">Nombre Completo del Candidato *</label>
                  <input 
                    id="name" 
                    type="text" 
                    formControlName="name" 
                    class="input"
                    placeholder="Ej: Juan Pérez García"
                  >
                  <small *ngIf="proposeForm.get('name')?.invalid && proposeForm.get('name')?.touched" class="error-text">
                    El nombre del candidato es requerido
                  </small>
                </div>
              </div>

              <div class="form-section mt-6">
                <h3 class="section-title mb-4">📸 Foto del Candidato</h3>
                
                <div class="form-group">
                  <label for="photo" class="input-label">Subir foto del candidato *</label>
                  <div class="file-upload-area">
                    <input 
                      id="photo" 
                      type="file" 
                      (change)="onFileSelected($event)" 
                      accept="image/*"
                      class="file-input"
                    >
                    <div class="file-upload-hint">
                      <p>📷 Formato: JPG, PNG o GIF</p>
                      <p>💡 Recomendado: Foto clara y frontal</p>
                    </div>
                  </div>
                  <div *ngIf="selectedFile" class="file-preview mt-4">
                    <div class="badge badge-success">
                      ✓ {{ selectedFile.name }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-actions mt-8">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg w-100" 
                  [disabled]="!proposeForm.valid || !selectedFile"
                >
                  🚀 Enviar Propuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .propose-page {
      min-height: 100vh;
      padding-bottom: $spacing-8;
    }

    .page-header {
      background: linear-gradient(135deg, $color-secondary 0%, $color-primary 100%);
      color: $color-white;
      padding: $spacing-12 $spacing-4;
      text-align: center;
      margin-bottom: $spacing-8;
      box-shadow: $shadow-lg;
    }

    .page-title {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      margin-bottom: $spacing-2;
      animation: slideUp 0.6s ease-out;
    }

    .page-subtitle {
      font-size: $font-size-lg;
      opacity: 0.9;
      animation: slideUp 0.6s ease-out 0.2s backwards;
    }

    .propose-form-card {
      max-width: 700px;
      margin: 0 auto;
    }

    .section-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $color-gray-800;
    }

    .form-section {
      padding: $spacing-4 0;
      border-bottom: 1px solid $color-gray-100;

      &:last-child {
        border-bottom: none;
      }
    }

    .form-group {
      margin-bottom: $spacing-4;
    }

    .error-text {
      color: $color-danger;
      font-size: $font-size-sm;
      margin-top: $spacing-1;
      display: block;
    }

    .file-upload-area {
      border: 2px dashed $color-gray-300;
      border-radius: $radius-lg;
      padding: $spacing-6;
      text-align: center;
      transition: all $transition-fast;

      &:hover {
        border-color: $color-primary;
        background-color: $color-primary-50;
      }
    }

    .file-upload-hint {
      margin-top: $spacing-3;
      font-size: $font-size-sm;
      color: $color-gray-500;

      p {
        margin-bottom: $spacing-1;
      }
    }

    .file-preview {
      padding: $spacing-3;
      background-color: $color-success-bg;
      border-radius: $radius-lg;
      display: inline-block;
    }

    .form-actions {
      text-align: center;
    }

    .w-100 {
      width: 100%;
    }

    @media (min-width: $breakpoint-md) {
      .page-title {
        font-size: $font-size-4xl;
      }
    }
  `]
})
export class ProposeComponent {
  proposeForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private router: Router
  ) {
    this.proposeForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    if (this.proposeForm.valid && this.selectedFile) {
      await this.candidateService.proposeCandidate(
        this.proposeForm.value.name,
        this.selectedFile
      );
      alert('Propuesta enviada. Esperando aprobación.');
      this.router.navigate(['/']);
    }
  }
}
