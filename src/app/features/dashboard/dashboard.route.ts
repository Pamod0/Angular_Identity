import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent),
    loadChildren: () =>
      import('../admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  }
];
