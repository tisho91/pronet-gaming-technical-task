import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './interceptors/http-error-interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './state/auth/auth.effects';
import { authReducer } from './state/auth/auth.reducer';
import { sessionInitializer } from './utils/sessionInitializer';
import { userReducer } from './state/user/user.reducer';
import { charactersReducer } from './state/characters/characters.reducer';
import { CharactersEffects } from './state/characters/characters.effects';
import { UserEffects } from './state/user/user.effects';
import { attachAuthTokenInterceptor } from './interceptors/attach-auth-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor, attachAuthTokenInterceptor])),
    provideStore(),
    provideState({ name: 'auth', reducer: authReducer }),
    provideState({ name: 'user', reducer: userReducer }),
    provideState({ name: 'characters', reducer: charactersReducer }),
    provideEffects(AuthEffects),
    provideEffects(CharactersEffects),
    provideEffects(UserEffects),
    provideAppInitializer(sessionInitializer),
  ],
};
