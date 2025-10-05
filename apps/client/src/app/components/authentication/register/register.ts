import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormInput } from '../../ui/form-input/form-input';
import { Router, RouterLink } from '@angular/router';
import { FormButton } from '../../ui/form-button/form-button';
import { AuthenticationService } from '../../../services/authentication-service';

@Component({
  selector: 'app-register',
  imports: [FormInput, RouterLink, FormButton, ReactiveFormsModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  form: FormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
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
    this.authenticationService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {},
    });
  }
}
