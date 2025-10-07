import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./router/main.routes').then((route) => route.MainRoutes),
  },
  {
    path: '',
    component: LandingPage,
    loadChildren: () =>
      import('./router/authentication.routes').then((route) => route.AuthenticationRoutes),
  },
];
