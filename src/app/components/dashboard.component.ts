import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../services/candidate.service';
import { Candidate } from '../models/interfaces';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard animate-fade-in">
      <header class="dashboard-header">
        <div class="container">
          <h1 class="dashboard-title">Sistema de Democracia Participativa</h1>
          <p class="dashboard-subtitle">Tu voz cuenta, participa en el cambio</p>
        </div>
      </header>

      <main class="container">
        <section class="top-10 card mt-6">
          <div class="card-header">
            <h2 class="section-title">🏆 Top 10 Candidatos</h2>
          </div>
          <div class="card-body">
            <div class="table-container">
              <table class="table">
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
                    <td>
                      <span class="badge" [class.badge-primary]="i === 0" [class.badge-secondary]="i === 1" [class.badge-warning]="i === 2">
                        #{{ i + 1 }}
                      </span>
                    </td>
                    <td class="font-semibold">{{ candidate.name }}</td>
                    <td>
                      <div class="avatar avatar-sm">
                        <img [src]="candidate.photoUrl" alt="Foto de {{ candidate.name }}">
                      </div>
                    </td>
                    <td><span class="badge badge-primary">{{ candidate.totalVotes }}</span></td>
                    <td><span class="badge badge-success">{{ candidate.verifiedVotes }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="search card mt-6">
          <div class="card-body">
            <h3 class="section-title mb-4">🔍 Buscar Candidato</h3>
            <input 
              type="text" 
              class="input" 
              placeholder="Escribe el nombre del candidato..." 
              (input)="onSearch($event)"
            >
            <ul *ngIf="searchResults().length > 0" class="search-results mt-4">
              <li *ngFor="let candidate of searchResults()" class="search-result-item">
                <div class="flex items-center gap-4">
                  <div class="avatar avatar-sm">
                    <img [src]="candidate.photoUrl" alt="{{ candidate.name }}">
                  </div>
                  <div>
                    <p class="font-semibold">{{ candidate.name }}</p>
                    <p class="text-sm text-gray">Votos Verificados: <span class="text-success font-bold">{{ candidate.verifiedVotes }}</span></p>
                  </div>
                </div>
              </li>
            </ul>
            <p *ngIf="searchResults().length === 0 && searchQuery.length > 2" class="text-center text-gray mt-4">
              No se encontraron candidatos
            </p>
          </div>
        </section>

        <section class="actions card mt-6 mb-8">
          <div class="card-body text-center">
            <h3 class="section-title mb-6">¿Quieres participar?</h3>
            <div class="flex justify-center gap-4 flex-col md:flex-row">
              <button class="btn btn-primary btn-lg" (click)="goToVote()">
                🗳️ Votar Ahora
              </button>
              <button class="btn btn-secondary btn-lg" (click)="goToPropose()">
                ✨ Proponer Candidato
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      padding-bottom: $spacing-8;
    }

    .dashboard-header {
      background: linear-gradient(135deg, $color-primary 0%, $color-secondary 100%);
      color: $color-white;
      padding: $spacing-12 $spacing-4;
      text-align: center;
      margin-bottom: $spacing-8;
      box-shadow: $shadow-lg;
    }

    .dashboard-title {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      margin-bottom: $spacing-2;
      animation: slideUp 0.6s ease-out;
    }

    .dashboard-subtitle {
      font-size: $font-size-lg;
      opacity: 0.9;
      animation: slideUp 0.6s ease-out 0.2s backwards;
    }

    .section-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $color-gray-800;
    }

    .search-results {
      list-style: none;
      max-height: 300px;
      overflow-y: auto;
    }

    .search-result-item {
      padding: $spacing-3 $spacing-4;
      border-radius: $radius-lg;
      transition: background-color $transition-fast;

      &:hover {
        background-color: $color-gray-50;
      }

      &:not(:last-child) {
        border-bottom: 1px solid $color-gray-100;
      }
    }

    @media (min-width: $breakpoint-md) {
      .dashboard-title {
        font-size: $font-size-4xl;
      }
    }
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
