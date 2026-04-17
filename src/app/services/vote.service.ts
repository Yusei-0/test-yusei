import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Vote } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  constructor(private supabaseService: SupabaseService) {}

  async submitVote(candidateId: string, voterName: string, voterLastName: string, voterCI: string, idPhoto: File): Promise<void> {
    const idPhotoUrl = await this.supabaseService.uploadFile('id-photos', `${Date.now()}_${idPhoto.name}`, idPhoto);
    await this.supabaseService.submitVote({
      candidateId,
      voterName,
      voterLastName,
      voterCI,
      idPhotoUrl
    });
  }

  async getPendingVotes(): Promise<Vote[]> {
    return await this.supabaseService.getPendingVotes();
  }

  async approveVote(voteId: string): Promise<void> {
    await this.supabaseService.approveVote(voteId);
  }
}
