import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../services/vote.service';
import { SupabaseService } from '../services/supabase.service';
import { Vote } from '../models/interfaces';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  template: `
    <div class="admin">
      <h1>Panel de Administración</h1>

      <div class="pending-votes">
        <h2>Votos Pendientes</h2>
        <div *ngFor="let vote of pendingVotes()">
          <div class="vote-item">
            <p><strong>Nombre:</strong> {{ vote.voterName }} {{ vote.voterLastName }}</p>
            <p><strong>CI:</strong> {{ vote.voterCI }}</p>
            <img [src]="getSignedUrl(vote.idPhotoUrl)" alt="Foto CI" width="200">
            <button (click)="approveVote(vote.id)">Verificar Voto</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin { padding: 20px; }
    .vote-item { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
    button { padding: 5px 10px; }
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
}
