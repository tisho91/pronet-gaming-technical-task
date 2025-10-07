import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthenticationService } from '../../services/authentication-service';
import { authActions } from './auth.actions';
import { map, mergeMap, of, pipe, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Action, Creator } from '@ngrx/store';
import { userActions } from '../user/user.actions';

type ActionCreatorFn = Creator<any[], Action>;

function handleAuthResponse() {
  return pipe(
    map((res: any) => {
      const { accessToken: token, ...user } = res;
      localStorage.setItem('token', token);
      return authActions.initSessionSuccess({
        token,
        user,
      });
    }),
    catchError((err) => of(authActions.initSessionFailure(err))),
  );
}

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);

  private router = inject(Router);
  private authService = inject(AuthenticationService);

  redirectOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.initSessionSuccess),
        tap(() => {
          return this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.login),
      mergeMap(({ user }) => {
        return this.authService.login(user).pipe(handleAuthResponse());
      }),
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.register),
      mergeMap(({ user }) => {
        return this.authService.register(user).pipe(handleAuthResponse());
      }),
    );
  });

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          return this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false, functional: true },
  );

  loadUserWithToken$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.initSession),
        mergeMap(({ token }) => {
          return this.authService.loadUser(token).pipe(
            map((res: any) => {
              return authActions.initSessionSuccess({ user: res, token });
            }),
            catchError((err) => {
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
              return of(authActions.initSessionFailure(err));
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  setUserDataOnSessionInitialized$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.initSessionSuccess),
        map(({ user, token }) => {
          return userActions.setData({ user, token });
        }),
      ),
    { functional: true },
  );
}
