import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormInput } from '../../ui/form-input/form-input';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication-service';
import { FormButton } from '../../ui/form-button/form-button';
import { Store } from '@ngrx/store';
import { authActions } from '../../../state/auth/auth.actions';
import { selectAuthLoading } from '../../../state/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, FormInput, RouterLink, FormButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form: FormGroup;
  store = inject(Store);
  isLoading$ = toSignal(this.store.select(selectAuthLoading), {
    initialValue: false,
  });
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  onSubmit() {
    this.store.dispatch(
      authActions.login({
        user: this.form.value,
      }),
    );
  }
}
