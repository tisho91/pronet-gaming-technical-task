import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUser } from '../../state/user/user.selectors';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { Header } from './header/header';
import { authActions } from '../../state/auth/auth.actions';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatSidenavContent,
    MatListItem,
    Header,
    RouterLink,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  store: Store = inject(Store);
  user = toSignal(this.store.select(selectUser));
  router: Router = inject(Router);
  @ViewChild('snav') sidenav!: MatSidenav;

  ngOnInit() {}

  ngAfterViewInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.sidenav?.opened) {
        this.sidenav.close();
      }
    });
  }

  logout() {
    this.store.dispatch(authActions.logout());
  }
}
