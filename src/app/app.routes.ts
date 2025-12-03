import { Routes } from '@angular/router';
import { PublicLayout } from './layout/public-layout/public-layout';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ---------- PUBLIC ROUTES ----------
  {
    path: 'auth',
    component: PublicLayout,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then(m => m.RegisterComponent)
      },
      { path: '**', redirectTo: 'login' }
    ]
  },

  // ---------- PRIVATE ROUTES ----------
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'shopping',
        loadComponent: () =>
          import('./features/shopping/shopping/shopping').then(m => m.ShoppingComponent)
      }
    ]
  },

  // Default redirect
  { path: '**', redirectTo: 'auth/login' }
];