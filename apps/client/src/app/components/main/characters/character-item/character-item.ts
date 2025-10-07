import { Component, input } from '@angular/core';
import { Character } from '../../../../state/characters/characters.reducer';
import { RouterLink } from '@angular/router';
import { FavoriteButton } from '../favorite-button/favorite-button';

@Component({
  selector: 'app-character-item',
  imports: [RouterLink, FavoriteButton],
  templateUrl: './character-item.html',
  styleUrl: './character-item.scss',
})
export class CharacterItem {
  character = input.required<Character>();
}
