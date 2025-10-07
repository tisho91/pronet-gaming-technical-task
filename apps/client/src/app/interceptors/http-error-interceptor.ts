import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorPopup } from '../components/error-popup/error-popup';
import { MatDialog } from '@angular/material/dialog';

export const SKIP_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const popup = inject(MatDialog);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!req.context.get(SKIP_ERROR_INTERCEPTOR)) {
        const message = error.error?.error || 'An unknown error occurred';
        popup.open(ErrorPopup, {
          data: { errors: typeof message === 'string' ? [message] : message },
          panelClass: 'error-popup',
        });
      }
      return throwError(() => error);
    }),
  );
};
