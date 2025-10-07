import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../state/user/user.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatIconButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  store: Store = inject(Store);
  user$ = toSignal(this.store.select(selectUser));
  @Input() sideNavRef: MatSidenav | undefined;
}
