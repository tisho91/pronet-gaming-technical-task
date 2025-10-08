import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectCharactersList,
  selectIsLoading,
  selectLastLoadedPage,
  selectLastPage,
} from '../../../../state/characters/characters.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUserFavorites } from '../../../../state/user/user.selectors';
import { CharacterItem } from '../character-item/character-item';
import { charactersActions } from '../../../../state/characters/characters.actions';

@Component({
  selector: 'app-characters-list',
  imports: [CharacterItem],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
})
export class CharactersList {
  @ViewChild('anchor', { static: false }) anchor?: ElementRef;
  filterByFavorites = input<boolean>(false);

  private observer?: IntersectionObserver;

  store = inject(Store);
  characters = toSignal(this.store.select(selectCharactersList), {
    initialValue: [],
  });
  userFavorites = toSignal(this.store.select(selectUserFavorites), {
    initialValue: [],
  });

  lastLoadedPage = toSignal(this.store.select(selectLastLoadedPage), {
    initialValue: 0,
  });

  isLoadingCharacters = toSignal(this.store.select(selectIsLoading), {
    initialValue: false,
  });

  lastPage = toSignal(this.store.select(selectLastPage), {
    initialValue: 1,
  });

  searchWord = signal('');

  constructor() {
    effect(() => {
      if (!this.isLoadingCharacters()) {
        setTimeout(() => {
          this.listenForAnchorVisible();
        }, 0);
      }
    });
  }

  listenForAnchorVisible() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
    if (!this.anchor) {
      return;
    }
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0,
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (this.lastLoadedPage() === this.lastPage()) {
        return;
      }
      if (entry.isIntersecting && !this.isLoadingCharacters()) {
        this.loadCharacters();
      }
    }, options);
    this.observer.observe(this.anchor.nativeElement);
  }

  loadCharacters() {
    if (this.shouldLoadMoreCharacters()) {
      this.store.dispatch(charactersActions.getCharacters({ page: this.lastLoadedPage() + 1 }));
    }
  }

  setSearch($event: any) {
    setTimeout(() => {
      this.searchWord.set($event.target.value);
    }, 300);
  }

  public filteredCharacters = computed(() => {
    if (this.filterByFavorites()) {
      return this.characters().filter((character) => {
        return this.userFavorites().includes(character.id);
      });
    }
    if (this.searchWord()) {
      const word = this.searchWord().toLowerCase();
      return this.characters().filter((character) => {
        return (
          character?.name?.toLowerCase().includes(word) ||
          character?.aliases?.[0]?.toLowerCase().includes(this.searchWord()) ||
          character?.culture?.toLowerCase().includes(this.searchWord())
        );
      });
    }

    return this.characters();
  });

  public shouldLoadMoreCharacters = computed(() => {
    if (!this.filterByFavorites()) {
      return this.lastLoadedPage() < this.lastPage();
    } else {
      return this.userFavorites().length > this.filteredCharacters().length;
    }
  });
}
