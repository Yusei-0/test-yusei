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
    <div class="vote">
      <h1>Votar por un Candidato</h1>

      <form [formGroup]="voteForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="voterName">Nombre:</label>
          <input id="voterName" type="text" formControlName="voterName">
        </div>

        <div>
          <label for="voterLastName">Apellidos:</label>
          <input id="voterLastName" type="text" formControlName="voterLastName">
        </div>

        <div>
          <label for="voterCI">CI:</label>
          <input id="voterCI" type="text" formControlName="voterCI">
        </div>

        <div>
          <label for="idPhoto">Foto del Carnet:</label>
          <input id="idPhoto" type="file" (change)="onFileSelected($event)" accept="image/*">
        </div>

        <div>
          <label for="candidateId">Seleccionar Candidato:</label>
          <select id="candidateId" formControlName="candidateId">
            <option value="">Seleccione un candidato</option>
            <option *ngFor="let candidate of candidates()" [value]="candidate.id">
              {{ candidate.name }}
            </option>
          </select>
        </div>

        <button type="submit" [disabled]="!voteForm.valid || !selectedFile">Enviar Voto</button>
      </form>
    </div>
  `,
  styles: [`
    .vote { padding: 20px; }
    form div { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input, select { width: 100%; padding: 8px; }
    button { padding: 10px 20px; }
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
