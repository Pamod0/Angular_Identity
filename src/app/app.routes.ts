import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { ConfirmEmailComponent } from './features/auth/confirm-email/confirm-email.component';
import { ResendConfirmationComponent } from './features/auth/resend-confirmation/resend-confirmation.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'confirm-email', component: ConfirmEmailComponent },

  { path: 'resend-confirmation', component: ResendConfirmationComponent },

  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canLoad: [authGuard],
  },

  { path: '**', redirectTo: 'login' },
];
