import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { VoteComponent } from './components/vote.component';
import { ProposeComponent } from './components/propose.component';
import { AdminComponent } from './components/admin.component';
import { AdminLoginComponent } from './components/admin-login.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'vote', component: VoteComponent },
  { path: 'propose', component: ProposeComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];
