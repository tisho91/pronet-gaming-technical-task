import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.isLoading);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);
export const selectAuthCheckFinished = createSelector(
  selectAuthState,
  (state) => state.authCheckFinished,
);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
