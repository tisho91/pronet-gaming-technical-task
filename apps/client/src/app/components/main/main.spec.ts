import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Main } from './main';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectUser } from '../../state/user/user.selectors';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingHarness } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mock',
  template: ``,
})
class AppMockComponent {}

xdescribe('Main', () => {
  let component: Main;
  let fixture: ComponentFixture<Main>;
  let store: MockStore;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Main],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectUser,
              value: {
                id: '1',
                name: 'User',
              },
            },
          ],
        }),
        { provide: ActivatedRoute, useValue: {} },
        provideRouter([{ path: 'favorites', component: AppMockComponent }]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(Main);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should see favorites link', () => {
    expect(component).toBeTruthy();
    const links = fixture.debugElement.queryAll(By.css('a'));
    const favoritesLink = links.find((link) => {
      return link.nativeElement.textContent.includes('Favorite');
    });
    expect(favoritesLink).toBeTruthy();
  });

  it('should not see favorites link', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/favorites');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const links = fixture.debugElement.queryAll(By.css('a'));
    const favoritesLink = links.find((link) => {
      return link.nativeElement.textContent.includes('Favorite');
    });
    const mainLink = links.find((link) => {
      return link.nativeElement.textContent.includes('Characters List');
    });
    expect(favoritesLink).toBeFalsy();
    expect(mainLink).toBeTruthy();
  });

  it('should call logout on Logout click', () => {
    spyOn(component, 'logout');
    const logoutLink = fixture.debugElement
      .queryAll(By.css('.navigation-item'))
      .find((el: any) => el.nativeElement.textContent.includes('Logout'));
    logoutLink?.nativeElement?.click();
    expect(component.logout).toHaveBeenCalled();
  });
});
