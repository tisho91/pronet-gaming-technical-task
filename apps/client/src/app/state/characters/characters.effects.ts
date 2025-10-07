import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CharactersService } from '../../services/characters-service';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectPageSize } from './characters.selectors';
import { charactersActions } from './characters.actions';
import { map, mergeMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CharactersEffects {
  private actions$ = inject(Actions);
  private charactersService: CharactersService = inject(CharactersService);
  private store: Store = inject(Store);
  private pageSize = toSignal(this.store.select(selectPageSize), {
    initialValue: 1,
  });

  getCharactersForPage$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(charactersActions.getCharacters),
      mergeMap(({ page }) => {
        return this.charactersService.getCharacters({ page, pageSize: this.pageSize() }).pipe(
          map(({ data, lastPage }: any) => {
            return charactersActions.getCharactersSuccess({
              characters: data,
              lastPage: lastPage,
              lastLoadedPage: page,
            });
          }),
          catchError((err) => {
            return of(charactersActions.getCharactersFailure());
          }),
        );
      }),
    ),
  );
}
