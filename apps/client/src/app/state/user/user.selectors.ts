import { UserState } from './user.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectUserState = createFeatureSelector<UserState>('user');
export const selectUser = createSelector(selectUserState, (state) => state.user);
export const selectUserFavorites = createSelector(
  selectUserState,
  (state) => state.user.favoriteCharacters,
);
export const selectToken = createSelector(selectUserState, (state) => state.token);

export const selectIsCharacterFavorite = ({ characterId }: { characterId: string }) => {
  return createSelector(selectUserFavorites, (favorites: string[]) => {
    return favorites.includes(characterId);
  });
};
