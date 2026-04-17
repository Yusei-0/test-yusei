import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private supabaseService: SupabaseService) {}

  async login(email: string, password: string): Promise<boolean> {
    // Implement with Supabase auth
    // For now, placeholder
    if (email === 'admin@example.com' && password === 'password') {
      this.currentUser = { id: '1', email, role: 'admin' };
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
