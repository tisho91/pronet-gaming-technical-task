import { createReducer, on } from '@ngrx/store';
import { charactersActions } from './characters.actions';

export interface Character {
  id: string;
  url?: string;
  name?: string;
  gender?: string;
  culture?: string;
  born?: string;
  died?: string;
  titles?: string[];
  aliases?: string[];
  father?: string;
  mother?: string;
  spouse?: string;
  allegiances?: string[];
  books?: string[];
  povBooks?: string[];
  tvSeries?: string[];
  playedBy?: string[];
}

export interface CharactersState {
  isLoading: boolean;
  pageSize: number;
  characters: Character[];
  lastPage: number;
  lastLoadedPage: number;
}

export const initialState = {
  isLoading: false,
  characters: [],
  pageSize: 25,
  lastPage: 1,
  lastLoadedPage: 0,
};

export const charactersReducer = createReducer<CharactersState>(
  initialState,
  on(charactersActions.getCharacters, (state) => {
    return { ...state, isLoading: true };
  }),
  on(charactersActions.getCharactersSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      lastPage: action.lastPage,
      characters: [...state.characters, ...action.characters],
      lastLoadedPage: action.lastLoadedPage,
    };
  }),
);
