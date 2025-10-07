import { Routes } from '@angular/router';

export const AuthenticationRoutes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
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
