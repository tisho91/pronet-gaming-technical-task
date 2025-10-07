import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Character } from './characters.reducer';

export const charactersActions = createActionGroup({
  source: 'characters',
  events: {
    'Get Characters': props<{ page: number }>(),
    'Get Characters Success': props<{
      characters: Character[];
      lastPage: number;
      lastLoadedPage: number;
    }>(),
    'Get Characters Failure': emptyProps(),
  },
});
