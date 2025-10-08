import { TestBed } from '@angular/core/testing';
import { HttpContext, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import {
  ATTACH_TOKEN_INTERCEPTOR,
  attachAuthTokenInterceptor,
} from './attach-auth-token-interceptor';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectToken } from '../state/user/user.selectors';
import { of } from 'rxjs';
import { Injector, runInInjectionContext } from '@angular/core';

describe('attachAuthTokenInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => attachAuthTokenInterceptor(req, next));

  let store: MockStore;
  let next: jasmine.Spy;
  let injector: Injector;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [{ selector: selectToken, value: 'mocked-token' }],
        }),
      ],
    });
    store = TestBed.inject(MockStore);
    next = jasmine.createSpy('next').and.returnValue(of({ type: 'SUCCESS' }) as any);
    injector = TestBed.inject(Injector);
  });

  it('should attach Authorization header when token exists and context attached', (done) => {
    const context = new HttpContext().set(ATTACH_TOKEN_INTERCEPTOR, true);
    const req = new HttpRequest('GET', '/api/data', { context });
    runInInjectionContext(injector, () => {
      attachAuthTokenInterceptor(req, next as unknown as HttpHandlerFn).subscribe(() => {
        const calledReq = next.calls.mostRecent().args[0];
        expect(calledReq.headers.get('Authorization')).toBe('Bearer mocked-token');
        done();
      });
    });
  });

  it('should not attach Authorization header if token is null', (done) => {
    store.overrideSelector(selectToken, null as any);
    store.refreshState();
    runInInjectionContext(injector, () => {
      const req = new HttpRequest('GET', '/api/data');
      attachAuthTokenInterceptor(req, next as unknown as HttpHandlerFn).subscribe(() => {
        const calledReq = next.calls.mostRecent().args[0];
        expect(calledReq.headers.has('Authorization')).toBeFalse();
        done();
      });
    });
  });

  it('should skip attaching header if ATTACH_TOKEN_INTERCEPTOR = false', (done) => {
    const context = new HttpContext().set(ATTACH_TOKEN_INTERCEPTOR, false);
    const req = new HttpRequest('GET', '/api/public', { context });

    runInInjectionContext(injector, () => {
      attachAuthTokenInterceptor(req, next as unknown as HttpHandlerFn).subscribe(() => {
        const calledReq = next.calls.mostRecent().args[0];
        expect(calledReq).toBe(req);
        expect(calledReq.headers.has('Authorization')).toBeFalse();
        done();
      });
    });
  });
});
