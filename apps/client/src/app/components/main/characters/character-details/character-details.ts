import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCharacter } from '../../../../state/characters/characters.selectors';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Character } from '../../../../state/characters/characters.reducer';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatChip, MatChipListbox } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { FavoriteButton } from '../favorite-button/favorite-button';

const emptyCharacter: Character = {
  id: '',
  url: '',
  name: '',
  gender: '',
  culture: '',
  born: '',
  died: '',
  titles: [],
  aliases: [],
  father: '',
  mother: '',
  spouse: '',
  allegiances: [],
  books: [],
  povBooks: [],
  tvSeries: [],
  playedBy: [],
};

@Component({
  selector: 'app-character-details',
  imports: [MatList, MatListItem, MatDivider, MatChipListbox, MatChip, MatIcon, FavoriteButton],
  templateUrl: './character-details.html',
  styleUrl: './character-details.scss',
})
export class CharacterDetails {
  store = inject(Store);
  route = inject(ActivatedRoute);
  characterId: string = this.route.snapshot.paramMap.get('id') || '';

  characterSignal = toSignal(
    this.store.select(selectCharacter({ characterId: this.characterId })),
    {
      initialValue: { ...emptyCharacter, id: this.characterId },
    },
  );
  character: Character = this.characterSignal() || { id: this.characterId };

  hasValue(value: string | string[] | undefined): boolean {
    if (!value) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0 && (value.length > 1 || value[0] !== '');
    }
    return value.trim().length > 0;
  }

  formatArray(value: string[] | undefined): string {
    return value?.filter((item) => item.trim() !== '').join(', ') || '';
  }

  getIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
