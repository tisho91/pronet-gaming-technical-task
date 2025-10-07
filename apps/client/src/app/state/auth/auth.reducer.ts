import { createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';

export interface AuthState {
  isLoading: boolean;
  error: string[] | null;
  isAuthenticated: boolean;
  authCheckFinished: boolean;
}

export const initialState = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
  authCheckFinished: false,
};

export const authReducer = createReducer<AuthState>(
  initialState,
  on(authActions.register, (state) => {
    return { ...state, isLoading: true, error: null };
  }),
  on(authActions.login, (state) => {
    return { ...state, isLoading: true, error: null };
  }),
  on(authActions.initSession, (state) => {
    return { ...state, isLoading: true, isAuthenticated: false };
  }),
  on(authActions.initSessionSuccess, (state) => {
    return { ...state, isLoading: false, isAuthenticated: true, authCheckFinished: true };
  }),
  on(authActions.initSessionFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      isAuthenticated: false,
      authCheckFinished: true,
      error: action.error || null,
    };
  }),
  on(authActions.logout, (state) => {
    return {
      ...state,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      authCheckFinished: true,
    };
  }),
);
