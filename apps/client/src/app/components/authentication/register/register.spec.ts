import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authActions } from '../../../state/auth/auth.actions';
import { selectAuthLoading } from '../../../state/auth/auth.selectors';
import { ActivatedRoute } from '@angular/router';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let store: MockStore;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectAuthLoading, value: false }],
        }),
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch register action on submit', () => {
    spyOn(store, 'dispatch');
    component.form.setValue({ email: 'test@mail.com', password: '123456', name: 'testName' });
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.register({
        user: { email: 'test@mail.com', password: '123456', name: 'testName' },
      }),
    );
  });
});
