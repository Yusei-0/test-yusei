import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../services/candidate.service';
import { Candidate } from '../models/interfaces';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Sistema de Democracia Participativa</h1>

      <div class="top-10">
        <h2>Top 10 Candidatos</h2>
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Nombre</th>
              <th>Foto</th>
              <th>Votos Totales</th>
              <th>Votos Verificados</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let candidate of topCandidates(); let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ candidate.name }}</td>
              <td><img [src]="candidate.photoUrl" alt="Foto de {{ candidate.name }}" width="50"></td>
              <td>{{ candidate.totalVotes }}</td>
              <td>{{ candidate.verifiedVotes }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="search">
        <input type="text" placeholder="Buscar candidato..." (input)="onSearch($event)">
        <ul *ngIf="searchResults().length > 0">
          <li *ngFor="let candidate of searchResults()">
            {{ candidate.name }} - Votos Verificados: {{ candidate.verifiedVotes }}
          </li>
        </ul>
      </div>

      <div class="actions">
        <button (click)="goToVote()">Votar</button>
        <button (click)="goToPropose()">Proponer Candidato</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .actions button { margin: 10px; padding: 10px 20px; font-size: 16px; }
  `]
})
export class DashboardComponent implements OnInit {
  topCandidates = signal<Candidate[]>([]);
  searchResults = signal<Candidate[]>([]);

  constructor(private candidateService: CandidateService, private router: Router) {}

  async ngOnInit() {
    this.topCandidates.set(await this.candidateService.getTopCandidates());
  }

  async onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query.length > 2) {
      this.searchResults.set(await this.candidateService.searchCandidates(query));
    } else {
      this.searchResults.set([]);
    }
  }

  goToVote() {
    this.router.navigate(['/vote']);
  }

  goToPropose() {
    this.router.navigate(['/propose']);
  }
}
