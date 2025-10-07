import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from '../state/auth/auth.actions';

export const sessionInitializer = () => {
  const store = inject(Store);

  const token = localStorage.getItem('token');
  if (token) {
    store.dispatch(authActions.initSession({ token }));
  } else {
    store.dispatch(authActions.initSessionFailure({ error: null }));
  }
  return Promise.resolve();
};
