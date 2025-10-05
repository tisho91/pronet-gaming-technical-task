import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-error-popup',
  imports: [MatDialogTitle, MatDialogContent, MatButton, MatDialogActions, MatDialogClose],
  templateUrl: './error-popup.html',
  styleUrl: './error-popup.scss',
})
export class ErrorPopup {
  readonly dialogRef = inject(MatDialogRef<ErrorPopup>);
  data = inject(MAT_DIALOG_DATA);
}
