import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Character, CharactersState } from './characters.reducer';

export const charactersStateSelector = createFeatureSelector<CharactersState>('characters');
export const selectPageSize = createSelector(charactersStateSelector, (state) => state.pageSize);
export const selectCharactersList = createSelector(
  charactersStateSelector,
  (state) => state.characters,
);

export const selectCharactersLoading = createSelector(
  charactersStateSelector,
  (state) => state.isLoading,
);

export const selectLastLoadedPage = createSelector(
  charactersStateSelector,
  (state) => state.lastLoadedPage,
);
export const selectLastPage = createSelector(charactersStateSelector, (state) => state.lastPage);

export const selectIsLoading = createSelector(charactersStateSelector, (state) => state.isLoading);

export const selectCharacter = ({ characterId }: { characterId: string }) => {
  return createSelector(selectCharactersList, (characters: Character[]) => {
    return characters.find((character) => character.id === characterId);
  });
};
