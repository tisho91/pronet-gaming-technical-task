import { AuthenticationService } from './authentication-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SKIP_ERROR_INTERCEPTOR } from '../interceptors/http-error-interceptor';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Call correct endpoint', () => {
    it('POST user', () => {
      const mockUser = {
        email: 'test@mail.com',
        password: 'test',
      };
      service.login(mockUser).subscribe();
      const req = httpMock.expectOne('/api/user/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
    });

    it('POST register', () => {
      const mockUser = {
        name: 'test',
        email: 'test@mail.com',
        password: 'test',
      };
      service.register(mockUser).subscribe();
      const req = httpMock.expectOne('/api/user/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
    });

    it('GET user', () => {
      service.loadUser('mock token').subscribe((response) => {
        expect(response).toEqual({ id: 1, name: 'John Doe' });
      });
      const req = httpMock.expectOne('/api/user');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer mock token`);
      expect(req.request.context.get(SKIP_ERROR_INTERCEPTOR)).toBeTrue();

      req.flush({ id: 1, name: 'John Doe' });
    });
  });
});
