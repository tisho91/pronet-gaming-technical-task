import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CharactersList } from './characters-list';
import { CharacterItem } from '../character-item/character-item';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { charactersActions } from '../../../../state/characters/characters.actions';
import {
  selectCharactersList,
  selectIsLoading,
  selectLastLoadedPage,
  selectLastPage,
} from '../../../../state/characters/characters.selectors';
import { selectUserFavorites } from '../../../../state/user/user.selectors';
import { ActivatedRoute } from '@angular/router';

describe('CharactersList', () => {
  let fixture: ComponentFixture<CharactersList>;
  let component: CharactersList;
  let store: MockStore;
  let mockSelect: jasmine.Spy;

  beforeEach(async () => {
    const mockIntersectionObserver = jasmine.createSpy('IntersectionObserver').and.returnValue({
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
    });
    (window as any).IntersectionObserver = mockIntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [CharactersList, CharacterItem],
      providers: [provideMockStore(), { provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    mockSelect = spyOn(store, 'select').and.callFake((selector: any) => {
      switch (selector) {
        case selectCharactersList:
          return of([
            { id: '1', name: 'Jon Snow', aliases: ['Lord Snow'], culture: 'North' },
            { id: '2', name: 'Arya Stark', aliases: ['No One'], culture: 'North' },
            { id: '3', name: 'Tyrion Lanister', aliases: ['The Imp'], culture: 'Lanister' },
          ]);
        case selectUserFavorites:
          return of(['2']);
        case selectLastLoadedPage:
          return of(0);
        case selectLastPage:
          return of(1);
        case selectIsLoading:
          return of(false);
        default:
          return of(null);
      }
    });

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CharactersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getCharacters when loadCharacters is called', () => {
    component.loadCharacters();
    expect(store.dispatch).toHaveBeenCalledWith(charactersActions.getCharacters({ page: 1 }));
  });

  it('should filter characters by favorites correctly', () => {
    fixture.componentRef.setInput('filterByFavorites', true);

    fixture.detectChanges();
    const filtered = component.filteredCharacters();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('2');
  });

  it('should filter characters by searchWord', fakeAsync(() => {
    fixture.componentRef.setInput('filterByFavorites', true);

    component.setSearch({ target: { value: 'Arya' } });
    tick(300);
    const filtered = component.filteredCharacters();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Arya Stark');
  }));

  it('should determine shouldLoadMoreCharacters correctly', () => {
    fixture.componentRef.setInput('filterByFavorites', false);
    expect(component.shouldLoadMoreCharacters()).toBeTrue();
  });

  it('should create IntersectionObserver in listenForAnchorVisible', () => {
    const div = document.createElement('div');
    component.anchor = { nativeElement: div } as any;
    component.listenForAnchorVisible();
    expect((window as any).IntersectionObserver).toHaveBeenCalled();
  });
});
