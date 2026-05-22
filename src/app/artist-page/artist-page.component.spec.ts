import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistPageComponent } from './artist-page.component';
import { provideRouter } from '@angular/router';

describe('ArtistPageComponent', () => {
  let component: ArtistPageComponent;
  let fixture: ComponentFixture<ArtistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
