import { Routes } from '@angular/router';

export const MainRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/main/main').then((m) => m.Main),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../components/main/characters/characters-list/characters-list').then(
            (m) => m.CharactersList,
          ),
      },
      {
        path: 'characters/:id',
        loadComponent: () =>
          import('../components/main/characters/character-details/character-details').then(
            (m) => m.CharacterDetails,
          ),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../components/main/characters/favourites-list/favourites-list').then(
            (m) => m.FavouritesList,
          ),
      },
    ],
  },
];
