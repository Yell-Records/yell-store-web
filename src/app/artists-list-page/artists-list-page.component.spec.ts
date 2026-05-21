import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsListPageComponent } from './artists-list-page.component';
import { provideRouter } from '@angular/router';

describe('ArtistsListPageComponent', () => {
  let component: ArtistsListPageComponent;
  let fixture: ComponentFixture<ArtistsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistsListPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistsListPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
