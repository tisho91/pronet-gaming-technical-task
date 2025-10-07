import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CharactersService } from '../../services/characters-service';
import { userActions } from './user.actions';
import { map, mergeMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private charactersService = inject(CharactersService);

  isCharacterFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.setCharacterFavorite),
      mergeMap(({ characterId, favorite }) => {
        return this.charactersService.setCharacterFavorite({ characterId, favorite }).pipe(
          map(() => {
            return userActions.setCharacterFavoriteSuccess({ favorite, characterId });
          }),
          catchError((err) => {
            return of(userActions.setCharacterFavoriteError());
          }),
        );
      }),
    ),
  );
}
