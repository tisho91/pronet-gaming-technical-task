import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./router/authentication.routes').then((route) => route.AuthenticationRoutes),
      },
    ],
  },
];
