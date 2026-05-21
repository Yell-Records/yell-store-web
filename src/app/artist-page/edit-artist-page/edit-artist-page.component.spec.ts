import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArtistPageComponent } from './edit-artist-page.component';
import { provideRouter } from '@angular/router';

describe('EditArtistPageComponent', () => {
  let component: EditArtistPageComponent;
  let fixture: ComponentFixture<EditArtistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditArtistPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EditArtistPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
