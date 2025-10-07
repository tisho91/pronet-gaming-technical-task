import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginUser, RegisterUser, UserDBEntity } from '@pronet/shared';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    Register: props<{ user: RegisterUser }>(),
    Login: props<{ user: LoginUser }>(),
    Logout: emptyProps(),
    'Init Session': props<{ token: string }>(),
    'Init Session Success': props<{ user: UserDBEntity; token: string }>(),
    'Init Session Failure': props<{ error: string[] | null }>(),
  },
});
