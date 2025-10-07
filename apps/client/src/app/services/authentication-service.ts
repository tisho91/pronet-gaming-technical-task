import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { LoginUser, RegisterUser } from '@pronet/shared';
import { SKIP_ERROR_INTERCEPTOR } from '../interceptors/http-error-interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(user: LoginUser) {
    return this.http.post('/api/user/login', user);
  }

  register(user: RegisterUser) {
    return this.http.post('/api/user/register', user);
  }

  loadUser(token: string) {
    const context = new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true);
    return this.http.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      context,
    });
  }
}
