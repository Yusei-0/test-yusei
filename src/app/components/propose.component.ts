import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from '../services/candidate.service';

@Component({
  selector: 'app-propose',
  imports: [ReactiveFormsModule],
  template: `
    <div class="propose">
      <h1>Proponer un Candidato</h1>

      <form [formGroup]="proposeForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="name">Nombre del Candidato:</label>
          <input id="name" type="text" formControlName="name">
        </div>

        <div>
          <label for="photo">Foto del Candidato:</label>
          <input id="photo" type="file" (change)="onFileSelected($event)" accept="image/*">
        </div>

        <button type="submit" [disabled]="!proposeForm.valid || !selectedFile">Proponer Candidato</button>
      </form>
    </div>
  `,
  styles: [`
    .propose { padding: 20px; }
    form div { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; }
    button { padding: 10px 20px; }
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
