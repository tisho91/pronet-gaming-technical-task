import { Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true,
    },
  ],
})
export class FormInput {
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() formControl!: FormControl;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() required = false;
  value: string = '';

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  onChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChangeFn(newValue);
    this.formControl?.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }

  onTouched() {
    this.onTouchedFn();
  }

  getErrorMessage(): string {
    if (!this.formControl) return '';
    if (this.formControl.hasError('required')) return 'This field is required';
    if (this.formControl.hasError('email')) return 'Invalid email';
    if (this.formControl.hasError('minlength')) return 'Too short';
    return '';
  }

  private onChangeFn: (value: any) => void = () => {};

  private onTouchedFn: () => void = () => {};
}
