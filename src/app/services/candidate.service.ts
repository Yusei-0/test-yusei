import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Candidate } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private supabaseService: SupabaseService) {}

  async getTopCandidates(limit: number = 10): Promise<Candidate[]> {
    const candidates = await this.supabaseService.getCandidates();
    return candidates
      .filter(c => c.approved)
      .sort((a, b) => b.verifiedVotes - a.verifiedVotes)
      .slice(0, limit);
  }

  async searchCandidates(query: string): Promise<Candidate[]> {
    const candidates = await this.supabaseService.getCandidates();
    return candidates.filter(c =>
      c.approved && c.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async proposeCandidate(name: string, photo: File): Promise<void> {
    const photoUrl = await this.supabaseService.uploadFile('candidates', `${Date.now()}_${photo.name}`, photo);
    await this.supabaseService.proposeCandidate({ name, photoUrl });
  }
}
