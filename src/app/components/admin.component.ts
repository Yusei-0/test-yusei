import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../services/vote.service';
import { SupabaseService } from '../services/supabase.service';
import { Vote } from '../models/interfaces';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  template: `
    <div class="admin-page animate-fade-in">
      <header class="page-header admin-header">
        <div class="container">
          <h1 class="page-title">🛡️ Panel de Administración</h1>
          <p class="page-subtitle">Gestiona las votaciones y verifica los votos</p>
        </div>
      </header>

      <main class="container">
        <section class="pending-votes-section card mt-6">
          <div class="card-header">
            <div class="flex justify-between items-center">
              <h2 class="section-title">⏳ Votos Pendientes de Verificación</h2>
              <span class="badge badge-warning">{{ pendingVotes().length }} pendientes</span>
            </div>
          </div>
          
          <div class="card-body">
            @if (pendingVotes().length === 0) {
              <div class="empty-state text-center p-8">
                <p class="text-2xl mb-4">✅</p>
                <p class="text-lg font-semibold">¡No hay votos pendientes!</p>
                <p class="text-gray mt-2">Todos los votos han sido verificados</p>
              </div>
            } @else {
              <div class="votes-grid">
                @for (vote of pendingVotes(); track vote.id) {
                  <div class="vote-item card">
                    <div class="card-body">
                      <div class="vote-header mb-4">
                        <div class="flex justify-between items-start">
                          <div>
                            <h3 class="font-bold text-lg">{{ vote.voterName }} {{ vote.voterLastName }}</h3>
                            <p class="text-sm text-gray">CI: <span class="font-mono">{{ vote.voterCI }}</span></p>
                          </div>
                          <span class="badge badge-warning">Pendiente</span>
                        </div>
                      </div>

                      <div class="vote-photo mb-4">
                        <p class="input-label mb-2">Foto del Carnet:</p>
                        <img 
                          [src]="getSignedUrl(vote.idPhotoUrl)" 
                          alt="Foto CI" 
                          class="ci-photo rounded-lg shadow-md"
                        >
                      </div>

                      <div class="vote-actions flex gap-4">
                        <button 
                          class="btn btn-success flex-1" 
                          (click)="approveVote(vote.id)"
                        >
                          ✓ Verificar Voto
                        </button>
                        <button 
                          class="btn btn-outline flex-1" 
                          (click)="rejectVote(vote.id)"
                        >
                          ✕ Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      padding-bottom: $spacing-8;
    }

    .admin-header {
      background: linear-gradient(135deg, $color-gray-700 0%, $color-gray-900 100%);
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

    .section-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $color-gray-800;
    }

    .votes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-6;

      @media (min-width: $breakpoint-md) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: $breakpoint-lg) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .vote-item {
      transition: transform $transition-fast, box-shadow $transition-fast;

      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-xl;
      }
    }

    .vote-header {
      border-bottom: 1px solid $color-gray-100;
      padding-bottom: $spacing-3;
    }

    .ci-photo {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      border: 1px solid $color-gray-200;
    }

    .vote-actions {
      border-top: 1px solid $color-gray-100;
      padding-top: $spacing-4;
    }

    .empty-state {
      padding: $spacing-12;
      background-color: $color-gray-50;
      border-radius: $radius-xl;
    }

    @media (min-width: $breakpoint-md) {
      .page-title {
        font-size: $font-size-4xl;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  pendingVotes = signal<Vote[]>([]);

  constructor(private voteService: VoteService, private supabaseService: SupabaseService) {}

  async ngOnInit() {
    this.pendingVotes.set(await this.voteService.getPendingVotes());
  }

  async getSignedUrl(path: string): Promise<string> {
    return await this.supabaseService.getSignedUrl('id-photos', path);
  }

  async approveVote(voteId: string) {
    await this.voteService.approveVote(voteId);
    // Refresh the list
    this.pendingVotes.set(await this.voteService.getPendingVotes());
  }

  async rejectVote(voteId: string) {
    if (confirm('¿Estás seguro de rechazar este voto?')) {
      // Implement reject logic here
      alert('Voto rechazado');
      this.pendingVotes.set(await this.voteService.getPendingVotes());
    }
  }
}
