import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-button',
  imports: [],
  templateUrl: './form-button.html',
  styleUrl: './form-button.scss',
})
export class FormButton {
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() loading: boolean = false;

  @Output() onClick = new EventEmitter<any>();
}
