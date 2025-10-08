import { TestBed } from '@angular/core/testing';
import {
  HttpContext,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { httpErrorInterceptor, SKIP_ERROR_INTERCEPTOR } from './http-error-interceptor';
import { Injector, runInInjectionContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';

xdescribe('httpErrorInterceptor', () => {
  let next: jasmine.Spy;
  let injector: Injector;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: spy }],
    });
    next = jasmine.createSpy('next');
    injector = TestBed.inject(Injector);
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should open ErrorPopup on error if SKIP_ERROR_INTERCEPTOR is false', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: { error: 'Something went wrong' },
    });

    next.and.returnValue(throwError(() => errorResponse));

    const req = new HttpRequest('GET', '/api/data');

    runInInjectionContext(injector, () => {
      httpErrorInterceptor(req, next as unknown as HttpHandlerFn).subscribe({
        error: (err) => {
          expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
            data: { errors: ['Something went wrong'] },
            panelClass: 'error-popup',
          });
          expect(err).toBe(errorResponse);
          done();
        },
      });
    });
  });

  it('should not open ErrorPopup if SKIP_ERROR_INTERCEPTOR is true', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: { error: 'Critical failure' },
    });

    next.and.returnValue(throwError(() => errorResponse));

    const context = new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true);
    const req = new HttpRequest('GET', '/api/data', { context });

    runInInjectionContext(injector, () => {
      httpErrorInterceptor(req, next as unknown as HttpHandlerFn).subscribe({
        error: (err) => {
          expect(dialogSpy.open).not.toHaveBeenCalled();
          expect(err).toBe(errorResponse);
          done();
        },
      });
    });
  });
});
