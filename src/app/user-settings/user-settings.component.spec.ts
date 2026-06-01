import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsComponent } from './user-settings.component';
import { provideRouter } from '@angular/router';
import { UserStore } from '../core/stores/user.store';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: UserStore,
          useValue: {
            user: {
              username: 'test',
              email: 'test@tester.com',
              id: '1',
              role: 'user',
              createdAt: '2026-01-01 00:00:0000',
            },
          },
        },
      ],
      imports: [UserSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
