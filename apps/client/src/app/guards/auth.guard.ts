import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthCheckFinished, selectIsAuthenticated } from '../state/auth/auth.selectors';
import { filter, map, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthCheckFinished).pipe(
    filter((isLoading) => isLoading),
    take(1),
    switchMap(() => store.select(selectIsAuthenticated)),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
  );
};
