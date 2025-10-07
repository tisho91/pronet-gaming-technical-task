import { createReducer, on } from '@ngrx/store';
import { userActions } from './user.actions';

export interface UserState {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    favoriteCharacters: string[];
  };
}

export const initialState = {
  token: '',
  user: {
    id: '',
    name: '',
    email: '',
    favoriteCharacters: [],
  },
};

export const userReducer = createReducer<UserState>(
  initialState,
  on(userActions.setData, (state, { user, token }) => {
    return { user, token };
  }),
  on(userActions.setUser, (state, { user }) => {
    return { ...state, user };
  }),

  on(userActions.setToken, (state, { token }) => {
    return { ...state, token };
  }),

  on(userActions.setCharacterFavoriteSuccess, (state, { characterId, favorite }) => {
    const favoriteList = state.user?.favoriteCharacters;
    const updated = favorite
      ? [...favoriteList, characterId]
      : favoriteList.filter((id: string) => id !== characterId);
    return { ...state, user: { ...state.user, favoriteCharacters: updated } };
  }),
);
