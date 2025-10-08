import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormInput } from '../../ui/form-input/form-input';
import { RouterLink } from '@angular/router';
import { FormButton } from '../../ui/form-button/form-button';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAuthLoading } from '../../../state/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { authActions } from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-register',
  imports: [FormInput, RouterLink, FormButton, ReactiveFormsModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  form: FormGroup;
  store: Store = inject(Store);
  isLoading = toSignal(this.store.select(selectAuthLoading), {
    initialValue: false,
  });
  constructor() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  get emailFormControl() {
    return this.form.get('email') as FormControl;
  }
  get passwordFormControl() {
    return this.form.get('password') as FormControl;
  }
  get nameFormControl() {
    return this.form.get('name') as FormControl;
  }

  onSubmit() {
    this.store.dispatch(authActions.register({ user: this.form.value }));
  }
}
