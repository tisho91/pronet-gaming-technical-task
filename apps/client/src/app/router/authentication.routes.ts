import { Routes } from '@angular/router';

export const authenticationRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../components/authentication/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../components/authentication/register/register').then((m) => m.Register),
  },
];
