import { Component, computed, inject, Input } from '@angular/core';
import { userActions } from '../../../../state/user/user.actions';
import { selectUserFavorites } from '../../../../state/user/user.selectors';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-favorite-button',
  imports: [MatIcon],
  templateUrl: './favorite-button.html',
  styleUrl: './favorite-button.scss',
})
export class FavoriteButton {
  @Input() characterId!: string;
  store: Store = inject(Store);

  userFavorites = toSignal(this.store.select(selectUserFavorites));

  isCharacterFavorite = computed(() => {
    return this.userFavorites()?.includes(this.characterId);
  });

  toggleFavorite($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.store.dispatch(
      userActions.setCharacterFavorite({
        characterId: this.characterId,
        favorite: !this.isCharacterFavorite(),
      }),
    );
  }
}
