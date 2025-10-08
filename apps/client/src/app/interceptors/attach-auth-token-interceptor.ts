import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { selectToken } from '../state/user/user.selectors';
import { switchMap, take } from 'rxjs';

export const ATTACH_TOKEN_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const attachAuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const shouldAttach = req.context.get(ATTACH_TOKEN_INTERCEPTOR);
  if (!shouldAttach) return next(req);
  return store.select(selectToken).pipe(
    take(1),
    switchMap((token: string | null) => {
      let clonedReq = req;

      if (token) {
        clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next(clonedReq);
    }),
  );
};
