import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUser, LoginUser } from '@pronet/shared';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(user: LoginUser) {
    return this.http.post('/api/user/login', user);
  }

  register(user: BaseUser) {
    return this.http.post('/api/user/register', user);
  }
}
