import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { selectAuthLoading } from '../../../state/auth/auth.selectors';
import { authActions } from '../../../state/auth/auth.actions';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAuthLoading,
              value: false,
            },
          ],
        }),
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch login action on submit', () => {
    spyOn(store, 'dispatch');
    component.form.setValue({ email: 'test@mail.com', password: '123456' });
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.login({
        user: { email: 'test@mail.com', password: '123456' },
      }),
    );
  });
});
