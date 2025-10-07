import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserDBEntity } from '@pronet/shared';

export const userActions = createActionGroup({
  source: 'User',
  events: {
    'Set Data': props<{ user: UserDBEntity; token: string }>(),
    'Set Token': props<{ token: string }>(),
    'Set User': props<{ user: UserDBEntity }>(),
    'Set Character Favorite': props<{ favorite: boolean; characterId: string }>(),
    'Set Character Favorite Success': props<{ favorite: boolean; characterId: string }>(),
    'Set Character Favorite Error': emptyProps(),
  },
});
