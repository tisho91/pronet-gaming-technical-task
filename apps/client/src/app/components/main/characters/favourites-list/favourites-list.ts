import { Component } from '@angular/core';
import { CharactersList } from '../characters-list/characters-list';

@Component({
  selector: 'app-favourites-list',
  imports: [CharactersList],
  templateUrl: './favourites-list.html',
  styleUrl: './favourites-list.scss',
})
export class FavouritesList {}
