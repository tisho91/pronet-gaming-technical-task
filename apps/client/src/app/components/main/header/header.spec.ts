import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { provideMockStore } from '@ngrx/store/testing';
import { selectUser } from '../../../state/user/user.selectors';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectUser,
              value: {
                id: '12',
                name: 'User',
              },
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent.includes('Welcome, User')).toBeTruthy();
  });
});
