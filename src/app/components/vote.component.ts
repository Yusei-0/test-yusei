import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from '../services/candidate.service';
import { VoteService } from '../services/vote.service';
import { Candidate } from '../models/interfaces';

@Component({
  selector: 'app-vote',
  imports: [ReactiveFormsModule],
  template: `
    <div class="vote-page animate-fade-in">
      <header class="page-header">
        <div class="container">
          <h1 class="page-title">🗳️ Votar por un Candidato</h1>
          <p class="page-subtitle">Tu voto es secreto y seguro</p>
        </div>
      </header>

      <main class="container">
        <div class="vote-form-card card mt-6">
          <div class="card-body">
            <form [formGroup]="voteForm" (ngSubmit)="onSubmit()" class="vote-form">
              <div class="form-section">
                <h3 class="section-title mb-4">📋 Datos del Voter</h3>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="voterName" class="input-label">Nombre *</label>
                    <input 
                      id="voterName" 
                      type="text" 
                      formControlName="voterName" 
                      class="input"
                      placeholder="Ingresa tu nombre"
                    >
                    <small *ngIf="voteForm.get('voterName')?.invalid && voteForm.get('voterName')?.touched" class="error-text">
                      El nombre es requerido
                    </small>
                  </div>

                  <div class="form-group">
                    <label for="voterLastName" class="input-label">Apellidos *</label>
                    <input 
                      id="voterLastName" 
                      type="text" 
                      formControlName="voterLastName" 
                      class="input"
                      placeholder="Ingresa tus apellidos"
                    >
                    <small *ngIf="voteForm.get('voterLastName')?.invalid && voteForm.get('voterLastName')?.touched" class="error-text">
                      Los apellidos son requeridos
                    </small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="voterCI" class="input-label">Cédula de Identidad *</label>
                  <input 
                    id="voterCI" 
                    type="text" 
                    formControlName="voterCI" 
                    class="input"
                    placeholder="Ej: 12345678"
                  >
                  <small *ngIf="voteForm.get('voterCI')?.invalid && voteForm.get('voterCI')?.touched" class="error-text">
                    La cédula es requerida
                  </small>
                </div>
              </div>

              <div class="form-section mt-6">
                <h3 class="section-title mb-4">📸 Foto del Carnet</h3>
                
                <div class="form-group">
                  <label for="idPhoto" class="input-label">Subir foto del carnet de identidad *</label>
                  <input 
                    id="idPhoto" 
                    type="file" 
                    (change)="onFileSelected($event)" 
                    accept="image/*"
                    class="file-input"
                  >
                  <div *ngIf="selectedFile" class="file-preview mt-4">
                    <div class="badge badge-success">
                      ✓ {{ selectedFile.name }}
                    </div>
                  </div>
                  <small *ngIf="!selectedFile && voteForm.touched" class="error-text">
                    Debes subir una foto de tu carnet
                  </small>
                </div>
              </div>

              <div class="form-section mt-6">
                <h3 class="section-title mb-4">👤 Seleccionar Candidato</h3>
                
                <div class="form-group">
                  <label for="candidateId" class="input-label">Candidato *</label>
                  <select id="candidateId" formControlName="candidateId" class="select">
                    <option value="">Seleccione un candidato</option>
                    <option *ngFor="let candidate of candidates()" [value]="candidate.id">
                      {{ candidate.name }}
                    </option>
                  </select>
                  <small *ngIf="voteForm.get('candidateId')?.invalid && voteForm.get('candidateId')?.touched" class="error-text">
                    Debes seleccionar un candidato
                  </small>
                </div>
              </div>

              <div class="form-actions mt-8">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg w-100" 
                  [disabled]="!voteForm.valid || !selectedFile"
                >
                  🚀 Enviar Voto
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .vote-page {
      min-height: 100vh;
      padding-bottom: $spacing-8;
    }

    .page-header {
      background: linear-gradient(135deg, $color-primary 0%, $color-secondary 100%);
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

    .vote-form-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .section-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $color-gray-800;
      display: flex;
      align-items: center;
      gap: $spacing-2;
    }

    .form-section {
      padding: $spacing-4 0;
      border-bottom: 1px solid $color-gray-100;

      &:last-child {
        border-bottom: none;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-4;

      @media (min-width: $breakpoint-md) {
        grid-template-columns: 1fr 1fr;
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
export class VoteComponent implements OnInit {
  voteForm: FormGroup;
  candidates = signal<Candidate[]>([]);
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private voteService: VoteService,
    private router: Router
  ) {
    this.voteForm = this.fb.group({
      voterName: ['', Validators.required],
      voterLastName: ['', Validators.required],
      voterCI: ['', Validators.required],
      candidateId: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.candidates.set(await this.candidateService.getTopCandidates(50)); // Get more for selection
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    if (this.voteForm.valid && this.selectedFile) {
      const formValue = this.voteForm.value;
      await this.voteService.submitVote(
        formValue.candidateId,
        formValue.voterName,
        formValue.voterLastName,
        formValue.voterCI,
        this.selectedFile
      );
      alert('Voto enviado. Esperando verificación.');
      this.router.navigate(['/']);
    }
  }
}
