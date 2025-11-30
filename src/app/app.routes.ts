import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // --- AUTH без layout ---
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

  // --- APP з layout ---
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./app').then(m => m.App),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'budget',
        loadComponent: () =>
          import('./features/budget/budget/budget')
            .then(m => m.Budget)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar/calendar')
            .then(m => m.Calendar)
      },
      {
        path: 'shopping',
        loadComponent: () =>
          import('./features/shopping/shopping/shopping')
            .then(m => m.Shopping)
      }
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];
